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
        
        card.indexInDeck = this.cards.indexOf(card)
        card.isDeckCard = true

        card.isOpen = false
        card.interactive = true

        card.initPosX = this.x
        card.initPosY = this.y
        card.x = this.x
        card.y = this.y
    }

    removeCard(card) {
        card.isDeckCard = false
        card.indexInDeck = undefined

        this.cards.pop()
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