import { Manager } from "../Manager.js"
import { StackView } from "../game-objects/StackView.js"
import { DeckView } from "../game-objects/DeckView.js"
import { OpenDeckView } from "../game-objects/OpenDeckView.js"
import { SlotView } from "../game-objects/SlotView.js"
import { CardView } from "../game-objects/CardView.js"

import { SubmitButtonView } from "../game-objects/UI/SubmitCollectButtonsView.js"
import { CollectButtonView } from "../game-objects/UI/SubmitCollectButtonsView.js"
import Settings from "../utils/Settings.js"

export class GameScene extends PIXI.Container {
    adaptiveContainer
    stableGameContainer

    stacks
    slots
    deck
    openDeck
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
            const stackX = 4.5 + i * (stackWidth + stackGap)
            const stackY = 225
            const stackId = i

            const stack = new StackView(this.stableGameContainer, stackX, stackY, stackId, stackLength, cardSize)
            this.stacks.push(stack)
        }

        this.slots = []
        for (let i = 0; i < 4; i++) {
            const slotWidth = cardSize.width
            const slotGap = 5
            const slotX = 4.5 + i * (slotWidth + slotGap)
            const slotY = 115
            const slotId = i
            const slotName = Settings.suits.get(i).name

            const slot = new SlotView(this.stableGameContainer, slotX, slotY, slotId, slotName, cardSize)
            this.slots.push(slot)
        }

        this.deck = new DeckView(322, 115, cardSize, this.stableGameContainer)
        this.openDeck = new OpenDeckView(269, 115, cardSize)

        this.cards = []
        this.createShuffleCardsMap().forEach(cardSetting => {
            const card = new CardView(
                this.stableGameContainer,
                0, 0,
                cardSize,
                cardSetting.name,
                cardSetting.suit.name,
                cardSetting.suit.id,
                cardSetting.value
            )

            this.cards.push(card)
        })

        this.submitButton = new SubmitButtonView(this.stableGameContainer, 97, 605)
        this.collectButton = new CollectButtonView(this.stableGameContainer, 97, 605)

        this.startGame()
    }

    startGame() {
        this.cards.forEach((card) => {
            card.x = this.deck.x
            card.y = this.deck.y
            this.deck.addCard(card)
        })

        this.startAnimation().then(() => {
            this.initInteractive()
            this.submitButton.show()
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

                        const card = this.cards[this.cards.length - deckCardCount - 1]
                        const deck = this.deck
                        const indexInStack = emptyArrayOfEmptyCards.indexOf(emptyCard)
                        const isOpen = indexInStack == stack.initLenght - 1 ? true : false

                        deck.removeCard()
                        stack.addCard(card, isOpen)
                        card.zIndex = card.initZindex

                        if (isOpen) card.flipAndMoveToInitialPos(200)
                        else card.moveToInitialPos(100)

                        deckCardCount++

                        resolve()

                    }, 100)
                })
            }
        }
    }

    initInteractive() {
        this.interactive = true

        this.isCardDragging = false // Переписать, надо детектить автоматический мув по изменению позиции

        this.isDragging = false
        this.dragObj = undefined

        this.on('pointerdown', (event) => {

            this.dragObj = event.target

            if (this.dragObj instanceof CardView) {
                const card = this.dragObj

                this.onDragStart(event, card)
            }
        })

        this.on('pointermove', (event) => {

            if (this.isCardDragging) {
                this.isDragging = true

                const card = this.dragObj

                this.onDragMove(event, card)
            }
        })

        this.on('pointerup', () => {

            if (this.dragObj instanceof CardView) {
                const card = this.dragObj

                if (!this.isDragging && card.isOpen) this.autoDetectActiveSlot(card)

                if (card.isOpen) this.onDragEnd(card)

                if (card.isDeckCard && !card.isOpen) {

                    this.deck.removeCard()
                    this.openDeck.addCard(card)
                    card.zIndex = card.initZindex

                    card.flipAndMoveToInitialPos(400, TWEEN.Easing.Back.Out)
                }

                const isAllCardsOpen = this.stacks.every(stack => stack.cards.every(card => card.isOpen))
                if (isAllCardsOpen && this.deck.length == 0 && this.openDeck.length == 0) {
                    this.submitButton.hide().then(() => {
                        this.collectButton.show()
                    })
                }
            }

            if (this.dragObj instanceof DeckView) {

                for (let i = this.openDeck.length - 1; i >= 0; i--) {
                    const card = this.openDeck.cards[i]

                    this.openDeck.removeCard()
                    this.deck.addCard(card)

                    card.flipAndMoveToInitialPos(200)
                }
            }

            if (this.dragObj instanceof SubmitButtonView) {
                this.submitButton.pressAnimation()
                this.moveAllCardsToDeck()
            }
            if (this.dragObj instanceof CollectButtonView) {
                this.collectButton.pressAnimation()
                this.autoCollect()
                this.collectButton.hide()
            }

            this.isCardDragging = false
            this.isDragging = false
            this.dragObj = undefined
        })
    }

    onDragStart(event, card) {
        if ((card.isStackCard || card.isDeckCard || card.isOpenDeckCard) && card.isOpen) {

            this.lastPointerPosition = event.data.getLocalPosition(this.stableGameContainer)

            this.isCardDragging = true
        }
    }

    onDragMove(event, card) {

        card.zIndex = 25

        const updateCardPos = (card, deltaX, deltaY) => {
            card.x += deltaX
            card.y += deltaY
        }

        const newPointerPosition = event.data.getLocalPosition(this.stableGameContainer)

        if (card.isStackCard) {

            const deltaX = newPointerPosition.x - this.lastPointerPosition.x
            const deltaY = newPointerPosition.y - this.lastPointerPosition.y

            const groupStackCards = card.holder.cards.filter((cardInStack, index) => cardInStack.isOpen && index >= card.indexInHolder)
            groupStackCards.forEach(groupCard => {
                updateCardPos(groupCard, deltaX, deltaY)

                groupCard.zIndex = groupCard.indexInHolder + 25
            })
        }

        if (!card.isStackCard && (card.isDeckCard || card.isOpenDeckCard)) {

            const deltaX = newPointerPosition.x - this.lastPointerPosition.x
            const deltaY = newPointerPosition.y - this.lastPointerPosition.y
            updateCardPos(card, deltaX, deltaY)
        }

        this.lastPointerPosition = newPointerPosition

        this.detectContactingHolder(card)
    }

    onDragEnd(card) {

        let groupStackCards = card.isStackCard ?
            card.holder.cards.filter((cardInStack, index) => cardInStack.isOpen && index >= card.indexInHolder) :
            undefined

        const isStackCard = card.isStackCard
        const isOpenDeckCard = card.isOpenDeckCard

        const updateCardHolder = (card, nextHolder) => {
            const prevHolder = card.holder

            prevHolder.removeCard()
            nextHolder.addCard(card)
        }

        const activeStack = this.stacks.filter(stack => stack.isActive)[0]
        if (activeStack) {

            if (activeStack.length == 0 && card.isStackCard && card.value == 13) groupStackCards.forEach(groupCard => updateCardHolder(groupCard, activeStack))
            if (activeStack.length == 0 && card.isOpenDeckCard && card.value == 13) updateCardHolder(card, activeStack)

            if (activeStack.length > 0) {

                const lastCardOfactiveStack = activeStack.cards[activeStack.length - 1]
                const isNextCardSuitable = card.value + 1 == lastCardOfactiveStack.value && card.suitId % 2 != lastCardOfactiveStack.suitId % 2

                if (isNextCardSuitable && card.isStackCard) groupStackCards.forEach(groupCard => updateCardHolder(groupCard, activeStack))
                if (isNextCardSuitable && card.isOpenDeckCard) updateCardHolder(card, activeStack)
            }

            activeStack.hideBorder()
        }

        const activeSlot = this.slots.filter(slot => slot.isActive)[0]
        if (!activeStack && activeSlot) {

            if (activeSlot.length == 0 && card.suitId == activeSlot.id && card.value == 1) updateCardHolder(card, activeSlot)

            if (activeSlot.length > 0 && card.suitId == activeSlot.id) {

                const lastCardOfActiveSlot = activeSlot.cards[activeSlot.length - 1]
                const isNextCardSuitable = card.value == lastCardOfActiveSlot.value + 1

                if (isNextCardSuitable) updateCardHolder(card, activeSlot)
            }

            activeSlot.hideBorder()
        }

        if (!activeSlot && isStackCard) groupStackCards.forEach((groupCard, index) => groupCard.moveToInitialPos(100 + 50 * index))
        if (!activeSlot && isOpenDeckCard) card.moveToInitialPos()
        if (activeSlot) card.moveToInitialPos()
    }

    detectContactingHolder(card) {

        this.stacks.forEach(stack => stack.hideBorder())
        this.slots.forEach(slot => slot.hideBorder())

        const cardLeftX = card.x
        const cardRightX = card.x + card.width
        const cardTopY = card.y
        const cardBottomY = card.y + card.height

        const getContactingHolders = (card, holders) => {
            let array = []

            holders.forEach(holder => {
                const holderLeftX = holder.x
                const holderRightX = holder.x + holder.width
                const holderTopY = holder.y
                const holderBottomY = holder.y + holder.height

                if (
                    card.holderId != holder.id &&
                    (
                        (cardLeftX < holderRightX && cardLeftX > holderLeftX) ||
                        (cardRightX > holderLeftX && cardRightX < holderRightX)
                    )
                    &&
                    (
                        (cardTopY < holderBottomY && cardTopY > holderTopY) ||
                        (cardBottomY > holderTopY && cardBottomY < holderBottomY)
                    )
                ) {
                    const isLeftSideBound = cardLeftX > holderLeftX && cardLeftX < holderRightX
                    const isTopSideBound = cardTopY > holderTopY && cardTopY < holderBottomY

                    const contactLengthX = isLeftSideBound ? holderRightX - cardLeftX : cardRightX - holderLeftX
                    const contactLengthY = isTopSideBound ? holderBottomY - cardTopY : cardBottomY - holderTopY

                    array.push({
                        holder: holder,
                        contactArea: contactLengthX * contactLengthY
                    })
                }
            })

            return array
        }

        const contactingStacks = getContactingHolders(card, this.stacks)
        const contactingSlots = getContactingHolders(card, this.slots)
        const allContactingHolders = [...contactingStacks, ...contactingSlots]

        if (allContactingHolders.length > 0) {
            let contactHolder = allContactingHolders[0]
            allContactingHolders.forEach(holder => { if (contactHolder.contactArea < holder.contactArea) contactHolder = holder })
            contactHolder.holder.showBorder()
        }
    }

    autoDetectActiveSlot(card) {
        const lastIndexInStack = card.holder.length - 1

        if (card.indexInHolder == lastIndexInStack || card.isDeckCard || card.isOpenDeckCard) {

            this.slots.forEach(slot => {

                if (slot.length == 0 && card.suitId == slot.id && card.value == 1) slot.isActive = true

                if (slot.length > 0) {
                    const lastCardOfActiveSlot = slot.cards[slot.length - 1]
                    const isNextCardSuitable = card.value == lastCardOfActiveSlot.value + 1

                    if (!card.isSlotCard && card.suitId == slot.id && isNextCardSuitable) slot.isActive = true
                }
            })
        }

    }

    async autoCollect() {
        const autoMoveCard = async () => {
            const minSlot = () => {

                let min = {
                    slot: this.slots[0],
                    length: this.slots[0].length
                }
                for (let i = 0; i < 3; i++) if (min.length > this.slots[i + 1].length) min = {
                    slot: this.slots[i + 1],
                    length: this.slots[i + 1].length
                }

                return min.slot
            }

            const currSlot = minSlot()
            const relevantSuitId = currSlot.id
            const relevantValue = currSlot.length > 0 ? currSlot.cards[currSlot.length - 1].value + 1 : 1

            const currCard = this.cards.filter(card => card.value == relevantValue && card.suitId == relevantSuitId)[0]
            const cardStack = currCard.holder

            cardStack.removeCard()
            currSlot.addCard(currCard)

            await currCard.moveToInitialPos()
        }

        let countOfStackCard = 0
        this.stacks.forEach(stack => countOfStackCard += stack.length)

        const helpArray = new Array(countOfStackCard)
        for (const card of helpArray) await autoMoveCard()
    }

    async moveAllCardsToDeck() {

        for (const stack of this.stacks) {
            for (const card of stack.cards) {

                stack.removeCard(false)
                this.deck.addCard(card)

                if (card.isOpen) await card.flipAndMoveToInitialPos()
                else await card.moveToInitialPos()
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
