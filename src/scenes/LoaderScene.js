import { Manager } from "../Manager.js"
import { GameScene } from "./GameScene.js"

const manifest = {
    bundles: [
        {
            name: "UI Bundle",
            assets:
            {
                "play": "./resources/background.png",
                "background": "./resources/game-background.jpg"
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