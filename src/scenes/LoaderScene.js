import { Manager } from "../Manager.js"
import { GameScene } from "./GameScene.js"
import Settings from "../utils/Settings.js"

const manifest = {
    bundles: [
        {
            name: "UI Bundle",
            assets:
            {
                "background": "./resources/game-background.jpg"
            }
        },
        {
            name: "Cards Bundle",
            assets:
            {
                "spade": "./resources/spade.png",
                "club": "./resources/club.png",
                "heart": "./resources/heart.png",
                "diamond": "./resources/diamond.png",
                "card_back": "./resources/card_back.png",
                "card_front": "./resources/card_front.png",
                "reboot_deck": "./resources/reboot_deck.png",
            }
        }
    ]
}

export class LoaderScene extends PIXI.Container {
    constructor() {
        super()

        this.initializeLoader().then(() => {
            this.createGameTextures()
            this.gameLoaded()
        })

    }

    async initializeLoader() {
        await PIXI.Assets.init({ manifest: manifest })

        const bundleIds = manifest.bundles.map(bundle => bundle.name)

        await PIXI.Assets.loadBundle(bundleIds)
    }


    createGameTextures() {
        const suits = Settings.suits
        const values = Settings.values
        const cardSize = Settings.cardSize

        this.createSlotTextures(suits, cardSize)
        this.createCardTextures(suits, cardSize, values)
    }

    gameLoaded() {
        Manager.changeScene(new GameScene())
    }

    update() {

    }

    createSlotTextures(suits, cardSize) {
        suits.forEach((suit) => {
            const backTexture = PIXI.Sprite.from('card_front')
            backTexture.position.set(0, 0)
            backTexture.width = cardSize.width
            backTexture.height = cardSize.height

            const suitTexture = PIXI.Sprite.from(suit.name)
            suitTexture.position.set(8, 21)
            suitTexture.alpha = 0.5
            suitTexture.width = 28
            suitTexture.height = 28

            const slotContainer = new PIXI.Container()
            slotContainer.addChild(backTexture, suitTexture)

            const slotTexture = PIXI.RenderTexture.create({ width: cardSize.width, height: cardSize.height, resolution: 5 })
            Manager.app.renderer.render(slotContainer, { renderTexture: slotTexture })

            PIXI.Texture.addToCache(slotTexture, 'slot_' + suit.name)
        })
    }

    createCardTextures(suits, cardSize, values) {
        suits.forEach((suit) => {
            values.forEach((value) => {
                const backTexture = PIXI.Sprite.from('card_front')
                backTexture.position.set(0, 0)
                backTexture.width = cardSize.width
                backTexture.height = cardSize.height

                const suitTexture = PIXI.Sprite.from(suit.name)
                suitTexture.position.set(28, 5)
                suitTexture.width = 12
                suitTexture.height = 12

                const topText = new PIXI.Text(value.name, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 16,
                    align: 'left',
                    fontFamily: "\"Trebuchet MS\", Helvetica, sans-serif",
                    fontWeight: "bold",
                }))
                topText.position.set(4, 2)

                const middleText = new PIXI.Text(value.name, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 32,
                    align: 'left',
                    fontFamily: "\"Trebuchet MS\", Helvetica, sans-serif",
                    fontWeight: "bold",
                }))
                middleText.anchor.set(0.5)
                middleText.position.set(cardSize.width / 2, cardSize.height / 2 + 10)

                const cardContainer = new PIXI.Container()
                cardContainer.addChild(backTexture, suitTexture, topText, middleText)

                const cardTexture = PIXI.RenderTexture.create({ width: cardSize.width, height: cardSize.height, resolution: 5 })
                Manager.app.renderer.render(cardContainer, { renderTexture: cardTexture })

                PIXI.Texture.addToCache(cardTexture, value.name + '_' + suit.name)
            })
        })
    }
}