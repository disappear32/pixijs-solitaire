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

        
        const borderX = this.x - StackView.lineSize
        const borderY = this.y - StackView.lineSize
        const borderWidth = this.width + StackView.lineSize * 2
        const borderHeight = this.height + StackView.lineSize * 2
        const borderRadius = StackView.borderRadius

        this.createBorder(borderX, borderY, borderWidth, borderHeight, borderRadius)
        this.hideBorder()
    }

    get length() {
        return this.cards.length
    }

    addCard(card, isOpen = true) {
        this.cards.push(card)
        this.updateHeight()

        const stackId = this.id
        const cardIndexInStack = this.cards.indexOf(card)
        const cardPos = this.getCardPositionByIndex(cardIndexInStack)
        card.addToStack(cardPos, stackId, cardIndexInStack, isOpen)
    }

    removeCard() {
        this.cards.pop()
        this.updateHeight()
    }

    updateHeight() {
        this.height = Math.max((this.cards.length - 1) * this.cardGapY + this.cardSize.height, StackView.minHeight)

        this.updateBorderHeight()
    }

    createBorder(borderX, borderY, borderWidth, borderHeight, borderRadius) {
        if (this.border) this.border.destroy()

        this.border = new PIXI.Graphics()
        this.border.beginFill(0xFF3300)
        this.border.drawRoundedRect(borderX, borderY, borderWidth, borderHeight, borderRadius)
        this.border.endFill()
        this.border.visible = false
        this.parent.addChild(this.border)
    }

    updateBorderHeight() {
        const borderX = this.x - StackView.lineSize
        const borderY = this.y - StackView.lineSize
        const borderWidth = this.width + StackView.lineSize * 2
        const borderHeight = Math.max(this.height + StackView.lineSize * 2, StackView.minHeight)
        const borderRadius = StackView.borderRadius

        this.createBorder(borderX, borderY, borderWidth, borderHeight, borderRadius)
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