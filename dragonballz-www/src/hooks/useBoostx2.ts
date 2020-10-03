import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { boostx2 } from '../dragonballzUtils'

const useBoostx2 = (poolContract: Contract) => {
    const { account } = useWallet()

    const handleBoostx2 = useCallback(async () => {
        const txHash = await boostx2(poolContract, account)
        return txHash
    }, [account, poolContract])

    return { onBoostx2: handleBoostx2 }
}

export default useBoostx2