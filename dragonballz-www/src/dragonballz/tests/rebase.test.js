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

describe("rebase_tests", () => {
  let snapshotId;
  let user;
  let new_user;
  // let unlocked_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  let unlocked_account = "0x681148725731f213b0187a3cbef215c291d85a3e";

  beforeAll(async () => {
    const accounts = await dragonballz.web3.eth.getAccounts();
    dragonballz.addAccount(accounts[0]);
    user = accounts[0];
    new_user = accounts[1];
    snapshotId = await dragonballz.testing.snapshot();
  });

  beforeEach(async () => {
    await dragonballz.testing.resetEVM("0x2");
    let a = await dragonballz.contracts.ycrv.methods.transfer(user, "2000000000000000000000000").send({
      from: unlocked_account
    });
  });

  describe("rebase", () => {
    test("user has ycrv", async () => {
      let bal0 = await dragonballz.contracts.ycrv.methods.balanceOf(user).call();
      expect(bal0).toBe("2000000000000000000000000");
    });
    test("create pair", async () => {
      await dragonballz.contracts.uni_fact.methods.createPair(
        dragonballz.contracts.ycrv.options.address,
        dragonballz.contracts.dragonballz.options.address
      ).send({
        from: user,
        gas: 8000000
      })
    });
    test("mint pair", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        10000000,
        10000000,
        10000000,
        10000000,
        user,
        1596740361 + 100000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();
      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();
      expect(dragonballz.toBigN(bal).toNumber()).toBeGreaterThan(100)
    });
    test("init_twap", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        100000,
        100000,
        100000,
        100000,
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();
      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        1000,
        100,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(1000);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });



      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();
      let priceCumulativeLast = await dragonballz.contracts.rebaser.methods.priceCumulativeLast().call();
      expect(dragonballz.toBigN(init_twap).toNumber()).toBeGreaterThan(0);
      expect(dragonballz.toBigN(priceCumulativeLast).toNumber()).toBeGreaterThan(0);
    });
    test("activate rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        100000,
        100000,
        100000,
        100000,
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });
      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();
      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        1000,
        100,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(1000);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });



      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();
      let priceCumulativeLast = await dragonballz.contracts.rebaser.methods.priceCumulativeLast().call();
      expect(dragonballz.toBigN(init_twap).toNumber()).toBeGreaterThan(0);
      expect(dragonballz.toBigN(priceCumulativeLast).toNumber()).toBeGreaterThan(0);

      await dragonballz.testing.increaseTime(12 * 60 * 60);

      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });
    });
    test("positive rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      let res_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(
          dragonballz.contracts.reserves.options.address
      ).call();

      expect(res_bal).toBe("0");

      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await dragonballz.testing.increaseTime(i);

      let r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      let q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre positive rebase", q);

      let b = await dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      //console.log(b.events)
      console.log("positive rebase gas used:", b["gasUsed"]);

      let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      console.log("bal user, bal dragonballz res, bal res crv", bal1, resDRAGONBALLZ, resycrv);
      r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("post positive rebase quote", q);

      // new balance > old balance
      expect(dragonballz.toBigN(bal).toNumber()).toBeLessThan(dragonballz.toBigN(bal1).toNumber());
      // used full dragonballz reserves
      expect(dragonballz.toBigN(resDRAGONBALLZ).toNumber()).toBe(0);
      // increases reserves
      expect(dragonballz.toBigN(resycrv).toNumber()).toBeGreaterThan(0);


      // not below peg
      expect(dragonballz.toBigN(q).toNumber()).toBeGreaterThan(dragonballz.toBigN(10**18).toNumber());
    });
    test("negative rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await dragonballz.testing.increaseTime(i);

      let r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      let q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre negative rebase", q);

      let b = await dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      //console.log(b.events)
      console.log("negative rebase gas used:", b["gasUsed"]);

      let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      // balance decreases
      expect(dragonballz.toBigN(bal1).toNumber()).toBeLessThan(dragonballz.toBigN(bal).toNumber());
      // no increases to reserves
      expect(dragonballz.toBigN(resDRAGONBALLZ).toNumber()).toBe(0);
      expect(dragonballz.toBigN(resycrv).toNumber()).toBe(0);
    });
    test("no rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await dragonballz.testing.increaseTime(i);

      let r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      console.log(r, r[0], r[1]);
      let q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre no rebase", q);
      let b = await dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });

      console.log("no rebase gas used:", b["gasUsed"]);

      let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      // no change
      expect(dragonballz.toBigN(bal1).toNumber()).toBe(dragonballz.toBigN(bal).toNumber());
      // no increases to reserves
      expect(dragonballz.toBigN(resDRAGONBALLZ).toNumber()).toBe(0);
      expect(dragonballz.toBigN(resycrv).toNumber()).toBe(0);
      r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote post no rebase", q);
    });
    test("rebasing with DRAGONBALLZ in reserves", async () => {
      await dragonballz.contracts.dragonballz.methods.transfer(dragonballz.contracts.reserves.options.address, dragonballz.toBigN(60000*10**18).toString()).send({from: user});
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await dragonballz.testing.increaseTime(i);


      let r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      let q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote pre pos rebase with reserves", q);

      let b = await dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      });
      //console.log(b.events)

      console.log("positive  with reserves gas used:", b["gasUsed"]);

      let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

      console.log(bal, bal1, resDRAGONBALLZ, resycrv);
      expect(dragonballz.toBigN(bal).toNumber()).toBeLessThan(dragonballz.toBigN(bal1).toNumber());
      expect(dragonballz.toBigN(resDRAGONBALLZ).toNumber()).toBeGreaterThan(0);
      expect(dragonballz.toBigN(resycrv).toNumber()).toBeGreaterThan(0);
      r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
      q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
      console.log("quote post rebase w/ reserves", q);
      expect(dragonballz.toBigN(q).toNumber()).toBeGreaterThan(dragonballz.toBigN(10**18).toNumber());
    });
  });

  describe("failing", () => {
    test("unitialized rebasing", async () => {
      await dragonballz.testing.expectThrow(dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      }), "twap wasnt intitiated, call init_twap()");
    });
    test("no early twap", async () => {
      await dragonballz.testing.expectThrow(dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      }), "");
    });
    test("too late rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });


      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      let len = await dragonballz.contracts.rebaser.methods.rebaseWindowLengthSec().call();

      await dragonballz.testing.increaseTime(i + dragonballz.toBigN(len).toNumber()+1);

      let b = await dragonballz.testing.expectThrow(dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      }), "too late");
    });
    test("too early rebasing", async () => {
      await dragonballz.contracts.dragonballz.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });
      await dragonballz.contracts.ycrv.methods.approve(
        dragonballz.contracts.uni_router.options.address,
        -1
      ).send({
        from: user,
        gas: 80000
      });

      await dragonballz.contracts.uni_router.methods.addLiquidity(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address,
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        "1000000000000000000000000",
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 8000000
      });

      let pair = await dragonballz.contracts.uni_fact.methods.getPair(
        dragonballz.contracts.dragonballz.options.address,
        dragonballz.contracts.ycrv.options.address
      ).call();

      dragonballz.contracts.uni_pair.options.address = pair;
      let bal = await dragonballz.contracts.uni_pair.methods.balanceOf(user).call();

      // make a trade to get init values in uniswap
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // trade back for easier calcs later
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "100000000000",
        100000,
        [
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      await dragonballz.testing.increaseTime(43200);

      await dragonballz.contracts.rebaser.methods.init_twap().send({
        from: user,
        gas: 500000
      });


      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "500000000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // init twap
      let init_twap = await dragonballz.contracts.rebaser.methods.timeOfTWAPInit().call();

      // wait 12 hours
      await dragonballz.testing.increaseTime(12 * 60 * 60);

      // perform trade to change price
      await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
        "10000000000000000000",
        100000,
        [
          dragonballz.contracts.ycrv.options.address,
          dragonballz.contracts.dragonballz.options.address
        ],
        user,
        1596740361 + 10000000
      ).send({
        from: user,
        gas: 1000000
      });

      // activate rebasing
      await dragonballz.contracts.rebaser.methods.activate_rebasing().send({
        from: user,
        gas: 500000
      });

      bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

      let a = await dragonballz.web3.eth.getBlock('latest');

      let offset = await dragonballz.contracts.rebaser.methods.rebaseWindowOffsetSec().call();
      offset = dragonballz.toBigN(offset).toNumber();
      let interval = await dragonballz.contracts.rebaser.methods.minRebaseTimeIntervalSec().call();
      interval = dragonballz.toBigN(interval).toNumber();

      let i;
      if (a["timestamp"] % interval > offset) {
        i = (interval - (a["timestamp"] % interval)) + offset;
      } else {
        i = offset - (a["timestamp"] % interval);
      }

      await dragonballz.testing.increaseTime(i - 1);



      let b = await dragonballz.testing.expectThrow(dragonballz.contracts.rebaser.methods.rebase().send({
        from: user,
        gas: 2500000
      }), "too early");
    });
  });
});
