// ============ Contracts ============

// Token
// deployed first
const DRAGONBALLZImplementation = artifacts.require("DRAGONBALLZDelegate");
const DRAGONBALLZProxy = artifacts.require("DRAGONBALLZDelegator");

// Rs
// deployed second
const DRAGONBALLZReserves = artifacts.require("DRAGONBALLZReserves");
const DRAGONBALLZRebaser = artifacts.require("DRAGONBALLZRebaser");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployRs(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============


async function deployRs(deployer, network) {
  let reserveToken = "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8";
  let uniswap_factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  await deployer.deploy(DRAGONBALLZReserves, reserveToken, DRAGONBALLZProxy.address);
  await deployer.deploy(DRAGONBALLZRebaser,
      DRAGONBALLZProxy.address,
      reserveToken,
      uniswap_factory,
      DRAGONBALLZReserves.address
  );
  let rebase = new web3.eth.Contract(DRAGONBALLZRebaser.abi, DRAGONBALLZRebaser.address);

  let pair = await rebase.methods.uniswap_pair().call();
  console.log(pair)
  let dragonballz = await DRAGONBALLZProxy.deployed();
  await dragonballz._setRebaser(DRAGONBALLZRebaser.address);
  let reserves = await DRAGONBALLZReserves.deployed();
  await reserves._setRebaser(DRAGONBALLZRebaser.address)
}
