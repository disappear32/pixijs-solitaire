export class Manager {
    constructor() { }

    app
    _width
    _height

    _canvasWidth
    _canvasHeight

    _minHeight
    _maxHeight

    currentScene
    scale

    static get width() {
        return Manager._width
    }
    static get height() {
        return Manager._height
    }
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
        Manager._width = width
        Manager._height = maxHeight
        Manager._minHeight = minHeight
        Manager._maxHeight = maxHeight

        Manager.app = new PIXI.Application({
            view: document.getElementById("game"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            resizeTo: document.getElementById("game-container")
        })
        
        Manager._canvasWidth = document.getElementById('game').clientWidth
        Manager._canvasHeight = document.getElementById('game').clientHeight 

        Manager.app.ticker.add(Manager.update)
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
        if (Manager.currentScene) {
            Manager.currentScene.onResize()
        }

        Manager._canvasHeight = document.getElementById('game').clientHeight
        Manager._canvasWidth = document.getElementById('game').clientWidth
    }
}