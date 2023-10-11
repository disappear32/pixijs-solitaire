export class CardView extends PIXI.Container {
    width
    height

    name
    suit
    value

    flipState

    stackId
    slotId

    isDeckCard
    isSlotCard
    isStackCard

    isOpen

    indexInStack
    indexInSlot

    initPosX
    initPosY

    constructor(gameContainer, x, y, width, height, name, suit, value) {
        super()

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.name = name
        this.suit = suit
        this.value = value
        this.isOpen = false
        this.zIndex = 1
        
        this.isDeckCard = false
        this.isSlotCard = false
        this.isStackCard = false

        gameContainer.addChild(this)

        this.front = PIXI.Sprite.from(this.name)
        this.front.width = this.width
        this.front.height = this.height
        this.front.visible = false

        this.back = PIXI.Sprite.from('card_back')
        this.back.width = this.width
        this.back.height = this.height

        this.addChild(this.front, this.back)
    }

    flipInStak() {

    }

    flipInDeck() {
        const animTime = 300
        this.move({ x: this.x - this.width - 5, y: this.y }, animTime)

        let faceSprite = this.back
        const tween = new TWEEN.Tween({ scaleX: 1 })
            .to({ scaleX: 0 }, animTime / 2)
            .repeat(1)
            .yoyo(true)
            .onUpdate((object) => {
                faceSprite.setTransform(0, 0, object.scaleX)
            })
            .onRepeat(() => {
                this.front.setTransform(0, 0, 0.001)
                this.front.visible = true

                this.back.visible = false
                this.back.setTransform(0, 0, 1)

                faceSprite = this.front
            })
            .onComplete(() => {
                this.isOpen = true
            })
            .start()
    }

    flipAndMoveToStackPos(to) {
        this.setSpritesAnchor(0.5)

        const animTime = 100
        this.move(to, animTime)

        let faceSprite = this.back
        const tween = new TWEEN.Tween({ scaleX: 1 })
            .to({ scaleX: 0 }, animTime / 2)
            .repeat(1)
            .yoyo(true)
            .onUpdate((object) => {
                faceSprite.setTransform(this.width / 2, this.height / 2, object.scaleX)
            })
            .onRepeat(() => {
                this.front.setTransform(this.width / 2, this.height / 2, 0.001)
                this.front.visible = true

                this.back.visible = false
                this.back.setTransform(this.width / 2, this.height / 2, 1)

                faceSprite = this.front
            })
            .onComplete(() => {
                this.setSpritesAnchor(0)

                this.isOpen = true
            })
            .start()

    }

    move(to, timeAnim = 100) {
        const from = { x: this.x, y: this.y }

        const tween = new TWEEN.Tween(from)
            .to(to, timeAnim)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate((obj) => {
                this.x = from.x
                this.y = from.y
            })
            .start()
    }

    returnToInitialPos() {
        const tween = new TWEEN.Tween({ x: this.x, y: this.y })
            .to({ x: this.initPosX, y: this.initPosY }, 200)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onStart(() => {
                this.interactive = false
            })
            .onUpdate((object) => {
                this.x = object.x
                this.y = object.y
            })
            .onComplete(() => {
                this.interactive = true
            })
            .start()
    }

    setSpritesAnchor(anchor) {
        this.front.anchor.set(anchor)
        this.front.position.set(this.width * anchor, this.height * anchor)

        this.back.anchor.set(anchor)
        this.back.position.set(this.width * anchor, this.height * anchor)
    }
}