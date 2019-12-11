import { Application, Loader } from 'pixi.js'
import { size } from './constants'
import { World } from './world/world'
import { Animals } from './animals/animals'
import PlantImage from '../img/plants.png'

Loader.shared.add('plant', PlantImage).load(init)

function init() {
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

  const animals = new Animals()
  app.stage.addChild(animals)

  // Ticker
  setInterval(() => {
    world.tick()
    animals.tick()
  }, 100)
}