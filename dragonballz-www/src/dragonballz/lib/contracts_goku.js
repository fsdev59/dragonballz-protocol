import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import * as Types from "./types.js";
import { SUBTRACT_GAS_LIMIT, addressMap } from './constants.js';

import ERC20Json from '../clean_build/contracts/IERC20.json';
// import DRAGONBALLZJson from '../clean_build/contracts/DRAGONBALLZDelegator.json';
// import DRAGONBALLZRebaserJson from '../clean_build/contracts/DRAGONBALLZRebaser.json';
// import DRAGONBALLZReservesJson from '../clean_build/contracts/DRAGONBALLZReserves.json';
// import DRAGONBALLZGovJson from '../clean_build/contracts/GovernorAlpha.json';
// import DRAGONBALLZTimelockJson from '../clean_build/contracts/Timelock.json';
import GOKUJson from '../clean_build/contracts/GOKUDelegator.json';
// import GOKURebaserJson from '../clean_build/contracts/GOKURebaser.json';
// import GOKUReservesJson from '../clean_build/contracts/GOKUReserves.json';

// import WETHJson from './weth.json';
// import CRVJson from './crv.json';
import UNIFactJson from './unifact2.json';
import UNIPairJson from './uni2.json';
import UNIRouterJson from './uniR.json';

// basic pool
import BASEDSUSDPoolJson from '../clean_build/contracts/GOKUBASEDSUSDPool.json';
import DAIETHPoolJson from '../clean_build/contracts/GOKUDAIETHPool.json';
import GOKUETHPoolJson from '../clean_build/contracts/GOKUGOKUETHPool.json';
import GOKUUSDCPoolJson from '../clean_build/contracts/GOKUGOKUUSDCPool.json';
import GOKUUSDTPoolJson from '../clean_build/contracts/GOKUGOKUUSDTPool.json';
import GOKUYCRVPoolJson from '../clean_build/contracts/GOKUGOKUYCRVPool.json';
import KASHYCRVPoolJson from '../clean_build/contracts/GOKUKASHYCRVPool.json';
import KASRYCRVPoolJson from '../clean_build/contracts/GOKUKASRYCRVPool.json';
import LINKETHPoolJson from '../clean_build/contracts/GOKULINKETHPool.json';
import PYLONETHPoolJson from '../clean_build/contracts/GOKUPYLONETHPool.json';
import SNXETHPoolJson from '../clean_build/contracts/GOKUSNXETHPool.json';
import SOLARITEETHPoolJson from '../clean_build/contracts/GOKUSOLARITEETHPool.json';
import SWRVETHPoolJson from '../clean_build/contracts/GOKUSWRVETHPool.json';
import USDCETHPoolJson from '../clean_build/contracts/GOKUUSDCETHPool.json';
import USDTETHPoolJson from '../clean_build/contracts/GOKUUSDTETHPool.json';
import WBTCETHPoolJson from '../clean_build/contracts/GOKUWBTCETHPool.json';
import WETHPoolJson from '../clean_build/contracts/GOKUWETHPool.json';
import YFIETHPoolJson from '../clean_build/contracts/GOKUYFIETHPool.json';
import YFIIETHPoolJson from '../clean_build/contracts/GOKUYFIIETHPool.json';


// import LENDPoolJson from '../clean_build/contracts/DRAGONBALLZLENDPool.json';
// import PYLONETHPoolJson from '../clean_build/contracts/DRAGONBALLZPYLONETHPool.json';
// import PYLONPoolJson from '../clean_build/contracts/DRAGONBALLZPYLONPool.json';
// import RARIPoolJson from '../clean_build/contracts/DRAGONBALLZRARIPool.json';
// import USDTPoolJson from '../clean_build/contracts/DRAGONBALLZUSDTPool.json';
// import USDCPoolJson from '../clean_build/contracts/DRAGONBALLZUSDCPool.json';
// import WBTCPoolJson from '../clean_build/contracts/DRAGONBALLZWBTCPool.json';
// import YALINKPoolJson from '../clean_build/contracts/DRAGONBALLZYALINKPool.json';
// import SOLARITEPoolJson from '../clean_build/contracts/DRAGONBALLZSOLARITEPool.json';
// import WETHPoolJson from '../clean_build/contracts/DRAGONBALLZWETHPool.json';

// uniswap pool
// import IncJson from '../clean_build/contracts/DRAGONBALLZIncentivizer.json';

