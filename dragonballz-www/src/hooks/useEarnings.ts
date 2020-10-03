import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { getEarned } from '../dragonballzUtils'
import useDragonballz from './useDragonballz'

const useEarnings = (pool: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const { dragonballz } = useDragonballz()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(dragonballz, pool, account)
    setBalance(new BigNumber(balance))
  }, [account, pool, dragonballz])

  useEffect(() => {
    if (account && pool && dragonballz) {
      fetchBalance()
    }
  }, [account, pool, setBalance, dragonballz])

  return balance
}

export default useEarnings