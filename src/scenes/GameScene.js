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

        //const renderer = PIXI.autoDetectRenderer()
        this.createCardTextures()

        const test = PIXI.Sprite.from('10_heart')
        test.x = 100
        test.y = 100
        gameContext.addChild(test)
    }

    update(framesPassed) {
        TWEEN.update()
    }

    createCardTextures() {
        const suits = [
            { name: 'diamond', color: 0xFF0000 },
            { name: 'heart', color: 0xFF0000 },
            { name: 'spade', color: 0x000000 },
            { name: 'club', color: 0x000000 }
        ]
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        const cardSize = { width: 45, height: 70 }

        suits.forEach((suit) => {
            values.forEach((value) => {
                const backTexture = PIXI.Sprite.from('card_back')
                backTexture.position.set(0, 0)
                backTexture.width = cardSize.width
                backTexture.height = cardSize.height

                const valueTexture = PIXI.Sprite.from(suit.name)
                valueTexture.position.set(28, 5)
                valueTexture.width = 12
                valueTexture.height = 12

                const topText = new PIXI.Text(value, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 16,
                    align: 'left',
                    fontFamily: "\"Trebuchet MS\", Helvetica, sans-serif",
                    fontWeight: "bold",
                }))
                topText.position.set(4, 2)

                const middleText = new PIXI.Text(value, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 32,
                    align: 'left',
                    fontFamily: "\"Trebuchet MS\", Helvetica, sans-serif",
                    fontWeight: "bold",
                }))
                middleText.position.set(2, 26)

                const cardContainer = new PIXI.Container()
                cardContainer.addChild(backTexture, valueTexture, topText, middleText)

                const cardTexture = PIXI.RenderTexture.create({ width: cardSize.width, height: cardSize.height, resolution: 5})
                Manager.app.renderer.render(cardContainer, { renderTexture: cardTexture })

                PIXI.Texture.addToCache(cardTexture, value + '_' + suit.name)
            })
        })
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
        switch (currResizeStageId) {
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
