import { Manager } from './Manager.js'
import { LoaderScene } from './scenes/LoaderScene.js'

Manager.initialize(412, 512, 720, 0xFFFF00) 
Manager.changeScene(new LoaderScene())


globalThis.__PIXI_APP__ = Manager.app // Отладка