export class Contracts {
  constructor(
    provider,
    networkId,
    web3,
    options
  ) {
    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType || Types.ConfirmationType.Confirmed;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.uni_pair = new this.web3.eth.Contract(UNIPairJson);
    this.uni_router = new this.web3.eth.Contract(UNIRouterJson);
    this.uni_fact = new this.web3.eth.Contract(UNIFactJson);

    this.gokugokueth_pool = new this.web3.eth.Contract(GOKUETHPoolJson.abi);
    this.gokugokuusdt_pool = new this.web3.eth.Contract(GOKUUSDTPoolJson.abi);
    this.gokugokuusdc_pool = new this.web3.eth.Contract(GOKUUSDCPoolJson.abi);
    this.gokugokuycrv_pool = new this.web3.eth.Contract(GOKUYCRVPoolJson.abi);
    this.gokukassiarycrv_pool = new this.web3.eth.Contract(KASRYCRVPoolJson.abi);
    this.gokukassiahycrv_pool = new this.web3.eth.Contract(KASHYCRVPoolJson.abi);
    this.gokuwbtceth_pool = new this.web3.eth.Contract(WBTCETHPoolJson.abi);
    this.gokuweth_pool = new this.web3.eth.Contract(WETHPoolJson.abi);
    this.gokuyfiieth_pool = new this.web3.eth.Contract(YFIIETHPoolJson.abi);
    this.gokuyfieth_pool = new this.web3.eth.Contract(YFIETHPoolJson.abi);
    this.gokupyloneth_pool = new this.web3.eth.Contract(PYLONETHPoolJson.abi);
    this.gokuswerveth_pool = new this.web3.eth.Contract(SWRVETHPoolJson.abi);
    this.gokusolariteeth_pool = new this.web3.eth.Contract(SOLARITEETHPoolJson.abi);
    this.gokubasedsusd_pool = new this.web3.eth.Contract(BASEDSUSDPoolJson.abi);
    this.gokusnxeth_pool = new this.web3.eth.Contract(SNXETHPoolJson.abi);
    this.gokulinketh_pool = new this.web3.eth.Contract(LINKETHPoolJson.abi);
    this.gokudaieth_pool = new this.web3.eth.Contract(DAIETHPoolJson.abi);
    this.gokuusdceth_pool = new this.web3.eth.Contract(USDCETHPoolJson.abi);
    this.gokuusdteth_pool = new this.web3.eth.Contract(USDTETHPoolJson.abi);

    this.goku = new this.web3.eth.Contract(GOKUJson.abi);

    this.gokugokueth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokugokuusdt = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokugokuusdc = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokugokuycrv = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokukassiarycrv = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokukassiahycrv = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuwbtceth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuweth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuyfiieth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuyfieth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokupyloneth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuswerveth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokusolariteeth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokubasedsusd = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokusnxeth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokulinketh = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokudaieth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuusdceth = new this.web3.eth.Contract(ERC20Json.abi);
    this.gokuusdteth = new this.web3.eth.Contract(ERC20Json.abi);
    
    this.ycrv = new this.web3.eth.Contract(ERC20Json.abi);
    this.erc20 = new this.web3.eth.Contract(ERC20Json.abi);

    // this.rebaser = new this.web3.eth.Contract(DRAGONBALLZRebaserJson.abi);
    // this.reserves = new this.web3.eth.Contract(DRAGONBALLZReservesJson.abi);
    // this.gov = new this.web3.eth.Contract(DRAGONBALLZGovJson.abi);
    // this.timelock = new this.web3.eth.Contract(DRAGONBALLZTimelockJson.abi);

    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }


