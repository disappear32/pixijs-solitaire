import { Manager } from "../Manager.js"
import { GameScene } from "./GameScene.js"

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
            }
        }
    ]
}

export class LoaderScene extends PIXI.Container {
    constructor() {
        super()

        this.initializeLoader().then(() => {
            this.gameLoaded()
        })

    }

    async initializeLoader() {
        await PIXI.Assets.init({ manifest: manifest })

        const bundleIds = manifest.bundles.map(bundle => bundle.name)

        await PIXI.Assets.loadBundle(bundleIds)
    }

    async gameLoaded() {
        Manager.changeScene(new GameScene())
    }

    update() {

    }
}