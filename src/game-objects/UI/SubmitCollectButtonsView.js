import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'

class SubmitCollectButtonsView extends PIXI.Sprite {
    constructor(gameContainer, x, y, textureName) {
        super(PIXI.Texture.from(textureName))

        this.width = 180
        this.height = 46
        this.anchor.set(0.5)
        this.x = x + this.width / 2
        this.y = y + this.height / 2
        this.visible = false

        gameContainer.addChild(this)
    }

    show(animTime = 200) {
        return new Promise(resolve => {

            const tween = new TWEEN.Tween({ alpha: 0 })
                .to({ alpha: 1 }, animTime / 2)
                .delay(250)
                .onStart(() => {
                    this.visible = true
                })
                .onUpdate(from => { this.alpha = from.alpha })
                .onComplete(() => {
                    this.interactive = true
                    resolve()
                })
                .start()
        })
    }
    hide(animTime = 200) {
        return new Promise(resolve => {

            const tween = new TWEEN.Tween({ alpha: 1 })
                .to({ alpha: 0 }, animTime / 2)
                .delay(250)
                .onStart(() => {
                    this.interactive = false
                    this.interactive = false
                })
                .onUpdate(from => { this.alpha = from.alpha })
                .onComplete(() => {
                    this.visible = false
                    resolve()
                })
                .start()

        })
    }

    pressAnimation(animTime = 200) {
        const tween = new TWEEN.Tween({ scale: 1 })
            .to({ scale: 0.85 }, animTime / 2)
            .repeat(1)
            .yoyo(true)
            .onStart(() => { this.interactive = false })
            .onUpdate(from => { this.scale.set(from.scale, from.scale) })
            .onComplete(() => {
                this.interactive = true
            })
            .start()
    }
}

export class SubmitButtonView extends SubmitCollectButtonsView {
    constructor(gameContainer, x, y) {
        super(gameContainer, x, y, 'submit')
    }
}

export class CollectButtonView extends SubmitCollectButtonsView {
    constructor(gameContainer, x, y) {
        super(gameContainer, x, y, 'collect')
    }
}