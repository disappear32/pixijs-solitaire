export class SlotView {
    x
    y
    width
    height

    id
    name

    cards
    length

    constructor(gameContainer, x, y, id, name, cardSize) {
        this.x = x 
        this.y = y
        this.width = cardSize.width
        this.height = cardSize.height
        this.id = id
        this.name = name
        this.cards = []
        this.length = 0
        
        const background = PIXI.Sprite.from('slot_' + this.name)
        background.x = this.x
        background.y = this.y
        background.width = this.width
        background.height = this.height
        gameContainer.addChild(background)
    }

    addCard() {

    }

    removeCard() {

    }
}