import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { harvest } from '../dragonballzUtils'

const useReward = (poolContract: Contract) => {
  const { account } = useWallet()

  const handleReward = useCallback(async () => {
    const txHash = await harvest(poolContract, account)
    return txHash
  }, [account, poolContract])

  return { onReward: handleReward }
}

export default useReward
