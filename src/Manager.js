export class Manager {
    constructor() { }
    app
    currentScene

    canvasArea
    gameArea

    currResizeStageId
    RESIZE_STAGE

    docElement
    parentContainer

    static initialize(width, minHeight, maxHeight, backColor) {
        Manager.docElement = document.documentElement
        Manager.parentContainer = document.getElementById("game-container")
        Manager.app = new PIXI.Application({
            view: document.getElementById("game"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: backColor,
            resizeTo: Manager.parentContainer
        })


        Manager.canvasArea = {
            width: Manager.app.view.clientWidth,
            height: Manager.app.view.clientHeight,
        }
        Manager.gameArea = {
            width: width,
            currHeight: Manager.canvasArea.height / (Manager.canvasArea.width / width),
            minHeight: minHeight,
            maxHeight: maxHeight
        }
        Manager.RESIZE_STAGE = {
            MAX: 0,
            CHANGING: 1,
            MIN: 2
        }

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

        const { 
            width: gameWidth, 
            minHeight: gameMinHeight, 
            maxHeight: gameMaxHeight 
        } = Manager.gameArea
        
        const RESIZE_STAGE = Manager.RESIZE_STAGE

        const aspectRatioMinSize = gameWidth / gameMinHeight
        const aspectRatioMaxSize = gameWidth / gameMaxHeight
        const currentAspectRatio = viewportWidth / viewportHeight

        let canvasWidth, canvasHeight

        if (currentAspectRatio > aspectRatioMinSize) {
            canvasWidth = viewportHeight * aspectRatioMinSize
            canvasHeight = viewportHeight

            Manager.currResizeStageId = RESIZE_STAGE.MAX
        } 
        if (currentAspectRatio <= aspectRatioMinSize && currentAspectRatio > aspectRatioMaxSize) {
            canvasWidth = viewportWidth
            canvasHeight = viewportHeight

            Manager.currResizeStageId = RESIZE_STAGE.CHANGING
        }
        if (currentAspectRatio <= aspectRatioMaxSize) {
            canvasWidth = viewportWidth
            canvasHeight = viewportWidth / aspectRatioMaxSize

            Manager.currResizeStageId = RESIZE_STAGE.MIN
        }

        Manager.docElement.style.setProperty("--app-height", `${viewportHeight}px`)

        Manager.parentContainer.style.setProperty("width", `${canvasWidth}px`)
        Manager.parentContainer.style.setProperty("height", `${canvasHeight}px`)

        Manager.app.resize()

        Manager.canvasArea.width = Manager.app.view.clientWidth
        Manager.canvasArea.height = Manager.app.view.clientHeight

        const scaleFactor = Manager.canvasArea.width / Manager.gameArea.width
        Manager.gameArea.currHeight = Manager.canvasArea.height / scaleFactor

        if (Manager.currentScene) {
            Manager.currentScene.onResize?.()
        }
    }
}