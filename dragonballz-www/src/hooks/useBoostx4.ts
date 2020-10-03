import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { boostx4 } from '../dragonballzUtils'

const useBoostx4 = (poolContract: Contract) => {
    const { account } = useWallet()

    const handleBoostx4 = useCallback(async () => {
        const txHash = await boostx4(poolContract, account)
        console.log(">>>>>>>>>>>>>>>>", txHash);
        return txHash
    }, [account, poolContract])

    return { onBoostx4: handleBoostx4 }
}

export default useBoostx4