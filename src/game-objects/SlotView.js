export class SlotView {
    x
    y
    width
    height

    cardSize

    id
    name

    cards

    parent

    border
    isActive

    static lineSize = 2
    static borderRadius = 5

    constructor(gameContainer, x, y, id, name, cardSize) {
        this.x = x 
        this.y = y
        this.width = cardSize.width
        this.height = cardSize.height
        this.cardSize = cardSize
        this.id = id
        this.name = name
        this.cards = []
        this.parent = gameContainer

        const borderX = this.x - SlotView.lineSize
        const borderY = this.y - SlotView.lineSize
        const borderWidth = this.width + SlotView.lineSize * 2
        const borderHeight = this.height + SlotView.lineSize * 2
        const borderRadius = SlotView.borderRadius

        this.createBorder(borderX, borderY, borderWidth, borderHeight, borderRadius)
        this.hideBorder()
        
        const background = PIXI.Sprite.from('slot_' + this.name)
        background.x = this.x
        background.y = this.y
        background.width = this.width
        background.height = this.height
        this.parent.addChild(background)
    }

    get length() {
        return this.cards.length
    }

    addCard(card) {
        this.cards.push(card)

        card.holder = this
        card.initZindex = this.length

        card.initPosX = this.x
        card.initPosY = this.y
    }

    removeCard() {
        this.cards.pop()
    }

    createBorder(borderX, borderY, borderWidth, borderHeight, borderRadius) {
        this.border = new PIXI.Graphics()
        this.border.beginFill(0xFF3300)
        this.border.drawRoundedRect(borderX, borderY, borderWidth, borderHeight, borderRadius)
        this.border.endFill()
        this.border.visible = false
        this.parent.addChild(this.border)
    }

    showBorder() {
        this.isActive = true
        this.border.visible = true
    }

    hideBorder() {
        this.isActive = false
        this.border.visible = false
    }
}