export default class GameLogic {

    app
    currentScene

    constructor() { }

    initializeApp(width, minHeight, maxHeight, backgroundColor, canvas, parentDiv) {

        this.app = new PIXI.Application({
            view: canvas,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: backgroundColor,
            resizeTo: parentDiv
        })

        this.app.ticker.add(this.update)

        window.addEventListener('resize', () => {
            this.resize(parentDiv)
        })

        this.resize(parentDiv)
    }

    changeScene(newScene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene)
            this.currentScene.destroy()
        }

        this.currentScene = newScene
        this.app.stage.addChild(this.currentScene)
    }

    resize(parentDiv) { this.currentScene?.onResize(parentDiv) }

    update(framesPassed) {
        if (this.currentScene) this.currentScene.update(framesPassed)
    }
}