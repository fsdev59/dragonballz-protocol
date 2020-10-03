import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { getCurrentBoost } from '../dragonballzUtils'

const useBoostx2 = (poolContract: Contract) => {
    const { account } = useWallet()

    const handleBoostCurrent = useCallback(async () => {
        const boost = await getCurrentBoost(poolContract, account)
        return boost;
    }, [account, poolContract])

    return { onBoostCurrent: handleBoostCurrent }
}

export default useBoostx2