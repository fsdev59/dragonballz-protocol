import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Dragonballz } from '../../dragonballz'

export interface DragonballzContext {
  dragonballz?: typeof Dragonballz
  tokenType?: string
  setTokenType?: React.Dispatch<any>
}

export const Context = createContext<DragonballzContext>({
  dragonballz: undefined,
  tokenType: 'goku'
})

declare global {
  interface Window {
    dragonballzsauce: any
  }
}

const DragonballzProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet()
  const [dragonballz, setDragonballz] = useState<any>()
  const [tokenType, setTokenType] = useState<any>('goku');

  useEffect(() => {
    if (ethereum) {
      const gokuLib = new Dragonballz(
        ethereum,
        "1",
        false,
        {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "12000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        },
        "goku"
      );
      const vegetaLib = new Dragonballz(
        ethereum,
        "1",
        false,
        {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "12000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        },
        "vegeta"
      );
      
      setDragonballz({
        goku: gokuLib,
        vegeta: vegetaLib
      })
      window.dragonballzsauce = gokuLib
    }
  }, [ethereum])

  useEffect(() => {
    window.dragonballzsauce = dragonballz ? dragonballz[tokenType] : null;
  }, [tokenType]);

  const provider = {
    dragonballz: dragonballz ? dragonballz[tokenType] : null,
    tokenType,
    setTokenType
  };

  return (
    <Context.Provider value={provider}>
      {children}
    </Context.Provider>
  )
}

export default DragonballzProvider
