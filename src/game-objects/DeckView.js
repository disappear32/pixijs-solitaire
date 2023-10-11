export class DeckView {
    x
    y
    width
    height

    initLength

    cards
    length

    constructor(gameContainer, cardSize) {
        this.x = 315
        this.y = 45
        this.width = cardSize.width
        this.height = cardSize.height
        this.cards = []
        this.length = 0
        this.initLength = 24

        const background = PIXI.Sprite.from('reboot_deck')
        background.x = this.x
        background.y = this.y
        background.width = this.width
        background.height = this.height
        gameContainer.addChild(background)
    }

    addCard(card) {
        this.cards.push(card)

        const cardIndexInDeck = this.cards.indexOf(card)
        const cardPos = { x: this.x, y: this.y }
        card.addToDeck(cardPos, cardIndexInDeck, false)
    }

    dealCards() {

    }

    openCard(card) {

    }

    returnCards() {

    }

    removecard() {

    }
}