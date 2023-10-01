import { Manager } from "../Manager.js"

export class GameScene extends PIXI.Container {
    constructor() {
        super()

        this.gameContainer = new PIXI.Container()
        this.gameContainer.x = 0
        this.gameContainer.y = 0
        this.addChild(this.gameContainer)

        //Бэк
        this.background = PIXI.Sprite.from('background')
        this.background.anchor.set(0.5)
        this.background.x = 412 / 2
        this.background.y = 720 / 2
        this.background.width = 412
        this.background.height = 720
        this.gameContainer.addChild(this.background)
        //this.gameContainer.visible = false
    }

    update(framesPassed) {
        TWEEN.update()
    }

    onResize() {
        const scale = Math.max(Manager.canvasHeight / 720, Manager.canvasWidth / 412)
        this.gameContainer.scale.set(scale, scale)
        this.gameContainer.y = - ((Manager.canvasHeight / 720) / 2)
        this.gameContainer.x = - ((Manager.canvasWidth / 412) / 2)
    }
}
