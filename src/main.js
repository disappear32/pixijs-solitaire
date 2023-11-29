import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

Manager.initialize(375, 665, 812, 0x000000) 
Manager.changeScene(new LoaderScene())


globalThis.__PIXI_APP__ = Manager.app // Отладка

