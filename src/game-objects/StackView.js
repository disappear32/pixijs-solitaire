export class StackView {
    x
    y
    width
    height

    cardSize
    cardGapY

    id

    cards
    initLenght

    parent

    border
    isActive

    static lineSize = 2
    static borderRadius = 5
    static minHeight

    constructor(gameContainer, x, y, id, initLenght, cardSize) {
        this.x = x
        this.y = y
        this.width = cardSize.width
        this.height = 0
        this.cardSize = cardSize
        this.cardGapY = 20
        this.id = id
        this.cards = []
        this.initLenght = initLenght
        this.parent = gameContainer
        StackView.minHeight = cardSize.height

        this.createBorder() 
    }

    get length() {
        return this.cards.length
    }

    addCard(card, isOpen = true) {
        this.cards.push(card)
        this.updateHeight()

        card.isOpen = isOpen
        card.interactive = isOpen
        card.holder = this
        card.initZindex = this.length

        const cardPos = this.getCardPositionByIndex(card.indexInHolder)
        card.initPosX = cardPos.x
        card.initPosY = cardPos.y
    }

    removeCard(isFlip = true) {
        this.cards.pop()
        this.updateHeight()

        if (this.length > 0 && isFlip) {

            const indexOfPrevCard = this.length - 1
            const lastCard = this.cards[indexOfPrevCard]

            if (!lastCard.isOpen) {
                lastCard.flipInStak(350)
                lastCard.isOpen = true
            }
        }
    }

    updateHeight() {
        this.height = Math.max((this.cards.length - 1) * this.cardGapY + this.cardSize.height, StackView.minHeight)

        this.updateBorderHeight()
    }

    createBorder() {
        this.border = new PIXI.NineSlicePlane(PIXI.Texture.from('border'), 7, 7, 7, 7)
        this.border.x = this.x - StackView.lineSize
        this.border.y = this.y - StackView.lineSize
        this.parent.addChild(this.border)
        this.hideBorder()
    }

    updateBorderHeight() {
        this.border.height = Math.max(this.height + StackView.lineSize * 2, StackView.minHeight)
    }

    showBorder() {
        this.isActive = true
        this.border.visible = true
    }

    hideBorder() {
        this.isActive = false
        this.border.visible = false
    }

    getCardPositionByIndex(index) {
        return {
            x: this.x,
            y: this.y + this.cardGapY * index
        }
    }
}