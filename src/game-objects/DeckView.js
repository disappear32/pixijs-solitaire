export class DeckView extends PIXI.Sprite {
    width
    height

    cards
    initLength

    constructor(x, y, cardSize, gameContainer) {
        super(PIXI.Texture.from('reboot_deck'))

        this.x = x
        this.y = y
        this.width = cardSize.width
        this.height = cardSize.height
        this.cards = []
        this.initLength = 24
        this.interactive = true

        gameContainer.addChild(this)
    }

    get length() {
        return this.cards.length
    }

    addCard(card, isOpen = false) {
        this.cards.push(card)

        card.isOpen = isOpen
        card.interactive = isOpen
        card.holder = this
        card.initZindex = this.length

        card.initPosX = this.x
        card.initPosY = this.y
    }

    removeCard() {
        this.cards.pop()
    }
}