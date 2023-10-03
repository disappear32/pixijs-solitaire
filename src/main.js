import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

Manager.initialize(360, 512, 760, 0xFFFF00) 
Manager.changeScene(new LoaderScene())


globalThis.__PIXI_APP__ = Manager.app // Отладка



