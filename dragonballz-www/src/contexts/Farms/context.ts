import { createContext } from 'react'
import { FarmsContext } from './types'

const context = createContext<FarmsContext>({
  farms: [],
  boost: '',
})

export default context