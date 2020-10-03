import {
  Yam
} from "../index.js";
import * as Types from "../lib/types.js";
import {
  addressMap
} from "../lib/constants.js";
import {
  decimalToString,
  stringToDecimal
} from "../lib/Helpers.js"


export const dragonballz = new Yam(
  "http://localhost:8545/",
  // "http://127.0.0.1:9545/",
  "1001",
  true, {
    defaultAccount: "",
    defaultConfirmations: 1,
    autoGasMultiplier: 1.5,
    testing: false,
    defaultGas: "6000000",
    defaultGasPrice: "1000000000000",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)
const oneEther = 10 ** 18;

describe("post-deployment", () => {
  let snapshotId;
  let user;

  beforeAll(async () => {
    const accounts = await dragonballz.web3.eth.getAccounts();
    dragonballz.addAccount(accounts[0]);
    user = accounts[0];
    snapshotId = await dragonballz.testing.snapshot();
  });

  beforeEach(async () => {
    await dragonballz.testing.resetEVM("0x2");
  });

  describe("supply ownership", () => {

    test("owner balance", async () => {
      let balance = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();
      expect(balance).toBe(dragonballz.toBigN(7000000).times(dragonballz.toBigN(10**18)).toString())
    });

    test("pool balances", async () => {
      let ycrv_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.ycrv_pool.options.address).call();

      expect(ycrv_balance).toBe(dragonballz.toBigN(1500000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let yfi_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.yfi_pool.options.address).call();

      expect(yfi_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let ampl_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.ampl_pool.options.address).call();

      expect(ampl_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let eth_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.eth_pool.options.address).call();

      expect(eth_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let snx_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.snx_pool.options.address).call();

      expect(snx_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let comp_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.comp_pool.options.address).call();

      expect(comp_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let lend_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.lend_pool.options.address).call();

      expect(lend_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let link_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.link_pool.options.address).call();

      expect(link_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

      let mkr_balance = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.mkr_pool.options.address).call();

      expect(mkr_balance).toBe(dragonballz.toBigN(250000).times(dragonballz.toBigN(10**18)).times(dragonballz.toBigN(1)).toString())

    });

    test("total supply", async () => {
      let ts = await dragonballz.contracts.dragonballz.methods.totalSupply().call();
      expect(ts).toBe("10500000000000000000000000")
    });

    test("init supply", async () => {
      let init_s = await dragonballz.contracts.dragonballz.methods.initSupply().call();
      expect(init_s).toBe("10500000000000000000000000000000")
    });
  });

  describe("contract ownership", () => {

    test("dragonballz gov", async () => {
      let gov = await dragonballz.contracts.dragonballz.methods.gov().call();
      expect(gov).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("rebaser gov", async () => {
      let gov = await dragonballz.contracts.rebaser.methods.gov().call();
      expect(gov).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("reserves gov", async () => {
      let gov = await dragonballz.contracts.reserves.methods.gov().call();
      expect(gov).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("timelock admin", async () => {
      let gov = await dragonballz.contracts.timelock.methods.admin().call();
      expect(gov).toBe(dragonballz.contracts.gov.options.address)
    });

    test("gov timelock", async () => {
      let tl = await dragonballz.contracts.gov.methods.timelock().call();
      expect(tl).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("gov guardian", async () => {
      let grd = await dragonballz.contracts.gov.methods.guardian().call();
      expect(grd).toBe("0x0000000000000000000000000000000000000000")
    });

    test("pool owner", async () => {
      let owner = await dragonballz.contracts.eth_pool.methods.owner().call();
      expect(owner).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("incentives owner", async () => {
      let owner = await dragonballz.contracts.ycrv_pool.methods.owner().call();
      expect(owner).toBe(dragonballz.contracts.timelock.options.address)
    });

    test("pool rewarder", async () => {
      let rewarder = await dragonballz.contracts.eth_pool.methods.rewardDistribution().call();
      expect(rewarder).toBe(dragonballz.contracts.timelock.options.address)
    });
  });

  describe("timelock delay initiated", () => {
    test("timelock delay initiated", async () => {
      let inited = await dragonballz.contracts.timelock.methods.admin_initialized().call();
      expect(inited).toBe(true);
    })
  })
})
