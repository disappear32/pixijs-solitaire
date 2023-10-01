import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

const gameSettings = {
    width: 412,
    minHeight: 512,
    maxHeight: 712,
    backColor: 0xFFFFFF
}

Manager.initialize(gameSettings.width, gameSettings.minHeight, gameSettings.maxHeight, gameSettings.backColor)
Manager.changeScene(new LoaderScene())


function updateCanvasSize() {
    const gameContainer = document.getElementById("game-container")
    const aspectRatioMax = (gameSettings.width / gameSettings.maxHeight).toFixed(4)
    const aspectRatioMin = (gameSettings.width / gameSettings.minHeight).toFixed(4)

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let canvasWidth, canvasHeight

    const currAspect = (viewportWidth / viewportHeight).toFixed(4)
    console.log('viewportWidth ' + viewportWidth)
    console.log('viewportHeight ' + viewportHeight)
    console.log('aspectRatioMin ' + aspectRatioMin)
    console.log('aspectRatioMax ' + aspectRatioMax)
    console.log('currAspect ' + currAspect)

    if (currAspect > aspectRatioMax) {
        canvasWidth = viewportHeight * aspectRatioMin
        canvasHeight = viewportHeight
        console.log('Сбоку')
    } else if (currAspect > aspectRatioMin && currAspect < aspectRatioMax) {
        canvasWidth = viewportWidth
        canvasHeight = viewportHeight / aspectRatioMin
        console.log('Макс')
    }
    else if (currAspect <= aspectRatioMax) {
        canvasWidth = viewportWidth
        canvasHeight = viewportWidth / aspectRatioMax
        console.log('Мин')
    }

    gameContainer.style.setProperty("width", `${canvasWidth}px`)
    gameContainer.style.setProperty("height", `${canvasHeight}px`)
}

window.addEventListener("resize", () => {
    updateCanvasSize()
    Manager.resize()
})

updateCanvasSize()
Manager.app.resize()

globalThis.__PIXI_APP__ = Manager.app // Отладка



