export class DeckView {
    x
    y
    width
    height

    cards
    length

    constructor(gameContainer, cardSize) {
        this.x = 315
        this.y = 45
        this.width = cardSize.width
        this.height = cardSize.height
        this.length = 0

        const background = PIXI.Sprite.from('reboot_deck')
        background.x = this.x
        background.y = this.y
        background.width = this.width
        background.height = this.height
        gameContainer.addChild(background)
    }

    addCard(args) {

        if (args instanceof Array) {
            const arrayCards = arguments[0]

            arrayCards.forEach((card) => {
                card.x = this.x
                card.y = this.y
            }) 
        }
        
        if (args instanceof Object) {
            const card = arguments[0]
            
            card.x = this.x
            card.y = this.y
        }
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