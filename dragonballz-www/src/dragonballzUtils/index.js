import { ethers } from 'ethers'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import { PROPOSALSTATUSCODE } from '../dragonballz/lib/constants'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 300000,
    SNX: 850000,
  }
};

export const getPoolStartTime = async (poolContract) => {
  return await poolContract.methods.starttime().call()
}

export const getCurrentBoost = async (poolContract, account) => {
  let boostStarttime = await poolContract.methods.boostStarttime(account).call() + 3600;
  let now = new Date().getTime() / 1000;
  let currentBoost = 0;
  if (now <= boostStarttime) {
    currentBoost = await poolContract.methods.currentBoost(account).call();
  }

  return currentBoost;
}

// newly added logic
export const boostx2 = async (poolContract, account) => {
  let currnetCnt = await poolContract.methods.x2Count(account).call();
  console.log(currnetCnt);
  let price = 0.015 * Math.pow(2, currnetCnt);
  console.log(price);
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .boostx2()
      .send({ from: account, gas: 400000, value: Web3.utils.toWei(price.toString(), "ether") })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const boostx4 = async (poolContract, account) => {
  let currnetCnt = await poolContract.methods.x4Count(account).call();
  let price = 0.015 * Math.pow(2, currnetCnt);
  console.log(price);
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .boostx4()
      .send({ from: account, gas: 400000, value: Web3.utils.toWei(price.toString(), "ether") })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const boostx8 = async (poolContract, account) => {
  let currnetCnt = await poolContract.methods.x8Count(account).call();
  let price = 0.015 * Math.pow(2, currnetCnt);
  console.log(price);
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .boostx8()
      .send({ from: account, gas: 400000, value: Web3.utils.toWei(price.toString(), "ether") })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const boostx10 = async (poolContract, account) => {
  let currnetCnt = await poolContract.methods.x10Count(account).call();
  let price = 0.015 * Math.pow(2, currnetCnt);
  console.log(price);
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .boostx10()
      .send({ from: account, gas: 400000, value: Web3.utils.toWei(price.toString(), "ether") })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const stake = async (poolContract, amount, account, tokenName) => {
  let now = new Date().getTime() / 1000;
  const gas = GAS_LIMIT.STAKING[tokenName.toUpperCase()] || GAS_LIMIT.STAKING.DEFAULT;
  
  if (now >= 1601683200) {
    return poolContract.methods
      .stake((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const unstake = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .withdraw((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas: 400000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const harvest = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .getReward()
      .send({ from: account, gas: 300000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const redeem = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1601683200) {
    return poolContract.methods
      .exit()
      .send({ from: account, gas: 400000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const approve = async (tokenContract, poolContract, account) => {
  return tokenContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 160000 })
}

export const rebase = async (dragonballz, account) => {
  return dragonballz.contracts.rebaser.methods.rebase().send({ from: account })
}

export const getPoolContracts = async (dragonballz) => {
  const pools = Object.keys(dragonballz.contracts)
    .filter(c => c.indexOf('_pool') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = dragonballz.contracts[cur]
      return newAcc
    }, {})
  return pools
}

export const getEarned = async (dragonballz, pool, account) => {
  console.log("dragonballz", dragonballz);
  console.log("pool", pool);

  let scalingFactor;
  if (Object.keys(pool.methods).includes("goku")) {
    console.log("goku");
    scalingFactor = new BigNumber(await dragonballz.contracts.goku.methods.gokusScalingFactor().call());
  } else {
    console.log("vegeta");
    scalingFactor = new BigNumber(await dragonballz.contracts.vegeta.methods.vegetasScalingFactor().call());
  }
  // const scalingFactor = new BigNumber(await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call())
  const earned = new BigNumber(await pool.methods.earned(account).call())
  return earned.multipliedBy(scalingFactor.dividedBy(new BigNumber(10).pow(18)))
}

export const getStaked = async (dragonballz, pool, account) => {
  return dragonballz.toBigN(await pool.methods.balanceOf(account).call())
}

export const getCurrentPrice = async (dragonballz) => {
  // FORBROCK: get current DRAGONBALLZ price
  return dragonballz.toBigN(await dragonballz.contracts.rebaser.methods.getCurrentTWAP().call())
}

export const getTargetPrice = async (dragonballz) => {
  return dragonballz.toBigN(1).toFixed(2);
}

export const getCirculatingSupply = async (dragonballz) => {
  let now = await dragonballz.web3.eth.getBlock('latest');
  let scalingFactor = dragonballz.toBigN(await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call());
  let starttime = dragonballz.toBigN(await dragonballz.contracts.usdc_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return 0;
  }
  let dragonballzsDistributed = dragonballz.toBigN(10 * timePassed * 5000 / 2592000); //dragonballzs from first 8 pools
  let starttimePool2 = dragonballz.toBigN(await dragonballz.contracts.ycrvUNIV_pool.methods.starttime().call()).toNumber();
  timePassed = now["timestamp"] - starttime;
  let pool2Dragonballzs = dragonballz.toBigN(timePassed * 25000 / 2592000); // dragonballzs from second pool. note: just accounts for first week
  let circulating = pool2Dragonballzs.plus(dragonballzsDistributed).times(scalingFactor).div(10 ** 36).toFixed(2)
  return circulating
}

export const getNextRebaseTimestamp = async (dragonballz) => {
  try {
    let now = await dragonballz.web3.eth.getBlock('latest').then(res => res.timestamp);
    let interval = 86400; // 24 hours
    let offset = 0; // 0AM utc
    let secondsToRebase = 0;
    if (await dragonballz.contracts.rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
        secondsToRebase = (interval - (now % interval)) + offset;
      } else {
        secondsToRebase = offset - (now % interval);
      }
    } else {
      let twap_init = dragonballz.toBigN(await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call()).toNumber();
      if (twap_init > 0) {
        let delay = dragonballz.toBigN(await dragonballz.contracts.rebaser.methods.rebaseDelay().call()).toNumber();
        let endTime = twap_init + delay;
        if (endTime % interval > offset) {
          secondsToRebase = (interval - (endTime % interval)) + offset;
        } else {
          secondsToRebase = offset - (endTime % interval);
        }
        return endTime + secondsToRebase;
      } else {
        return now + 13 * 60 * 60; // just know that its greater than 12 hours away
      }
    }
    return now + secondsToRebase
  } catch (e) {
    console.log(e)
  }
}

export const getTotalSupply = async (dragonballz) => {
  return await dragonballz.contracts.dragonballz.methods.totalSupply().call();
}

export const getStats = async (dragonballz) => {
  const curPrice = await getCurrentPrice(dragonballz)
  const circSupply = await getCirculatingSupply(dragonballz)
  const nextRebase = await getNextRebaseTimestamp(dragonballz)
  const targetPrice = await getTargetPrice(dragonballz)
  const totalSupply = await getTotalSupply(dragonballz)
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply
  }
}


// gov
export const getProposals = async (dragonballz) => {
  let proposals = []
  const filter = {
    fromBlock: 0,
    toBlock: 'latest',
  }
  // const events = await dragonballz.contracts.gov.getPastEvents("allEvents", filter)
  const events = []
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    let index = 0;
    if (event.removed === false) {
      switch (event.event) {
        case "ProposalCreated":
          proposals.push(
            {
              id: event.returnValues.id,
              proposer: event.returnValues.proposer,
              description: event.returnValues.description,
              startBlock: Number(event.returnValues.startBlock),
              endBlock: Number(event.returnValues.endBlock),
              targets: event.returnValues.targets,
              values: event.returnValues.values,
              signatures: event.returnValues.signatures,
              status: PROPOSALSTATUSCODE.CREATED,
              transactionHash: event.transactionHash
            }
          )
          break
        // TODO
        case "ProposalCanceled":
          index = proposals.findIndex((proposal) => proposal.id === event.returnValues.id)
          proposals[index].status = PROPOSALSTATUSCODE.CANCELED
          break
        case "ProposalQueued":
          index = proposals.findIndex((proposal) => proposal.id === event.returnValues.id)
          proposals[index].status = PROPOSALSTATUSCODE.QUEUED
          break
        case "VoteCast":
          break
        case "ProposalExecuted":
          break
        default:
          break
      }
    }
  }
  proposals.sort((a, b) => Number(b.endBlock) - Number(b.endBlock))
  return proposals
}

export const getProposal = async (dragonballz, id) => {
  const proposals = await getProposals(dragonballz)
  const proposal = proposals.find(p => p.id === id)
  return proposal
}

export const getProposalStatus = async (dragonballz, id) => {
  const proposalStatus = (await dragonballz.contracts.gov.methods.proposals(id).call())
  return proposalStatus
}

export const getQuorumVotes = async (dragonballz) => {
  return new BigNumber(await dragonballz.contracts.gov.methods.quorumVotes().call()).div(10 ** 6)
}

export const getProposalThreshold = async (dragonballz) => {
  return new BigNumber(await dragonballz.contracts.gov.methods.proposalThreshold().call()).div(10 ** 6)
}

export const getCurrentVotes = async (dragonballz, account) => {
  return dragonballz.toBigN(await dragonballz.contracts.dragonballz.methods.getCurrentVotes(account).call()).div(10 ** 6)
}

export const delegate = async (dragonballz, account, from) => {
  return dragonballz.contracts.dragonballz.methods.delegate(account).send({ from: from, gas: 640000 })
}

export const castVote = async (dragonballz, id, support, from) => {
  return dragonballz.contracts.gov.methods.castVote(id, support).send({ from: from, gas: 640000 })
}
