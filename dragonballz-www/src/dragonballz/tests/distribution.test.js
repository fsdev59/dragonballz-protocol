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
    defaultGasPrice: "1",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)
const oneEther = 10 ** 18;

describe("Distribution", () => {
  let snapshotId;
  let user;
  let user2;
  let ycrv_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  let weth_account = "0xf9e11762d522ea29dd78178c9baf83b7b093aacc";
  let uni_ampl_account = "0x8c545be506a335e24145edd6e01d2754296ff018";
  let comp_account = "0xc89b6f0146642688bb254bf93c28fccf1e182c81";
  let lend_account = "0x3b08aa814bea604917418a9f0907e7fc430e742c";
  let link_account = "0xbe6977e08d4479c0a6777539ae0e8fa27be4e9d6";
  let mkr_account = "0xf37216a8ac034d08b4663108d7532dfcb44583ed";
  let snx_account = "0xb696d629cd0a00560151a434f6b4478ad6c228d7"
  let yfi_account = "0x0eb4add4ba497357546da7f5d12d39587ca24606";
  beforeAll(async () => {
    const accounts = await dragonballz.web3.eth.getAccounts();
    dragonballz.addAccount(accounts[0]);
    user = accounts[0];
    dragonballz.addAccount(accounts[1]);
    user2 = accounts[1];
    snapshotId = await dragonballz.testing.snapshot();
  });

  beforeEach(async () => {
    await dragonballz.testing.resetEVM("0x2");
  });

  describe("pool failures", () => {
    test("cant join pool 1s early", async () => {
      await dragonballz.testing.resetEVM("0x2");
      let a = await dragonballz.web3.eth.getBlock('latest');

      let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

      expect(dragonballz.toBigN(a["timestamp"]).toNumber()).toBeLessThan(dragonballz.toBigN(starttime).toNumber());

      //console.log("starttime", a["timestamp"], starttime);
      await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

      await dragonballz.testing.expectThrow(
        dragonballz.contracts.eth_pool.methods.stake(
          dragonballz.toBigN(200).times(dragonballz.toBigN(10**18)).toString()
        ).send({
          from: user,
          gas: 300000
        })
      , "not start");


      a = await dragonballz.web3.eth.getBlock('latest');

      starttime = await dragonballz.contracts.ampl_pool.methods.starttime().call();

      expect(dragonballz.toBigN(a["timestamp"]).toNumber()).toBeLessThan(dragonballz.toBigN(starttime).toNumber());

      //console.log("starttime", a["timestamp"], starttime);

      await dragonballz.contracts.UNIAmpl.methods.approve(dragonballz.contracts.ampl_pool.options.address, -1).send({from: user});

      await dragonballz.testing.expectThrow(dragonballz.contracts.ampl_pool.methods.stake(
        "5016536322915819"
      ).send({
        from: user,
        gas: 300000
      }), "not start");
    });

    test("cant join pool 2 early", async () => {

    });

    test("cant withdraw more than deposited", async () => {
      await dragonballz.testing.resetEVM("0x2");
      let a = await dragonballz.web3.eth.getBlock('latest');

      await dragonballz.contracts.weth.methods.transfer(user, dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString()).send({
        from: weth_account
      });
      await dragonballz.contracts.UNIAmpl.methods.transfer(user, "5000000000000000").send({
        from: uni_ampl_account
      });

      let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

      let waittime = starttime - a["timestamp"];
      if (waittime > 0) {
        await dragonballz.testing.increaseTime(waittime);
      }

      await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

      await dragonballz.contracts.eth_pool.methods.stake(
        dragonballz.toBigN(200).times(dragonballz.toBigN(10**18)).toString()
      ).send({
        from: user,
        gas: 300000
      });

      await dragonballz.contracts.UNIAmpl.methods.approve(dragonballz.contracts.ampl_pool.options.address, -1).send({from: user});

      await dragonballz.contracts.ampl_pool.methods.stake(
        "5000000000000000"
      ).send({
        from: user,
        gas: 300000
      });

      await dragonballz.testing.expectThrow(dragonballz.contracts.ampl_pool.methods.withdraw(
        "5016536322915820"
      ).send({
        from: user,
        gas: 300000
      }), "");

      await dragonballz.testing.expectThrow(dragonballz.contracts.eth_pool.methods.withdraw(
        dragonballz.toBigN(201).times(dragonballz.toBigN(10**18)).toString()
      ).send({
        from: user,
        gas: 300000
      }), "");

    });
  });

  describe("incentivizer pool", () => {
    test("joining and exiting", async() => {
      await dragonballz.testing.resetEVM("0x2");

      await dragonballz.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
        from: ycrv_account
      });

      await dragonballz.contracts.weth.methods.transfer(user, dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString()).send({
        from: weth_account
      });

      let a = await dragonballz.web3.eth.getBlock('latest');

      let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

      let waittime = starttime - a["timestamp"];
      if (waittime > 0) {
        await dragonballz.testing.increaseTime(waittime);
      } else {
        console.log("late entry", waittime)
      }

      await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

      await dragonballz.contracts.eth_pool.methods.stake(
        "2000000000000000000000"
      ).send({
        from: user,
        gas: 300000
      });

      let earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

      let rr = await dragonballz.contracts.eth_pool.methods.rewardRate().call();

      let rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();
      //console.log(earned, rr, rpt);
      await dragonballz.testing.increaseTime(86400);
      // await dragonballz.testing.mineBlock();

      earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

      rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();

      let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

      let j = await dragonballz.contracts.eth_pool.methods.getReward().send({
        from: user,
        gas: 300000
      });

      let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

      // start rebasing
        //console.log("approve dragonballz")
        await dragonballz.contracts.dragonballz.methods.approve(
          dragonballz.contracts.uni_router.options.address,
          -1
        ).send({
          from: user,
          gas: 80000
        });
        //console.log("approve ycrv")
        await dragonballz.contracts.ycrv.methods.approve(
          dragonballz.contracts.uni_router.options.address,
          -1
        ).send({
          from: user,
          gas: 80000
        });

        let ycrv_bal = await dragonballz.contracts.ycrv.methods.balanceOf(user).call()

        console.log("ycrv_bal bal", ycrv_bal)

        console.log("add liq/ create pool")
        await dragonballz.contracts.uni_router.methods.addLiquidity(
          dragonballz.contracts.dragonballz.options.address,
          dragonballz.contracts.ycrv.options.address,
          dragonballz_bal,
          dragonballz_bal,
          dragonballz_bal,
          dragonballz_bal,
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

        await dragonballz.contracts.uni_pair.methods.approve(
          dragonballz.contracts.ycrv_pool.options.address,
          -1
        ).send({
          from: user,
          gas: 300000
        });

        starttime = await dragonballz.contracts.ycrv_pool.methods.starttime().call();

        a = await dragonballz.web3.eth.getBlock('latest');

        waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry, pool 2", waittime)
        }

        await dragonballz.contracts.ycrv_pool.methods.stake(bal).send({from: user, gas: 400000});


        earned = await dragonballz.contracts.ampl_pool.methods.earned(user).call();

        rr = await dragonballz.contracts.ampl_pool.methods.rewardRate().call();

        rpt = await dragonballz.contracts.ampl_pool.methods.rewardPerToken().call();

        console.log(earned, rr, rpt);

        await dragonballz.testing.increaseTime(625000 + 1000);

        earned = await dragonballz.contracts.ampl_pool.methods.earned(user).call();

        rr = await dragonballz.contracts.ampl_pool.methods.rewardRate().call();

        rpt = await dragonballz.contracts.ampl_pool.methods.rewardPerToken().call();

        console.log(earned, rr, rpt);

        await dragonballz.contracts.ycrv_pool.methods.exit().send({from: user, gas: 400000});

        dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();


        expect(dragonballz.toBigN(dragonballz_bal).toNumber()).toBeGreaterThan(0)
        console.log("dragonballz bal after staking in pool 2", dragonballz_bal);
    });
  });

  describe("ampl", () => {
    test("rewards from pool 1s ampl", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.contracts.UNIAmpl.methods.transfer(user, "5000000000000000").send({
          from: uni_ampl_account
        });
        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          //console.log("missed entry");
        }

        await dragonballz.contracts.UNIAmpl.methods.approve(dragonballz.contracts.ampl_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.ampl_pool.methods.stake(
          "5000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.ampl_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.ampl_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.ampl_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.ampl_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.ampl_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.ampl_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        // let k = await dragonballz.contracts.eth_pool.methods.exit().send({
        //   from: user,
        //   gas: 300000
        // });
        //
        // //console.log(k.events)

        // weth_bal = await dragonballz.contracts.weth.methods.balanceOf(user).call()

        // expect(weth_bal).toBe(dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString())

        let ampl_bal = await dragonballz.contracts.UNIAmpl.methods.balanceOf(user).call()

        expect(ampl_bal).toBe("5000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("eth", () => {
    test("rewards from pool 1s eth", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.contracts.weth.methods.transfer(user, dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
    test("rewards from pool 1s eth with rebase", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
          from: ycrv_account
        });

        await dragonballz.contracts.weth.methods.transfer(user, dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(125000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);




        let j = await dragonballz.contracts.eth_pool.methods.getReward().send({
          from: user,
          gas: 300000
        });

        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        console.log("dragonballz bal", dragonballz_bal)
        // start rebasing
          //console.log("approve dragonballz")
          await dragonballz.contracts.dragonballz.methods.approve(
            dragonballz.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });
          //console.log("approve ycrv")
          await dragonballz.contracts.ycrv.methods.approve(
            dragonballz.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });

          let ycrv_bal = await dragonballz.contracts.ycrv.methods.balanceOf(user).call()

          console.log("ycrv_bal bal", ycrv_bal)

          console.log("add liq/ create pool")
          await dragonballz.contracts.uni_router.methods.addLiquidity(
            dragonballz.contracts.dragonballz.options.address,
            dragonballz.contracts.ycrv.options.address,
            dragonballz_bal,
            dragonballz_bal,
            dragonballz_bal,
            dragonballz_bal,
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
          //console.log("init swap")
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

          // trade back for easier calcs later
          //console.log("swap 0")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "10000000000000000",
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

          await dragonballz.testing.increaseTime(43200);

          //console.log("init twap")
          await dragonballz.contracts.rebaser.methods.init_twap().send({
            from: user,
            gas: 500000
          });

          //console.log("first swap")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000000",
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
          //console.log("second swap")
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

          a = await dragonballz.web3.eth.getBlock('latest');

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

          let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

          let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

          let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

          // new balance > old balance
          expect(dragonballz.toBigN(bal).toNumber()).toBeLessThan(dragonballz.toBigN(bal1).toNumber());
          // increases reserves
          expect(dragonballz.toBigN(resycrv).toNumber()).toBeGreaterThan(0);

          r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
          q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
          console.log("quote", q);
          // not below peg
          expect(dragonballz.toBigN(q).toNumber()).toBeGreaterThan(dragonballz.toBigN(10**18).toNumber());


        await dragonballz.testing.increaseTime(525000 + 100);


        j = await dragonballz.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });
        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(
          dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toNumber()
        ).toBeGreaterThan(two_fity.toNumber())
    });
    test("rewards from pool 1s eth with negative rebase", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.contracts.ycrv.methods.transfer(user, "12000000000000000000000000").send({
          from: ycrv_account
        });

        await dragonballz.contracts.weth.methods.transfer(user, dragonballz.toBigN(2000).times(dragonballz.toBigN(10**18)).toString()).send({
          from: weth_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.eth_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.weth.methods.approve(dragonballz.contracts.eth_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.eth_pool.methods.stake(
          "2000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.eth_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(125000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.eth_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.eth_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);




        let j = await dragonballz.contracts.eth_pool.methods.getReward().send({
          from: user,
          gas: 300000
        });

        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        console.log("dragonballz bal", dragonballz_bal)
        // start rebasing
          //console.log("approve dragonballz")
          await dragonballz.contracts.dragonballz.methods.approve(
            dragonballz.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });
          //console.log("approve ycrv")
          await dragonballz.contracts.ycrv.methods.approve(
            dragonballz.contracts.uni_router.options.address,
            -1
          ).send({
            from: user,
            gas: 80000
          });

          let ycrv_bal = await dragonballz.contracts.ycrv.methods.balanceOf(user).call()

          console.log("ycrv_bal bal", ycrv_bal)

          dragonballz_bal = dragonballz.toBigN(dragonballz_bal);
          console.log("add liq/ create pool")
          await dragonballz.contracts.uni_router.methods.addLiquidity(
            dragonballz.contracts.dragonballz.options.address,
            dragonballz.contracts.ycrv.options.address,
            dragonballz_bal.times(.1).toString(),
            dragonballz_bal.times(.1).toString(),
            dragonballz_bal.times(.1).toString(),
            dragonballz_bal.times(.1).toString(),
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
          //console.log("init swap")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000000",
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

          // trade back for easier calcs later
          //console.log("swap 0")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "100000000000000",
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

          //console.log("init twap")
          await dragonballz.contracts.rebaser.methods.init_twap().send({
            from: user,
            gas: 500000
          });

          //console.log("first swap")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "100000000000000",
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
          //console.log("second swap")
          await dragonballz.contracts.uni_router.methods.swapExactTokensForTokens(
            "1000000000000000000",
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

          a = await dragonballz.web3.eth.getBlock('latest');

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

          let bal1 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call();

          let resDRAGONBALLZ = await dragonballz.contracts.dragonballz.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

          let resycrv = await dragonballz.contracts.ycrv.methods.balanceOf(dragonballz.contracts.reserves.options.address).call();

          expect(dragonballz.toBigN(bal1).toNumber()).toBeLessThan(dragonballz.toBigN(bal).toNumber());
          expect(dragonballz.toBigN(resycrv).toNumber()).toBe(0);

          r = await dragonballz.contracts.uni_pair.methods.getReserves().call();
          q = await dragonballz.contracts.uni_router.methods.quote(dragonballz.toBigN(10**18).toString(), r[0], r[1]).call();
          console.log("quote", q);
          // not below peg
          expect(dragonballz.toBigN(q).toNumber()).toBeLessThan(dragonballz.toBigN(10**18).toNumber());


        await dragonballz.testing.increaseTime(525000 + 100);


        j = await dragonballz.contracts.eth_pool.methods.exit().send({
          from: user,
          gas: 300000
        });
        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.weth.methods.balanceOf(user).call()

        expect(weth_bal).toBe("2000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(
          dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toNumber()
        ).toBeLessThan(two_fity.toNumber())
    });
  });

  describe("yfi", () => {
    test("rewards from pool 1s yfi", async () => {
        await dragonballz.testing.resetEVM("0x2");
        await dragonballz.contracts.yfi.methods.transfer(user, "500000000000000000000").send({
          from: yfi_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.yfi_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.yfi.methods.approve(dragonballz.contracts.yfi_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.yfi_pool.methods.stake(
          "500000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.yfi_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.yfi_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.yfi_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.yfi_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.yfi_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.yfi_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.yfi.methods.balanceOf(user).call()

        expect(weth_bal).toBe("500000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("comp", () => {
    test("rewards from pool 1s comp", async () => {
        await dragonballz.testing.resetEVM("0x2");
        await dragonballz.contracts.comp.methods.transfer(user, "50000000000000000000000").send({
          from: comp_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.comp_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.comp.methods.approve(dragonballz.contracts.comp_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.comp_pool.methods.stake(
          "50000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.comp_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.comp_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.comp_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.comp_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.comp_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.comp_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.comp.methods.balanceOf(user).call()

        expect(weth_bal).toBe("50000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("lend", () => {
    test("rewards from pool 1s lend", async () => {
        await dragonballz.testing.resetEVM("0x2");
        await dragonballz.web3.eth.sendTransaction({from: user2, to: lend_account, value : dragonballz.toBigN(100000*10**18).toString()});

        await dragonballz.contracts.lend.methods.transfer(user, "10000000000000000000000000").send({
          from: lend_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.lend_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.lend.methods.approve(dragonballz.contracts.lend_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.lend_pool.methods.stake(
          "10000000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.lend_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.lend_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.lend_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.lend_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.lend_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.lend_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.lend.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("link", () => {
    test("rewards from pool 1s link", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.web3.eth.sendTransaction({from: user2, to: link_account, value : dragonballz.toBigN(100000*10**18).toString()});

        await dragonballz.contracts.link.methods.transfer(user, "10000000000000000000000000").send({
          from: link_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.link_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.link.methods.approve(dragonballz.contracts.link_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.link_pool.methods.stake(
          "10000000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.link_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.link_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.link_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.link_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.link_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.link_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.link.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("mkr", () => {
    test("rewards from pool 1s mkr", async () => {
        await dragonballz.testing.resetEVM("0x2");
        await dragonballz.web3.eth.sendTransaction({from: user2, to: mkr_account, value : dragonballz.toBigN(100000*10**18).toString()});
        let eth_bal = await dragonballz.web3.eth.getBalance(mkr_account);

        await dragonballz.contracts.mkr.methods.transfer(user, "10000000000000000000000").send({
          from: mkr_account
        });

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.mkr_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.mkr.methods.approve(dragonballz.contracts.mkr_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.mkr_pool.methods.stake(
          "10000000000000000000000"
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.mkr_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.mkr_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.mkr_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.mkr_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.mkr_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.mkr_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.mkr.methods.balanceOf(user).call()

        expect(weth_bal).toBe("10000000000000000000000")


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });

  describe("snx", () => {
    test("rewards from pool 1s snx", async () => {
        await dragonballz.testing.resetEVM("0x2");

        await dragonballz.web3.eth.sendTransaction({from: user2, to: snx_account, value : dragonballz.toBigN(100000*10**18).toString()});

        let snx_bal = await dragonballz.contracts.snx.methods.balanceOf(snx_account).call();

        console.log(snx_bal)

        await dragonballz.contracts.snx.methods.transfer(user, snx_bal).send({
          from: snx_account
        });

        snx_bal = await dragonballz.contracts.snx.methods.balanceOf(user).call();

        console.log(snx_bal)

        let a = await dragonballz.web3.eth.getBlock('latest');

        let starttime = await dragonballz.contracts.snx_pool.methods.starttime().call();

        let waittime = starttime - a["timestamp"];
        if (waittime > 0) {
          await dragonballz.testing.increaseTime(waittime);
        } else {
          console.log("late entry", waittime)
        }

        await dragonballz.contracts.snx.methods.approve(dragonballz.contracts.snx_pool.options.address, -1).send({from: user});

        await dragonballz.contracts.snx_pool.methods.stake(
          snx_bal
        ).send({
          from: user,
          gas: 300000
        });

        let earned = await dragonballz.contracts.snx_pool.methods.earned(user).call();

        let rr = await dragonballz.contracts.snx_pool.methods.rewardRate().call();

        let rpt = await dragonballz.contracts.snx_pool.methods.rewardPerToken().call();
        //console.log(earned, rr, rpt);
        await dragonballz.testing.increaseTime(625000 + 100);
        // await dragonballz.testing.mineBlock();

        earned = await dragonballz.contracts.snx_pool.methods.earned(user).call();

        rpt = await dragonballz.contracts.snx_pool.methods.rewardPerToken().call();

        let ysf = await dragonballz.contracts.dragonballz.methods.dragonballzsScalingFactor().call();

        //console.log(earned, ysf, rpt);


        let dragonballz_bal = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let j = await dragonballz.contracts.snx_pool.methods.exit().send({
          from: user,
          gas: 300000
        });

        //console.log(j.events)

        let weth_bal = await dragonballz.contracts.snx.methods.balanceOf(user).call()

        expect(weth_bal).toBe(snx_bal)


        let dragonballz_bal2 = await dragonballz.contracts.dragonballz.methods.balanceOf(user).call()

        let two_fity = dragonballz.toBigN(250).times(dragonballz.toBigN(10**3)).times(dragonballz.toBigN(10**18))
        expect(dragonballz.toBigN(dragonballz_bal2).minus(dragonballz.toBigN(dragonballz_bal)).toString()).toBe(two_fity.times(1).toString())
    });
  });
})
