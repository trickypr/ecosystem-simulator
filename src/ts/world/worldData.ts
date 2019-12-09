export interface IWater {
  x: number
  y: number
  size: number
}

export interface IPlant {
  x: number
  y: number
  reGenChance: number // 0 - 1 
  size?: number
}

export interface ITree {
  x: number
  y: number
  size: number
}

export interface IWorld {
  water: IWater[]
  plants: IPlant[]
  // trees: ITree[]
}
