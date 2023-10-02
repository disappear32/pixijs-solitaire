export class Manager {
    constructor() { }

    app
    settings
    parentContainer

    _canvasWidth
    _canvasHeight

    currentScene
    scale

    heightStage

    static get canvasWidth() {
        return Manager._canvasWidth
    }
    static get canvasHeight() {
        return Manager._canvasHeight
    }

    static initialize(width, minHeight, maxHeight, backColor) {
        Manager.settings = {
            width: width,
            minHeight: minHeight,
            maxHeight: maxHeight,
            backColor: backColor
        }

        Manager.parentContainer = document.getElementById("game-container")

        Manager.app = new PIXI.Application({
            view: document.getElementById("game"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: backColor,
            resizeTo: Manager.parentContainer
        })

        Manager._canvasWidth = Manager.app.view.clientHeight
        Manager._canvasHeight = Manager.app.view.clientWidth

        Manager.app.ticker.add(Manager.update)

        window.addEventListener('resize', () => {
            Manager.resize()
        })

        Manager.resize()
    }

    static changeScene(newScene) {
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene)
            Manager.currentScene.destroy()
        }

        Manager.currentScene = newScene
        Manager.app.stage.addChild(Manager.currentScene)
    }

    static update(framesPassed) {
        if (Manager.currentScene) {
            Manager.currentScene.update(framesPassed)
        }
    }

    static resize() {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const aspectRatioMax = Manager.settings.width / Manager.settings.maxHeight
        const aspectRatioMin = Manager.settings.width / Manager.settings.minHeight
        const currAspect = viewportWidth / viewportHeight

        let canvasWidth, canvasHeight
        if (currAspect > aspectRatioMin) {
            canvasWidth = viewportHeight * aspectRatioMin
            canvasHeight = viewportHeight
            Manager.heightStage = 'maxHeight'
        } else if (currAspect <= aspectRatioMin && currAspect > aspectRatioMax) {
            canvasWidth = viewportWidth
            canvasHeight = viewportHeight
            Manager.heightStage = 'changingHeight'
        }
        else if (currAspect <= aspectRatioMax) {
            canvasWidth = viewportWidth
            canvasHeight = viewportWidth / aspectRatioMax
            Manager.heightStage = 'minHeight'
        }

        Manager.parentContainer.style.setProperty("width", `${canvasWidth}px`)
        Manager.parentContainer.style.setProperty("height", `${canvasHeight}px`)

        Manager.app.resize()

        Manager._canvasHeight = Manager.app.view.clientHeight
        Manager._canvasWidth = Manager.app.view.clientWidth

        if (Manager.currentScene) {
            Manager.currentScene.onResize?.()
        }
    }
}