import { Manager } from "../Manager.js"
import { GameScene } from "./GameScene.js"
import Settings from "../utils/Settings.js"

import * as PIXI from 'pixi.js'

const manifest = {
    bundles: [
        {
            name: "UI Bundle",
            assets:
            {
                "background": "/src/games/solitaire/resources/game-background.jpg",
                "submit": "/src/games/solitaire/resources/submit_button.png",
                "collect": "/src/games/solitaire/resources/collect_button.png",
            }
        },
        {
            name: "Cards Bundle",
            assets:
            {
                "spade": "/src/games/solitaire/resources/spade.png",
                "club": "/src/games/solitaire/resources/club.png",
                "heart": "/src/games/solitaire/resources/heart.png",
                "diamond": "/src/games/solitaire/resources/diamond.png",
                "card_back": "/src/games/solitaire/resources/card_back.png",
                "card_front": "/src/games/solitaire/resources/card_front.png",
                "reboot_deck": "/src/games/solitaire/resources/reboot_deck.png",
                "border": "/src/games/solitaire/resources/border.png",
            }
        },
        {
            name: "Fonts Bundle",
            assets:
            {
                "custom-font": "/src/games/solitaire/resources/FUTURAB.woff2",
            }
        },
    ]
}

export class LoaderScene extends PIXI.Container {
    constructor() {
        super()

        this.loadAssets().then(() => {
            this.createGameTextures()
            this.gameLoaded()
        })

    }

    async loadAssets() {
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
                suitTexture.width = 13
                suitTexture.height = 13
                suitTexture.position.set(29, 5)

                const topText = new PIXI.Text(value.name, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 16,
                    align: 'left',
                    fontFamily: "FUTURAB",
                    fontWeight: "bold",
                }))
                topText.position.set(6, 1)

                const middleText = new PIXI.Text(value.name, new PIXI.TextStyle({
                    fill: suit.color,
                    fontSize: 32,
                    align: 'left',
                    fontFamily: "FUTURAB",
                    fontWeight: 900,
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