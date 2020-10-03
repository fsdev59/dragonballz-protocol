import { Dragonballz } from '../../dragonballz'

import {
  getCurrentPrice as gCP,
  getTargetPrice as gTP,
  getCirculatingSupply as gCS,
  getNextRebaseTimestamp as gNRT,
  getTotalSupply as gTS,
} from '../../dragonballzUtils'

const getCurrentPrice = async (dragonballz: typeof Dragonballz): Promise<number> => {
  // FORBROCK: get current DRAGONBALLZ price
  return gCP(dragonballz)
}

const getTargetPrice = async (dragonballz: typeof Dragonballz): Promise<number> => {
  // FORBROCK: get target DRAGONBALLZ price
  return gTP(dragonballz)
}

const getCirculatingSupply = async (dragonballz: typeof Dragonballz): Promise<string> => {
  // FORBROCK: get circulating supply
  return gCS(dragonballz)
}

const getNextRebaseTimestamp = async (dragonballz: typeof Dragonballz): Promise<number> => {
  // FORBROCK: get next rebase timestamp
  const nextRebase = await gNRT(dragonballz) as number
  return nextRebase * 1000
}

const getTotalSupply = async (dragonballz: typeof Dragonballz): Promise<string> => {
  // FORBROCK: get total supply
  return gTS(dragonballz)
}

export const getStats = async (dragonballz: typeof Dragonballz) => {
  const curPrice = await getCurrentPrice(dragonballz)
  const circSupply = await getCirculatingSupply(dragonballz)
  const nextRebase = await getNextRebaseTimestamp(dragonballz)
  const targetPrice = await getTargetPrice(dragonballz)
  const totalSupply = await getTotalSupply(dragonballz)
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply
  }
}
