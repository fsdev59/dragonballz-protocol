import { useCallback } from 'react'

import { useWallet } from 'use-wallet'

import { delegate } from '../dragonballzUtils'
import useDragonballz from './useDragonballz'

const useDelegate = (address?: string) => {
  const { account } = useWallet()
  const { dragonballz } = useDragonballz()

  const handleDelegate = useCallback(async () => {
    const txHash = await delegate(dragonballz, address || account, account)
  }, [account, address])

  return { onDelegate: handleDelegate }
}

export default useDelegate