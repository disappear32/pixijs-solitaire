import { StackView } from "./StackView.js"
import { SlotView } from "./SlotView.js"
import { DeckView } from "./DeckView.js"
import { OpenDeckView } from "./OpenDeckView.js"

export class CardView extends PIXI.Sprite {
    name
    suitName
    suitId
    value

    frontTexture
    backTexture

    holder

    isOpen

    initPosX
    initPosY
    initZindex

    constructor(gameContainer, x, y, cardSize, name, suitName, suitId, value) {
        super(PIXI.Texture.from('card_back'))

        this.x = x
        this.y = y
        this.width = cardSize.width
        this.height = cardSize.height
        this.name = name
        this.suitName = suitName
        this.suitId = suitId
        this.value = value
        this.isOpen = false
        this.zIndex = 1

        this.frontTexture = PIXI.Texture.from(this.name)
        this.backTexture = PIXI.Texture.from('card_back')

        gameContainer.addChild(this)
    }

    get indexInHolder() {
        if (this.isDeckCard || this.isOpenDeckCard || this.isSlotCard || this.isStackCard) return this.holder.cards.indexOf(this)

        return undefined
    }

    get holderId() {
        if (this.isStackCard || this.isSlotCard) return this.holder.id
        if (this.isDeckCard) return 7
        if (this.isOpenDeckCard) return 8

        return undefined
    }

    get isDeckCard() {
        if (this.holder instanceof DeckView) return true

        return false
    }
    get isOpenDeckCard() {
        if (this.holder instanceof OpenDeckView) return true

        return false
    }
    get isSlotCard() {
        if (this.holder instanceof SlotView) return true

        return false
    }
    get isStackCard() {
        if (this.holder instanceof StackView) return true

        return false
    }


    async flipInStak(animTime = 200) {
        const deg = -5

        this.rotate(deg, animTime / 2)
            .flip(animTime, 0.5)
    }

    async flipAndMoveToInitialPos(animTime = 100, easing = TWEEN.Easing.Quadratic.InOut) {

        this.flip(animTime)
        this.moveToInitialPos(animTime, easing)
    }

    async flip(animTime = 200, anchor = 0) {
        return new Promise(resolve => {
            this.anchor.set(anchor)
            this.x += this.width * anchor
            this.y += this.height * anchor

            const tween = new TWEEN.Tween({ scaleX: 1 })
                .to({ scaleX: 0 }, animTime / 2)
                .repeat(1)
                .yoyo(true)
                .onStart(() => { this.interactive = false })
                .onUpdate(from => { this.setTransform(this.x, this.y, from.scaleX) })
                .onRepeat(() => {
                    this.changeTexture()
                    this.setTransform(this.x, this.y, 0.001)
                })
                .onComplete(() => {
                    this.interactive = true

                    this.anchor.set(0)
                    this.x -= this.width * anchor
                    this.y -= this.height * anchor

                    resolve()
                })
                .start()
        })
    }

    rotate(deg, animTime = 100) {
        const tween = new TWEEN.Tween({ deg: 0 })
            .to({ deg: deg }, animTime)
            .repeat(1)
            .yoyo(true)
            .onUpdate(from => { this.angle = from.deg })
            .start()

        return this
    }

    async moveToInitialPos(animTime = 200, easing = TWEEN.Easing.Quadratic.InOut) {
        return new Promise(resolve => {
            const tween = new TWEEN.Tween({ x: this.x, y: this.y })
            .to({ x: this.initPosX, y: this.initPosY }, animTime)
            .easing(easing)
            .onStart(() => { this.interactive = false })
            .onUpdate(from => {
                this.x = from.x
                this.y = from.y
            })
            .onComplete(() => {
                this.interactive = true
                this.zIndex = this.initZindex
                
                resolve()
            })
            .start()
        })
    }

    changeTexture() {
        if (this.texture == this.frontTexture) this.texture = this.backTexture
        else this.texture = this.frontTexture
    }
}