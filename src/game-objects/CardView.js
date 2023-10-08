export class CardView extends PIXI.Container {
    width
    height

    name
    suit
    value

    flipState

    stackId
    slotId

    _isOpen

    indexInStack
    indexInSlot

    prevPosX
    prevPosY

    constructor(gameContainer, x, y, width, height, name, suit, value) {
        super()

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.name = name
        this.suit = suit
        this.value = value
        this._isOpen = false

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

    get isOpen() {
        return this._isOpen
    }

    set isOpen(bool) {
        this.interactive = bool
        this.buttonMode = bool

        this.on('pointerdown', (event) => {
            this.onDragStart(event)
        })
        this.on('pointermove', (event) => {
            this.onDragMove(event)
        })
        this.on('pointerup', (event) => {
            this.onDragEnd(event)
        })

        this._isOpen = bool
    }

    onDragStart(event) {
        event.stopPropagation()

        if (this.isOpen) {
        
            this.prevPosX = this.x
            this.prevPosY = this.y

            this.lastPosition = event.data.getLocalPosition(this.parent)
        }
    }

    onDragMove(event) {
        event.stopPropagation()

        if (this.lastPosition) {

            const newPosition = event.data.getLocalPosition(this.parent)
            this.x += (newPosition.x - this.lastPosition.x)
            this.y += (newPosition.y - this.lastPosition.y)
            this.lastPosition = newPosition
        }
    }

    onDragEnd() {
        //this.off("pointermove")

        this.x = this.prevPosX
        this.y = this.prevPosY
    }

    dragToCurrentPosition(x, y) {

    }

    returnToPreviousPosition() {

    }

    flipInStak() {

    }

    flipInDeck() {

    }

    move(to, timeAnim = 100) {
        const from = { x: this.x, y: this.y }

        const tween = new TWEEN.Tween(from)
            .to(to, timeAnim)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.x = from.x
                this.y = from.y
            })
            .start()
    }

    flipAndMoveToStackPos(to) {
        this.cacheAsBitmap = false

        this.front.anchor.set(0.5)
        this.front.position.set(this.width / 2, this.height / 2)

        this.back.anchor.set(0.5)
        this.back.position.set(this.width / 2, this.height / 2)

        const animTime = 300
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


                this.cacheAsBitmap = true
            })
            .start()

    }

    addToStack(stackId, indexInStack) {
        this.stackId = stackId
        this.indexInStack = indexInStack
    }

    addToSlot(slotId, indexInSlot) {
        this.slotId = slotId
        this.indexInSlot = indexInSlot
    }
}