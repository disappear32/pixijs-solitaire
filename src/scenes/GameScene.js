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
        this.background.width = Manager.gameArea.width
        this.background.height = Manager.gameArea.maxHeight
        this.gameContainer.addChild(this.background)

        const gameContext = new PIXI.Container()
        gameContext.x = 0
        gameContext.y = (Manager.gameArea.maxHeight - Manager.gameArea.minHeight) / 2
        this.gameContainer.addChild(gameContext)

        const rect = new PIXI.Graphics()
        rect.beginFill(0xFF00FF, 0.0001)
        rect.drawRect(0, 0, Manager.gameArea.width, Manager.gameArea.minHeight)
        gameContext.addChild(rect)

        this.onResize()
    }

    update(framesPassed) {
        TWEEN.update()
    }

    onResize() {
        const { 
            width: canvasWidth, 
            height: canvasHeight 
        } = Manager.canvasArea

        const { 
            width: gameWidth, 
            currHeight: gameHeight, 
            minHeight: gameMinHeight, 
            maxHeight: gameMaxHeight 
        } = Manager.gameArea

        const RESIZE_STAGE = Manager.RESIZE_STAGE
        const currResizeStageId = Manager.currResizeStageId
    
        const scale = Math.max(canvasHeight / gameMaxHeight, canvasWidth / gameWidth)

        let offsetY
        switch(currResizeStageId) {
            case RESIZE_STAGE.MAX:
                offsetY = -1 * scale * (gameMaxHeight - gameMinHeight) / 2

                break

            case RESIZE_STAGE.CHANGING:
                offsetY = -1 * scale * (gameMaxHeight - gameHeight) / 2

                break

            case RESIZE_STAGE.MIN:
                offsetY = 0

                break
        }

        this.gameContainer.y = offsetY
        this.gameContainer.scale.set(scale, scale)
    }
}
