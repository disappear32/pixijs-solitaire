export default class SceneView extends PIXI.Container {
    
    stableWidth
    stableHeight

    constructor(minWidth, maxWidth, minHeight, maxHeight) {
        super()

        this.stableWidth = minWidth
        this.stableHeight = minHeight
        
        //Контейнер игры, в нем фиксированные высота и ширина
        //Здесь и только здесь хранятся элементы игры
        this.stableGameContainer = new PIXI.Container()
        this.stableGameContainer.x = (maxWidth - minWidth) / 2
        this.stableGameContainer.y = (maxHeight - minHeight) / 2
        this.addChild(this.stableGameContainer)
    }

    onResize() {
    }

    update() {}
}