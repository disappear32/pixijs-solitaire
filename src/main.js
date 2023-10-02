import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

const gameSettings = {
    width: 412,
    minHeight: 512,
    maxHeight: 720,
    backColor: 0xFFFF00
}

const gameContainer = document.getElementById("game-container")

const updateCanvasSize = () => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const aspectRatioMax = (gameSettings.width / gameSettings.maxHeight).toFixed(4)
    const aspectRatioMin = (gameSettings.width / gameSettings.minHeight).toFixed(4)
    const currAspect = (viewportWidth / viewportHeight).toFixed(4)

    let canvasWidth, canvasHeight
    if (currAspect > aspectRatioMin) {
        canvasWidth = viewportHeight * aspectRatioMin
        canvasHeight = viewportHeight
    } else if (currAspect <= aspectRatioMin && currAspect > aspectRatioMax) {
        canvasWidth = viewportWidth
        canvasHeight = viewportHeight
    }
    else if (currAspect <= aspectRatioMax) {
        canvasWidth = viewportWidth
        canvasHeight = viewportWidth / aspectRatioMax
    }

    gameContainer.style.setProperty("width", `${canvasWidth}px`)
    gameContainer.style.setProperty("height", `${canvasHeight}px`)
}

window.addEventListener("resize", () => {
    updateCanvasSize()
})

updateCanvasSize()

Manager.initialize(gameSettings.width, gameSettings.minHeight, gameSettings.maxHeight, gameSettings.backColor)
Manager.changeScene(new LoaderScene())


globalThis.__PIXI_APP__ = Manager.app // Отладка



