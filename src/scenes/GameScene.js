import { Manager } from "../Manager.js"
import { StackView } from "../game-objects/StackView.js"
import { DeckView } from "../game-objects/DeckView.js"
import { SlotView } from "../game-objects/SlotView.js"
import { CardView } from "../game-objects/CardView.js"
import Settings from "../utils/Settings.js"

export class GameScene extends PIXI.Container {
    adaptiveContainer
    stableGameContainer

    stacks
    slots
    deck

    cards

    constructor() {
        super()

        //Создаем стабильный контейнер, где будем хранить элементы игры
        this.adaptiveContainer = this.createAdaptiveContainer()
        this.stableGameContainer = this.createStableContainer()

        //Создание объектов игры
        const cardSize = Settings.cardSize

        this.stacks = []
        for (let i = 0; i < 7; i++) {
            const stackLength = i + 1
            const stackWidth = cardSize.width
            const stackGap = 5
            const stackX = 15 + i * (stackWidth + stackGap)
            const stackY = 155
            const stackId = i

            const stack = new StackView(this.stableGameContainer, stackX, stackY, stackId, stackLength, cardSize)
            this.stacks.push(stack)
        }

        this.slots = []
        for (let i = 0; i < 4; i++) {
            const slotWidth = cardSize.width
            const slotGap = 5
            const slotX = 15 + i * (slotWidth + slotGap)
            const slotY = 45
            const slotId = i
            const slotName = Settings.suits.get(i).name

            const slot = new SlotView(this.stableGameContainer, slotX, slotY, slotId, slotName, cardSize)
            this.slots.push(slot)
        }

        this.deck = new DeckView(this.stableGameContainer, cardSize)




        const randomCardsMap = this.createShuffleCardsMap()
        console.log(randomCardsMap)

        this.cards = []
        randomCardsMap.forEach((cardSetting) => {
            const card = new CardView(
                this.stableGameContainer,
                0, 0,
                cardSize.width, cardSize.height,
                cardSetting.name,
                cardSetting.suit,
                cardSetting.value
            )

            this.cards.push(card)
        })

        this.startGame()
    }

    startGame() {
        // let countCardsInStacks = 0
        // this.stacks.forEach((stack) => {
        //     for (let cardIndex = 0; cardIndex < stack.initLenght; cardIndex++) {

        //         const isOpen = cardIndex == stack.initLenght - 1 ? true : false
        //         const card = this.cards[countCardsInStacks]
        //         stack.addCard(card, isOpen)
        //         countCardsInStacks++
        //     }
        // })


        // const deckCards = this.cards.filter(card => !(card.isStackCard || card.isSlotCard))
        // deckCards.forEach((card) => {
        //     this.deck.addCard(card)
        // })

        this.cards.forEach((card) => {
            this.deck.addCard(card)
        })


        this.startAnimation().then(() => {
            this.interactive = true

            this.on('pointerdown', (event) => {
                this.onDragStart(event)
            })
            this.on('pointermove', (event) => {
                this.onDragMove(event)
            })
            this.on('pointerup', (event) => {
                this.onDragEnd(event)
            })
        })
    }

    onDragStart(event) {
        this.dragObj = event.target

        if (this.dragObj instanceof CardView) {
            const card = this.dragObj

            if (card.isStackCard && card.isOpen) {

                card.prevPosX = this.dragObj.x
                card.prevPosY = this.dragObj.y
                card.zIndex = 2

                this.lastPointerPosition = event.data.getLocalPosition(this.stableGameContainer)
                this.isDragging = true
            }

            if (card.isDeckCard) {
                if (card.isOpen) {
                    this.lastPointerPosition = event.data.getLocalPosition(this.stableGameContainer)
                    this.isDragging = true
                }
                else card.flipInDeck()
            }
        }
    }

    onDragMove(event) {
        if (this.isDragging) {
            const card = this.dragObj

            const newPointerPosition = event.data.getLocalPosition(this.stableGameContainer)

            card.x += (newPointerPosition.x - this.lastPointerPosition.x)
            card.y += (newPointerPosition.y - this.lastPointerPosition.y)

            this.lastPointerPosition = newPointerPosition

            this.checkCardForContact(card)
        }
    }

    onDragEnd() {
        if (this.dragObj instanceof CardView) {
            const card = this.dragObj

            if (card.isOpen) {
                const nextStacks = this.stacks.filter(stack => stack.isActive)
                const nextStack = nextStacks[0]

                if (nextStack) {
                    const prevStack = this.stacks[card.stackId]

                    nextStack.hideBorder()
                    prevStack.removeCard(card)
                    nextStack.addCard(card)
                }

                card.returnToInitialPos()
                card.zIndex = 1
            }
        }

        this.isDragging = false
    }

