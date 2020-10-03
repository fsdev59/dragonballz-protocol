// ============ Contracts ============

// Token
// deployed first
const DRAGONBALLZImplementation = artifacts.require("DRAGONBALLZDelegate");
const DRAGONBALLZProxy = artifacts.require("DRAGONBALLZDelegator");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployToken(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============


async function deployToken(deployer, network) {
  await deployer.deploy(DRAGONBALLZImplementation);
  if (network != "mainnet") {
    await deployer.deploy(DRAGONBALLZProxy,
      "DRAGONBALLZ",
      "DRAGONBALLZ",
      18,
      "200000000000000000000000", // print extra few mil for user
      DRAGONBALLZImplementation.address,
      "0x"
    );
  } else {
    await deployer.deploy(DRAGONBALLZProxy,
      "DRAGONBALLZ",
      "DRAGONBALLZ",
      18,
      "50000000000000000000000",
      DRAGONBALLZImplementation.address,
      "0x"
    );
  }
}
