import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Dragonballz } from '../dragonballz'
import { rebase } from '../dragonballzUtils'

import useDragonballz from '../hooks/useDragonballz'

const useRebase = () => {
  const { account } = useWallet()
  const { dragonballz } = useDragonballz()

  const handleRebase = useCallback(async () => {
    const txHash = await rebase(dragonballz, account)
  }, [account, dragonballz])

  return { onRebase: handleRebase }
}

export default useRebase