  setProvider(
    provider,
    networkId
  ) {
    this.goku.setProvider(provider);
    // this.rebaser.setProvider(provider);
    // this.reserves.setProvider(provider);
    // this.gov.setProvider(provider);
    // this.timelock.setProvider(provider);
    const contracts = [
      { contract: this.goku, json: GOKUJson },
      // { contract: this.rebaser, json: DRAGONBALLZRebaserJson },
      // { contract: this.reserves, json: DRAGONBALLZReservesJson },
      // { contract: this.gov, json: DRAGONBALLZGovJson },
      // { contract: this.timelock, json: DRAGONBALLZTimelockJson },

      { contract: this.gokugokueth_pool, json: GOKUETHPoolJson },
      { contract: this.gokugokuusdt_pool, json: GOKUUSDTPoolJson },
      { contract: this.gokugokuusdc_pool, json: GOKUUSDCPoolJson },
      { contract: this.gokugokuycrv_pool, json: GOKUYCRVPoolJson },
      { contract: this.gokukassiarycrv_pool, json: KASRYCRVPoolJson },
      { contract: this.gokukassiahycrv_pool, json: KASHYCRVPoolJson },
      { contract: this.gokuwbtceth_pool, json: WBTCETHPoolJson },
      { contract: this.gokuweth_pool, json: WETHPoolJson },
      { contract: this.gokuyfiieth_pool, json: YFIIETHPoolJson },
      { contract: this.gokuyfieth_pool, json: YFIETHPoolJson },
      { contract: this.gokupyloneth_pool, json: PYLONETHPoolJson },
      { contract: this.gokuswerveth_pool, json: SWRVETHPoolJson },
      { contract: this.gokusolariteeth_pool, json: SOLARITEETHPoolJson },
      { contract: this.gokubasedsusd_pool, json: BASEDSUSDPoolJson },
      { contract: this.gokusnxeth_pool, json: SNXETHPoolJson },
      { contract: this.gokulinketh_pool, json: LINKETHPoolJson },
      { contract: this.gokudaieth_pool, json: DAIETHPoolJson },
      { contract: this.gokuusdceth_pool, json: USDCETHPoolJson },
      { contract: this.gokuusdteth_pool, json: USDTETHPoolJson },
    ]

    contracts.forEach(contract => this.setContractProvider(
      contract.contract,
      contract.json,
      provider,
      networkId,
    ),
    );

    this.gokugokueth.options.address = addressMap.goku["GOKUETH"];
    this.gokugokuusdt.options.address = addressMap.goku["GOKUUSDT"];
    this.gokugokuusdc.options.address = addressMap.goku["GOKUUSDC"];
    this.gokugokuycrv.options.address = addressMap.goku["GOKUYCRV"];
    this.gokukassiarycrv.options.address = addressMap.goku["KASSIARYCRV"];
    this.gokukassiahycrv.options.address = addressMap.goku["KASSIAHYCRV"];
    this.gokuwbtceth.options.address = addressMap.goku["WBTCETH"];
    this.gokuweth.options.address = addressMap.goku["WETH"];
    this.gokuyfiieth.options.address = addressMap.goku["YFIIETH"];
    this.gokuyfieth.options.address = addressMap.goku["YFIETH"];
    this.gokuswerveth.options.address = addressMap.goku["SWERVETH"];
    this.gokupyloneth.options.address = addressMap.goku["PYLONETH"];
    this.gokusolariteeth.options.address = addressMap.goku["SOLARITEETH"];
    this.gokubasedsusd.options.address = addressMap.goku["BASEDSUSD"];
    this.gokusnxeth.options.address = addressMap.goku["SNXETH"];
    this.gokulinketh.options.address = addressMap.goku["LINKETH"];
    this.gokudaieth.options.address = addressMap.goku["DAIETH"];
    this.gokuusdceth.options.address = addressMap.goku["USDCETH"];
    this.gokuusdteth.options.address = addressMap.goku["USDTETH"];

    this.ycrv.options.address = addressMap.goku["YCRV"];
    this.uni_fact.options.address = addressMap.goku["uniswapFactoryV2"];
    this.uni_router.options.address = addressMap.goku["UNIRouter"];

    this.pools = [
      { "tokenAddr": this.gokugokueth.options.address, "poolAddr": this.gokugokueth_pool.options.address },
      { "tokenAddr": this.gokugokuusdt.options.address, "poolAddr": this.gokugokuusdt_pool.options.address },
      { "tokenAddr": this.gokugokuusdc.options.address, "poolAddr": this.gokugokuusdc_pool.options.address },
      { "tokenAddr": this.gokugokuycrv.options.address, "poolAddr": this.gokugokuycrv_pool.options.address },
      { "tokenAddr": this.gokukassiarycrv.options.address, "poolAddr": this.gokukassiarycrv_pool.options.address },
      { "tokenAddr": this.gokukassiahycrv.options.address, "poolAddr": this.gokukassiahycrv_pool.options.address },
      { "tokenAddr": this.gokuwbtceth.options.address, "poolAddr": this.gokuwbtceth_pool.options.address },
      { "tokenAddr": this.gokuweth.options.address, "poolAddr": this.gokuweth_pool.options.address },
      { "tokenAddr": this.gokuyfiieth.options.address, "poolAddr": this.gokuyfiieth_pool.options.address },
      { "tokenAddr": this.gokuyfieth.options.address, "poolAddr": this.gokuyfieth_pool.options.address },
      { "tokenAddr": this.gokuswerveth.options.address, "poolAddr": this.gokuswerveth_pool.options.address },
      { "tokenAddr": this.gokupyloneth.options.address, "poolAddr": this.gokupyloneth_pool.options.address },
      { "tokenAddr": this.gokusolariteeth.options.address, "poolAddr": this.gokusolariteeth_pool.options.address },
      { "tokenAddr": this.gokubasedsusd.options.address, "poolAddr": this.gokubasedsusd_pool.options.address },
      { "tokenAddr": this.gokusnxeth.options.address, "poolAddr": this.gokusnxeth_pool.options.address },
      { "tokenAddr": this.gokulinketh.options.address, "poolAddr": this.gokulinketh_pool.options.address },
      { "tokenAddr": this.gokudaieth.options.address, "poolAddr": this.gokudaieth_pool.options.address },
      { "tokenAddr": this.gokuusdceth.options.address, "poolAddr": this.gokuusdceth_pool.options.address },
      { "tokenAddr": this.gokuusdteth.options.address, "poolAddr": this.gokuusdteth_pool.options.address },
    ]
  }

