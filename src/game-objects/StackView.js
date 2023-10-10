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
    }

    get length() {
        return this.cards.length
    }

    addCard(card, isOpen = true) {
        this.cards.push(card)
        this.updateStackHeight()

        const stackId = this.id
        const cardIndexInStack = this.cards.indexOf(card)
        card.addToStack(stackId, cardIndexInStack, isOpen)
    }

    updateStackHeight() {
        this.height = (this.cards.length - 1) * this.cardGapY + this.cardSize.height
    }

    showBorder() {
        if (this.border) return 

        const lineSize = 2

        this.border = new PIXI.Graphics()
        this.border.beginFill(0xFF3300)
        this.border.drawRoundedRect(this.x - lineSize, this.y - lineSize, this.width + lineSize * 2, this.height + lineSize * 2, 5)
        this.border.endFill()

        this.parent.addChild(this.border)
    }

    removeBorder() {
        console.log(this.border)
        if (this.border) this.border.destroy()

    }

    removeCard(card) {

    }

    checkIntersection(card) {

    }

    getCardPositionByIndex(index) {
        return {
            x: this.x,
            y: this.y + this.cardGapY * index
        }
    }
}