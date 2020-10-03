import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { stake } from '../dragonballzUtils'

const useStake = (poolContract: Contract, tokenName: string) => {
  const { account } = useWallet()

  const handleStake = useCallback(async (amount: string) => {
    const txHash = await stake(poolContract, amount, account, tokenName)
  }, [account, poolContract])

  return { onStake: handleStake }
}

export default useStake