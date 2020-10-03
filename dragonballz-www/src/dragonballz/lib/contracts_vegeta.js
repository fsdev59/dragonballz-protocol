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
import VEGETAJson from '../clean_build/contracts/VEGETADelegator.json';

// import WETHJson from './weth.json';
// import CRVJson from './crv.json';
import UNIFactJson from './unifact2.json';
import UNIPairJson from './uni2.json';
import UNIRouterJson from './uniR.json';

// basic pool
import DAIETHPoolJson from '../clean_build/contracts/VEGETADAIETHPool.json';
import ETHCOMPPoolJson from '../clean_build/contracts/VEGETAETHCOMPPool.json';
import LENDETHPoolJson from '../clean_build/contracts/VEGETALENDETHPool.json';
import LINKETHPoolJson from '../clean_build/contracts/VEGETALINKETHPool.json';
import SNXETHPoolJson from '../clean_build/contracts/VEGETASNXETHPool.json';
import SUSHIETHPoolJson from '../clean_build/contracts/VEGETASUSHIETHPool.json';
import USDCETHPoolJson from '../clean_build/contracts/VEGETAUSDCETHPool.json';
import USDTETHPoolJson from '../clean_build/contracts/VEGETAUSDTETHPool.json';
import VEGETAETHPoolJson from '../clean_build/contracts/VEGETAVEGETAETHPool.json';
import VEGETAUSDCPoolJson from '../clean_build/contracts/VEGETAVEGETAUSDCPool.json';
import VEGETAUSDTPoolJson from '../clean_build/contracts/VEGETAVEGETAUSDTPool.json';
import YFIETHPoolJson from '../clean_build/contracts/VEGETAYFIETHPool.json';

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

    this.vegetavegetaeth_pool = new this.web3.eth.Contract(VEGETAETHPoolJson.abi);
    this.vegetavegetausdt_pool = new this.web3.eth.Contract(VEGETAUSDTPoolJson.abi);
    this.vegetavegetausdc_pool = new this.web3.eth.Contract(VEGETAUSDCPoolJson.abi);
    this.vegetaethcomp_pool = new this.web3.eth.Contract(ETHCOMPPoolJson.abi);
    this.vegetalendeth_pool = new this.web3.eth.Contract(LENDETHPoolJson.abi);
    this.vegetasnxeth_pool = new this.web3.eth.Contract(SNXETHPoolJson.abi);
    this.vegetalinketh_pool = new this.web3.eth.Contract(LINKETHPoolJson.abi);
    this.vegetadaieth_pool = new this.web3.eth.Contract(DAIETHPoolJson.abi);
    this.vegetausdceth_pool = new this.web3.eth.Contract(USDCETHPoolJson.abi);
    this.vegetausdteth_pool = new this.web3.eth.Contract(USDTETHPoolJson.abi);
    this.vegetasushieth_pool = new this.web3.eth.Contract(SUSHIETHPoolJson.abi);
    this.vegetayfieth_pool = new this.web3.eth.Contract(YFIETHPoolJson.abi);

    this.vegeta = new this.web3.eth.Contract(VEGETAJson.abi);

    this.vegetavegetaeth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetavegetausdt = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetavegetausdc = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetaethcomp = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetalendeth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetasnxeth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetalinketh = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetadaieth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetausdceth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetausdteth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetasushieth = new this.web3.eth.Contract(ERC20Json.abi);
    this.vegetayfieth = new this.web3.eth.Contract(ERC20Json.abi);
    
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
    this.vegeta.setProvider(provider);
    // this.rebaser.setProvider(provider);
    // this.reserves.setProvider(provider);
    // this.gov.setProvider(provider);
    // this.timelock.setProvider(provider);
    const contracts = [
      { contract: this.vegeta, json: VEGETAJson },
      // { contract: this.rebaser, json: DRAGONBALLZRebaserJson },
      // { contract: this.reserves, json: DRAGONBALLZReservesJson },
      // { contract: this.gov, json: DRAGONBALLZGovJson },
      // { contract: this.timelock, json: DRAGONBALLZTimelockJson },

      { contract: this.vegetavegetaeth_pool, json: VEGETAETHPoolJson },
      { contract: this.vegetavegetausdt_pool, json: VEGETAUSDTPoolJson },
      { contract: this.vegetavegetausdc_pool, json: VEGETAUSDCPoolJson },
      { contract: this.vegetaethcomp_pool, json: ETHCOMPPoolJson },
      { contract: this.vegetalendeth_pool, json: LENDETHPoolJson },
      { contract: this.vegetasnxeth_pool, json: SNXETHPoolJson },
      { contract: this.vegetalinketh_pool, json: LINKETHPoolJson },
      { contract: this.vegetadaieth_pool, json: DAIETHPoolJson },
      { contract: this.vegetausdceth_pool, json: USDCETHPoolJson },
      { contract: this.vegetausdteth_pool, json: USDTETHPoolJson },
      { contract: this.vegetasushieth_pool, json: SUSHIETHPoolJson },
      { contract: this.vegetayfieth_pool, json: YFIETHPoolJson },
    ]

    contracts.forEach(contract => this.setContractProvider(
        contract.contract,
        contract.json,
        provider,
        networkId,
      ),
    );
    
    this.vegetavegetaeth.options.address = addressMap.vegeta["VEGETAETH"];
    this.vegetavegetausdt.options.address = addressMap.vegeta["VEGETAUSDT"];
    this.vegetavegetausdc.options.address = addressMap.vegeta["VEGETAUSDC"];
    this.vegetaethcomp.options.address = addressMap.vegeta["ETHCOMP"];
    this.vegetalendeth.options.address = addressMap.vegeta["LENDETH"];
    this.vegetasnxeth.options.address = addressMap.vegeta["SNXETH"];
    this.vegetalinketh.options.address = addressMap.vegeta["LINKETH"];
    this.vegetadaieth.options.address = addressMap.vegeta["DAIETH"];
    this.vegetausdceth.options.address = addressMap.vegeta["USDCETH"];
    this.vegetausdteth.options.address = addressMap.vegeta["USDTETH"];
    this.vegetasushieth.options.address = addressMap.vegeta["SUSHIETH"];
    this.vegetayfieth.options.address = addressMap.vegeta["YFIETH"];

    this.ycrv.options.address = addressMap.vegeta["YCRV"];
    
    this.uni_fact.options.address = addressMap.vegeta["uniswapFactoryV2"];
    this.uni_router.options.address = addressMap.vegeta["UNIRouter"];

    this.pools = [
      {"tokenAddr": this.vegetavegetaeth.options.address, "poolAddr": this.vegetavegetaeth_pool.options.address},
      {"tokenAddr": this.vegetavegetausdt.options.address, "poolAddr": this.vegetavegetausdt_pool.options.address},
      {"tokenAddr": this.vegetavegetausdc.options.address, "poolAddr": this.vegetavegetausdc_pool.options.address},
      {"tokenAddr": this.vegetaethcomp.options.address, "poolAddr": this.vegetaethcomp_pool.options.address},
      {"tokenAddr": this.vegetalendeth.options.address, "poolAddr": this.vegetalendeth_pool.options.address},
      {"tokenAddr": this.vegetasnxeth.options.address, "poolAddr": this.vegetasnxeth_pool.options.address},
      {"tokenAddr": this.vegetalinketh.options.address, "poolAddr": this.vegetalinketh_pool.options.address},
      {"tokenAddr": this.vegetadaieth.options.address, "poolAddr": this.vegetadaieth_pool.options.address},
      {"tokenAddr": this.vegetausdceth.options.address, "poolAddr": this.vegetausdceth_pool.options.address},
      {"tokenAddr": this.vegetausdteth.options.address, "poolAddr": this.vegetausdteth_pool.options.address},
      {"tokenAddr": this.vegetasushieth.options.address, "poolAddr": this.vegetasushieth_pool.options.address},
      {"tokenAddr": this.vegetayfieth.options.address, "poolAddr": this.vegetayfieth_pool.options.address},
    ]
  }

  setDefaultAccount(
    account
  ) {
    // this.yfi.options.from = account;
    // this.crv.options.from = account;
    this.vegeta.options.from = account;
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
              const anyPromi = promi ;
              anyPromi.off();
            }
          });

          promi.on('transactionHash', (txHash) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.RESOLVED;
              resolve(txHash);
              if (t !== Types.ConfirmationType.Both) {
                const anyPromi = promi ;
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
              const anyPromi = promi ;
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
                  const anyPromi = promi ;
                  anyPromi.off();
                }
              }
            });
          } else {
            promi.on('receipt', (receipt) => {
              confirmationOutcome = OUTCOMES.RESOLVED;
              resolve(receipt);
              const anyPromi = promi ;
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
  ){
    contract.setProvider(provider);
    try {
      contract.options.address = contractJson.networks[networkId]
        && contractJson.networks[networkId].address;
    } catch (error) {
      // console.log(error)
    }
  }
}
