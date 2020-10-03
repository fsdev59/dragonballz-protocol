import { useContext } from 'react'
import { Context } from '../contexts/DragonballzProvider'

const useDragonballz = () => {
  return useContext(Context);
}

export default useDragonballz