  setDefaultAccount(
    account
  ) {
    // this.yfi.options.from = account;
    // this.crv.options.from = account;
    this.goku.options.from = account;
    // this.weth.options.from = account;
  }

  async callContractFunction(
    method,
    options
  ) {
    const { confirmations, confirmationType, autoGasMultiplier, ...txOptions } = options;

    if (!this.blockGasLimit) {
      await this.setGasLimit();
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice;
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate;
      if (this.defaultGas && confirmationType !== Types.ConfirmationType.Simulate) {
        txOptions.gas = this.defaultGas;
      } else {
        try {
          gasEstimate = await method.estimateGas(txOptions);
        } catch (error) {
          const data = method.encodeABI();
          const { from, value } = options;
          const to = method._parent._address;
          error.transactionData = { from, value, data, to };
          throw error;
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier;
        const totalGas = Math.floor(gasEstimate * multiplier);
        txOptions.gas = totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas;
        return { gasEstimate, g };
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0);
    } else {
      txOptions.value = '0';
    }

    const promi = method.send(txOptions);

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    };

    let hashOutcome = OUTCOMES.INITIAL;
    let confirmationOutcome = OUTCOMES.INITIAL;

    const t = confirmationType !== undefined ? confirmationType : this.confirmationType;

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`);
    }

    let hashPromise;
    let confirmationPromise;

    if (t === Types.ConfirmationType.Hash || t === Types.ConfirmationType.Both) {
      hashPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi;
              anyPromi.off();
            }
          });

          promi.on('transactionHash', (txHash) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.RESOLVED;
              resolve(txHash);
              if (t !== Types.ConfirmationType.Both) {
                const anyPromi = promi;
                anyPromi.off();
              }
            }
          });
        },
      );
    }

    if (t === Types.ConfirmationType.Confirmed || t === Types.ConfirmationType.Both) {
      confirmationPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (
              (t === Types.ConfirmationType.Confirmed || hashOutcome === OUTCOMES.RESOLVED)
              && confirmationOutcome === OUTCOMES.INITIAL
            ) {
              confirmationOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi;
              anyPromi.off();
            }
          });

          const desiredConf = confirmations || this.defaultConfirmations;
          if (desiredConf) {
            promi.on('confirmation', (confNumber, receipt) => {
              if (confNumber >= desiredConf) {
                if (confirmationOutcome === OUTCOMES.INITIAL) {
                  confirmationOutcome = OUTCOMES.RESOLVED;
                  resolve(receipt);
                  const anyPromi = promi;
                  anyPromi.off();
                }
              }
            });
          } else {
            promi.on('receipt', (receipt) => {
              confirmationOutcome = OUTCOMES.RESOLVED;
              resolve(receipt);
              const anyPromi = promi;
              anyPromi.off();
            });
          }
        },
      );
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise;
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash };
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise;
    }

    const transactionHash = await hashPromise;
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    };
  }

  async callConstantContractFunction(
    method,
    options
  ) {
    const m2 = method;
    const { blockNumber, ...txOptions } = options;
    return m2.call(txOptions, blockNumber);
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest');
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
  }

  setContractProvider(
    contract,
    contractJson,
    provider,
    networkId,
  ) {
    contract.setProvider(provider);
    try {
      contract.options.address = contractJson.networks[networkId]
        && contractJson.networks[networkId].address;
    } catch (error) {
      // console.log(error)
    }
  }
}
