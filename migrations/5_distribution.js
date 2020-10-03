// ============ Contracts ============


// Protocol
// deployed second
const DRAGONBALLZImplementation = artifacts.require("DRAGONBALLZDelegate");
const DRAGONBALLZProxy = artifacts.require("DRAGONBALLZDelegator");

// deployed third
const DRAGONBALLZReserves = artifacts.require("DRAGONBALLZReserves");
const DRAGONBALLZRebaser = artifacts.require("DRAGONBALLZRebaser");

const Gov = artifacts.require("GovernorAlpha");
const Timelock = artifacts.require("Timelock");

// deployed fourth
const DRAGONBALLZ_ETHPool = artifacts.require("DRAGONBALLZETHPool");
const DRAGONBALLZ_uAMPLPool = artifacts.require("DRAGONBALLZAMPLPool");
const DRAGONBALLZ_YFIPool = artifacts.require("DRAGONBALLZYFIPool");
const DRAGONBALLZ_LINKPool = artifacts.require("DRAGONBALLZLINKPool");
const DRAGONBALLZ_MKRPool = artifacts.require("DRAGONBALLZMKRPool");
const DRAGONBALLZ_LENDPool = artifacts.require("DRAGONBALLZLENDPool");
const DRAGONBALLZ_COMPPool = artifacts.require("DRAGONBALLZCOMPPool");
const DRAGONBALLZ_SNXPool = artifacts.require("DRAGONBALLZSNXPool");


// deployed fifth
const DRAGONBALLZIncentivizer = artifacts.require("DRAGONBALLZIncentivizer");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    // deployTestContracts(deployer, network),
    deployDistribution(deployer, network, accounts),
    // deploySecondLayer(deployer, network)
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  console.log(network)
  let dragonballz = await DRAGONBALLZProxy.deployed();
  let yReserves = await DRAGONBALLZReserves.deployed()
  let yRebaser = await DRAGONBALLZRebaser.deployed()
  let tl = await Timelock.deployed();
  let gov = await Gov.deployed();
  if (network != "test") {
    await deployer.deploy(DRAGONBALLZ_ETHPool);
    await deployer.deploy(DRAGONBALLZ_uAMPLPool);
    await deployer.deploy(DRAGONBALLZ_YFIPool);
    await deployer.deploy(DRAGONBALLZIncentivizer);
    await deployer.deploy(DRAGONBALLZ_LINKPool);
    await deployer.deploy(DRAGONBALLZ_MKRPool);
    await deployer.deploy(DRAGONBALLZ_LENDPool);
    await deployer.deploy(DRAGONBALLZ_COMPPool);
    await deployer.deploy(DRAGONBALLZ_SNXPool);

    let eth_pool = new web3.eth.Contract(DRAGONBALLZ_ETHPool.abi, DRAGONBALLZ_ETHPool.address);
    let ampl_pool = new web3.eth.Contract(DRAGONBALLZ_uAMPLPool.abi, DRAGONBALLZ_uAMPLPool.address);
    let yfi_pool = new web3.eth.Contract(DRAGONBALLZ_YFIPool.abi, DRAGONBALLZ_YFIPool.address);
    let lend_pool = new web3.eth.Contract(DRAGONBALLZ_LENDPool.abi, DRAGONBALLZ_LENDPool.address);
    let mkr_pool = new web3.eth.Contract(DRAGONBALLZ_MKRPool.abi, DRAGONBALLZ_MKRPool.address);
    let snx_pool = new web3.eth.Contract(DRAGONBALLZ_SNXPool.abi, DRAGONBALLZ_SNXPool.address);
    let comp_pool = new web3.eth.Contract(DRAGONBALLZ_COMPPool.abi, DRAGONBALLZ_COMPPool.address);
    let link_pool = new web3.eth.Contract(DRAGONBALLZ_LINKPool.abi, DRAGONBALLZ_LINKPool.address);
    let ycrv_pool = new web3.eth.Contract(DRAGONBALLZIncentivizer.abi, DRAGONBALLZIncentivizer.address);

    console.log("setting distributor");
    await Promise.all([
        eth_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        ampl_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        yfi_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        ycrv_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        lend_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        mkr_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        snx_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        comp_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        link_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
        ycrv_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
      ]);

    let two_fifty = web3.utils.toBN(10**3).mul(web3.utils.toBN(10**18)).mul(web3.utils.toBN(250));
    let one_five = two_fifty.mul(web3.utils.toBN(6));

    console.log("transfering and notifying");
    console.log("eth");
    await Promise.all([
      dragonballz.transfer(DRAGONBALLZ_ETHPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_uAMPLPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_YFIPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_LENDPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_MKRPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_SNXPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_COMPPool.address, two_fifty.toString()),
      dragonballz.transfer(DRAGONBALLZ_LINKPool.address, two_fifty.toString()),
      dragonballz._setIncentivizer(DRAGONBALLZIncentivizer.address),
    ]);

    await Promise.all([
      eth_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      ampl_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      yfi_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      lend_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      mkr_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      snx_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      comp_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),
      link_pool.methods.notifyRewardAmount(two_fifty.toString()).send({from:accounts[0]}),

      // incentives is a minter and prepopulates itself.
      ycrv_pool.methods.notifyRewardAmount("0").send({from: accounts[0], gas: 500000}),
    ]);

    await Promise.all([
      eth_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      ampl_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      yfi_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      lend_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      mkr_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      snx_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      comp_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      link_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
      ycrv_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
    ]);
    await Promise.all([
      eth_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      ampl_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      yfi_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      lend_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      mkr_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      snx_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      comp_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      link_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
      ycrv_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
    ]);
  }

  await Promise.all([
    dragonballz._setPendingGov(Timelock.address),
    yReserves._setPendingGov(Timelock.address),
    yRebaser._setPendingGov(Timelock.address),
  ]);

  await Promise.all([
      tl.executeTransaction(
        DRAGONBALLZProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        DRAGONBALLZReserves.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        DRAGONBALLZRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
  ]);
  await tl.setPendingAdmin(Gov.address);
  await gov.__acceptAdmin();
  await gov.__abdicate();
}
