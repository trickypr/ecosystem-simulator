import { size } from '../constants'
import { IWorld, IWater, IPlant } from "./worldData"
import { Container, Graphics, Loader, Sprite } from 'pixi.js'

const waterQuantity = 10,
  maxWaterSize = 100,
  minWaterSize = 10

const plantQuantity = 20,
  maxPlantRegen = 0.1,
  minPlantRegen = 0.01,
  
const maxPlantSize = 7,
  minPlantSize = 3

export class Water extends Graphics implements IWater {
  size: number

  random(minSize: number, maxSize: number): Water {
    this.x = Math.round(Math.random() * size)
    this.y = Math.round(Math.random() * size)

    this.size = Math.round(Math.random() * (maxSize - minSize) + minSize)

    return this
  }

  draw() {
    this.beginFill(0x0392cf, 0.5)
    this.drawCircle(0, 0, this.size + 10)
    this.endFill()

    this.beginFill(0x0392cf)
    this.drawCircle(0, 0, this.size)
    this.endFill()
  }

  checkCollision(x: number, y: number, radius: number): boolean {
    const dx = this.x - x
    const dy = this.y - y
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + 10 + radius) return true

    return false
  }
}

export class Plant extends Sprite implements IPlant {
  interactive = true
  
  color: number = 0x7bc043

  used = false

  reGenChance: number
  size: number = Math.round(Math.random() * (maxPlantSize - minPlantSize) + minPlantSize)
  x: number
  y: number

  constructor() {
    super(Loader.shared.resources['plant'].texture)

    this.anchor.set(0.5, 0.5)
    
    this.on('pointerdown', this.use)
  }

  random(minRegen: number, maxRegen: number, objects: any[]): Plant {
    let valid = false

    while (!valid) {
      this.x = Math.round(Math.random() * size)
      this.y = Math.round(Math.random() * size)

      this.reGenChance = Math.random() * (maxRegen - minRegen) + minRegen

      valid = true
      objects.forEach(water => {
        if (water.checkCollision(this.x, this.y, this.size)) valid = false
      })
    }

    return this
  }

  use() {
    this.used = true
    this.visible = false
  }

  tick() {
    if  (this.used && Math.random() - this.reGenChance <= 0) {
      this.used = false
      this.visible = true
    }
  }
  checkCollision(x: number, y: number, radius: number): boolean {
    const dx = this.x - x
    const dy = this.y - y
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + 2 + radius) return true

    return false
  }
}

export const water: Water[] = []
export const plants: Plant[] = []

export class World extends Container {
  // trees: ITree[]

  x = 0
  y = 0

  constructor() {
    super()

    for (let i = 0; i < waterQuantity; i++) water.push(new Water().random(minWaterSize, maxWaterSize))
    for (let i = 0; i < plantQuantity; i++) plants.push(new Plant().random(minPlantRegen, maxPlantRegen, [...water, ...plants]))

    water.forEach(waterObject => {
      waterObject.draw()
      this.addChild(waterObject)
    })

    plants.forEach(plant => this.addChild(plant))
  }

  tick() {
    plants.forEach(plant => plant.tick())
  }
}