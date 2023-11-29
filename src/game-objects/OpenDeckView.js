export class OpenDeckView {
    width
    height

    cards
    initLength

    constructor(x, y, cardSize) {

        this.x = x
        this.y = y
        this.width = cardSize.width
        this.height = cardSize.height
        this.cards = []
        this.initLength = 0
    }

    get length() {
        return this.cards.length
    }

    get lastCard() {
        return this.cards[this.length - 1]
    }

    addCard(card) {
        this.cards.push(card)

        card.isOpen = true
        card.interactive = true
        card.holder = this
        card.initZindex = this.length

        card.initPosX = this.x
        card.initPosY = this.y
    }

    removeCard() {
        this.cards.pop()
    }
}