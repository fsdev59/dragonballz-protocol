import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { boostx10 } from '../dragonballzUtils'

const useBoostx10 = (poolContract: Contract) => {
    const { account } = useWallet()

    const handleBoostx10 = useCallback(async () => {
        const txHash = await boostx10(poolContract, account)
        return txHash
    }, [account, poolContract])

    return { onBoostx10: handleBoostx10 }
}

export default useBoostx10