    checkCardForContact(card) {
        const maskCardGapX = 25
        const maskCardGapY = 40
        const maskCardLeftX = card.x + maskCardGapX
        const maskCardRightX = card.x + card.width - maskCardGapX
        const maskCardTopY = card.y + maskCardGapY
        const maskCardbottomY = card.y + card.height - maskCardGapY

        this.stacks.forEach((stack) => {
            if (
                card.stackId != stack.id &&
                maskCardLeftX >= stack.x &&
                maskCardRightX <= stack.x + stack.width &&
                maskCardTopY >= stack.y &&
                maskCardbottomY <= stack.y + stack.height
            ) {
                stack.showBorder()
            }
            else {
                stack.hideBorder()
            }
        })
    }

    async startAnimation() {
        let deckCardCount = 0
        const emptyArrayOfEmptyCards = []

        for (const stack of this.stacks) {

            emptyArrayOfEmptyCards.push(deckCardCount)

            for (const emptyCard of emptyArrayOfEmptyCards) {
                await new Promise(resolve => {
                    setTimeout(() => {

                        const card = this.cards[deckCardCount]
                        const deck = this.deck
                        const indexInStack = emptyArrayOfEmptyCards.indexOf(emptyCard)
                        const isOpen = indexInStack == stack.initLenght - 1 ? true : false

                        deck.removeCard(card)

                        const cardNextPos = stack.getCardPositionByIndex(indexInStack)

                        const moveAnim = () => isOpen ? card.flipAndMoveToStackPos(cardNextPos) : card.move(cardNextPos)
                        moveAnim()

                        stack.addCard(card, isOpen)
                        deckCardCount++

                        resolve()

                    }, 100)
                })
            }
        }
    }

    createAdaptiveContainer() {
        //Создание адаптивного контейнера, в зависимости от размеров вьюпорта он сжимается-разжимается от максимального размера до размера игрового контейнера
        const adaptiveContainer = new PIXI.Container()
        this.addChild(adaptiveContainer)

        return adaptiveContainer
    }

    createStableContainer() {
        //Бэкграунд на всю высоту адаптивного контейнера
        const background = PIXI.Sprite.from('background')
        background.x = 0
        background.y = 0
        background.width = Manager.gameArea.width
        background.height = Manager.gameArea.maxHeight
        this.adaptiveContainer.addChild(background)

        //Контейнер игры, в нем фиксированные высота и ширина. Здесь и только здесь хранятся элементы игры
        const stableGameContainer = new PIXI.Container()
        stableGameContainer.x = 0
        stableGameContainer.y = (Manager.gameArea.maxHeight - Manager.gameArea.minHeight) / 2
        stableGameContainer.sortableChildren = true
        this.adaptiveContainer.addChild(stableGameContainer)

        //Дергаем ресайз, чтобы все расставилось как надо по вьюпорту
        this.onResize(stableGameContainer)

        return stableGameContainer
    }

    createShuffleCardsMap() {
        const map = new Map()

        const valuesMap = Settings.values
        const suitsMap = Settings.suits

        let cardKey = 0
        for (let i = 0; i < 4; i++) {
            const suitKey = i

            for (let j = 0; j < 13; j++) {
                const valueKey = j

                map.set(cardKey, {
                    suit: {
                        name: suitsMap.get(suitKey).name,
                        id: suitKey
                    },
                    name: valuesMap.get(valueKey).name + '_' + suitsMap.get(suitKey).name,
                    value: valuesMap.get(valueKey).value
                })

                cardKey++
            }
        }

        let m = map.size, t, i

        // Пока есть элементы для перемешивания
        while (m) {

            // Взять оставшийся элемент
            i = Math.floor(Math.random() * m--);

            // И поменять его местами с текущим элементом
            t = map.get(m);
            map.set(m, map.get(i))
            map.set(i, t);
        }

        return map
    }

    update(framesPassed) {
        TWEEN.update()
    }

    onResize() {
        const {
            width: canvasWidth,
            height: canvasHeight
        } = Manager.canvasArea

        const {
            width: gameWidth,
            currHeight: gameHeight,
            minHeight: gameMinHeight,
            maxHeight: gameMaxHeight
        } = Manager.gameArea

        const RESIZE_STAGE = Manager.RESIZE_STAGE
        const currResizeStageId = Manager.currResizeStageId

        const scale = Math.max(canvasHeight / gameMaxHeight, canvasWidth / gameWidth)

        let offsetY
        switch (currResizeStageId) {
            case RESIZE_STAGE.MAX:
                offsetY = -1 * scale * (gameMaxHeight - gameMinHeight) / 2

                break

            case RESIZE_STAGE.CHANGING:
                offsetY = -1 * scale * (gameMaxHeight - gameHeight) / 2

                break

            case RESIZE_STAGE.MIN:
                offsetY = 0

                break
        }

        this.adaptiveContainer.y = offsetY
        this.adaptiveContainer.scale.set(scale, scale)
    }
}
