export class StackView {
    x
    y
    width
    height
    cardGapY

    id

    cards
    initLenght

    constructor(gameContainer, x, y, id, initLenght, cardSize) {
        this.x = x 
        this.y = y
        this.width = cardSize.width
        this.height = 0
        this.cardGapY = 20 
        this.id = id
        this.cards = []
        this.initLenght = initLenght
    }

    get length() {
        return this.cards.length
    }

    addCard(card, isOpen = true) {
        this.cards.push(card)

        const stackId = this.id
        const cardIndexInStack = this.cards.indexOf(card)

        card.addToStack(stackId, cardIndexInStack)

        card.isOpen = isOpen
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