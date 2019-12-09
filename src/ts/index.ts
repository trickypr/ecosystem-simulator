import { Application } from 'pixi.js'
import { size } from './constants'
import { World } from './world/world'

let app = new Application({
  resolution: 4,
  width: size,
  height: size
})

app.renderer.backgroundColor = 0x4b7728

const c = app.view

c.style.width = `${size}px`
c.style.height = `${size}px`

document.body.appendChild(c)

const world = new World()
app.stage.addChild(world)

// Ticker
setInterval(() => world.tick(), 1000)
