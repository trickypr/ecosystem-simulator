import { Container, Graphics } from "pixi.js";
import { plants, Plant, water, Water } from "../world/world";
import { lineLength, getPosAfterDistanceOnLine, circleCollision } from '../math'
import { size } from "../constants";

const moveTick = 100

export class Animal extends Container {
  tick() {
    this.ai()
  }

  ai() {
    throw new Error('AI needs to be implemented')
  }
}

export class Bunny extends Graphics {
  aiActive = false
  
  sight = 300
  speed = 100
  size = 5

  hunger = 0.5
  thirst = 0.3

  x = Math.floor(Math.random() * size)
  y = Math.floor(Math.random() * size)

  constructor() {
    super()

    this.beginFill(0x000000)
    this.drawCircle(0, 0, this.size)
    this.endFill()
  }

  tick() {    
    if (!this.aiActive) this.generateActions()
    this.hunger += 0.02
    this.thirst += 0.02
  }

  async generateActions() {
    if (this.hunger === 0 && this.thirst === 0) return
    
    this.aiActive = true

    if (this.hunger > this.thirst) await this.getFood()
    else if (this.thirst > 0.1) await this.getWater()

    this.aiActive = false
  }

  async getFood() {
    const availablePlants: Plant[] = []

    plants.forEach(plant => {
      if (!plant.used && plant.checkCollision(this.x, this.y, this.sight)) availablePlants.push(plant)
    })

    availablePlants.sort((a, b) => lineLength(this.x, this.y, a.x, a.y) -  lineLength(this.x, this.y, b.x, b.y))

    if (availablePlants[0]) {      
      await this.moveToCircle(availablePlants[0].x, availablePlants[0].y, availablePlants[0].size)
      if (!availablePlants[0].used) {
        availablePlants[0].use()
        this.hunger = 0
      }
    }
  }

  async getWater() {
    const availableWater: Water[] = []

    water.forEach(plant => {
      if (plant.checkCollision(this.x, this.y, this.sight)) availableWater.push(plant)
    })

    availableWater.sort((a, b) => lineLength(this.x, this.y, a.x, a.y) -  lineLength(this.x, this.y, b.x, b.y))

    if (availableWater[0]) {
      await this.moveToCircle(availableWater[0].x, availableWater[0].y, availableWater[0].size)
      this.thirst = 0
    }
  }

  moveToCircle(x: number, y: number, r: number) {
    return new Promise(resolve => {
      const distancePerTick = this.speed * (moveTick / 1000)

      let lastx, lasty

      const moveInterval = setInterval(() => {
        const nextPos = getPosAfterDistanceOnLine(this.x, this.y, x, y, distancePerTick)        

        this.x = nextPos.x
        this.y = nextPos.y

        if (circleCollision(this.x, this.y, this.size, x, y, r) || this.x === lastx && this.y === lasty) {
          clearInterval(moveInterval)
          resolve()
        }

        this.hunger += 0.001
        this.thirst += 0.001

        lastx = this.x
        lasty = this.y
      }, moveTick)
    })
  }
}

export class Animals extends Container {
  animals: Bunny[] = []

  constructor() {
    super()

    for (let i = 0; i < 10; i++) this.animals.push(new Bunny())

    this.animals.forEach(animal => {
      this.addChild(animal)
    })
  }

  tick() {
    this.animals.forEach(animal => animal.tick())
  }
}