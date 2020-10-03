import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { boostx8 } from '../dragonballzUtils'

const useBoostx8 = (poolContract: Contract) => {
    const { account } = useWallet()

    const handleBoostx8 = useCallback(async () => {
        const txHash = await boostx8(poolContract, account)
        return txHash
    }, [account, poolContract])

    return { onBoostx8: handleBoostx8 }
}

export default useBoostx8