export class Manager {
    constructor() { }

    app

    _canvasWidth
    _canvasHeight

    _minHeight
    _maxHeight

    currentScene
    scale

    static get canvasWidth() {
        return Manager._canvasWidth
    }
    static get canvasHeight() {
        return Manager._canvasHeight
    }
    static get minHeight() {
        return Manager._minHeight
    }
    static get maxHeight() {
        return Manager._maxHeight
    }

    static initialize(width, minHeight, maxHeight, background) {
        Manager._minHeight = minHeight
        Manager._maxHeight = maxHeight

        Manager.app = new PIXI.Application({
            view: document.getElementById("game"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            resizeTo: document.getElementById("game-container")
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
        Manager.app.resize()

        Manager._canvasHeight = Manager.app.view.clientHeight
        Manager._canvasWidth = Manager.app.view.clientWidth

        if (Manager.currentScene) {
            Manager.currentScene.onResize?.()
        }
    }
}