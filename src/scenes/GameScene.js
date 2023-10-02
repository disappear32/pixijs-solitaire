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
        this.background.x = 0
        this.background.y = 0
        this.background.width = Manager.settings.width
        this.background.height = Manager.settings.maxHeight
        this.gameContainer.addChild(this.background)
        
        this.onResize()
    }

    update(framesPassed) {
        TWEEN.update()
    }

    onResize() {
        const scaleFactor = Manager.canvasWidth / Manager.settings.width

        let offsetY
        if (Manager.heightStage == 'maxHeight') {
            offsetY = -1 * Manager.canvasHeight / Manager.settings.minHeight * (Manager.settings.maxHeight - Manager.settings.minHeight) / 2
        } 
        else if (Manager.heightStage == 'changingHeight') {
            offsetY = -1 * (Manager.settings.maxHeight * scaleFactor - Manager.canvasHeight) / 2
        } 
        if (Manager.heightStage == 'minHeight') {
            offsetY = 0
        }
        this.gameContainer.y = offsetY

        const scale = Math.max(Manager.canvasHeight / Manager.settings.maxHeight, Manager.canvasWidth / Manager.settings.width)
        this.gameContainer.scale.set(scale, scale)
    }
}
