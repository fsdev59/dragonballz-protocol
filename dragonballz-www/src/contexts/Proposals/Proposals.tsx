import React, { useCallback, useEffect, useState } from 'react'

import useDragonballz from '../../hooks/useDragonballz'
import { getProposals } from '../../dragonballzUtils'

import Context from './context'
import { Proposal } from './types'


const Proposals: React.FC = ({ children }) => {

  const [proposals, setProposals] = useState<Proposal[]>([])
  const { dragonballz } = useDragonballz()

  const fetchProposals = useCallback(async () => {
    const propsArr: Proposal[] = await getProposals(dragonballz)

    setProposals(propsArr)
  }, [dragonballz, setProposals])

  useEffect(() => {
    if (dragonballz) {
      fetchProposals()
    }
  }, [dragonballz, fetchProposals])

  return (
    <Context.Provider value={{ proposals }}>
      {children}
    </Context.Provider>
  )
}

export default Proposals
