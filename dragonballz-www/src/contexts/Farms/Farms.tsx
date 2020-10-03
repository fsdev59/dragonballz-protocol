import React, { useCallback, useEffect, useState } from "react";

import { Contract } from "web3-eth-contract";

import { goku as gokuAddress, vegeta as vegetaAddress } from "../../constants/tokenAddresses";
import useDragonballz from "../../hooks/useDragonballz";
import { getPoolContracts } from "../../dragonballzUtils";

import Context from "./context";
import { Farm } from "./types";


const NAME_FOR_POOL_GOKU: { [key: string]: string } = {
  gokugokueth_pool: "Hyperbolic Time Chamber",
  gokugokuusdt_pool: "Kaioken x 15",
  gokugokuusdc_pool: "Great Ape Goku",
  gokugokuycrv_pool: "Family Kamehameha!!",
  gokukassiarycrv_pool: "Mr Satan’s Super Gorgeous Hotel",
  gokukassiahycrv_pool: "Kame House",
  gokuwbtceth_pool: "Cell Games",
  gokuweth_pool: "Weighted Training",
  gokuyfiieth_pool: "Chibi Goten",
  gokuyfieth_pool: "Sparring with Gohan",
  gokupyloneth_pool: "Shenron’s Domain",
  gokuswerveth_pool: "Nimbus Cloud",
  gokusolariteeth_pool: "Namek’s Three Suns",
  gokubasedsusd_pool: "Goku’s Power Pole",
  gokusnxeth_pool: "Snake Way",
  gokulinketh_pool: "Potara Eearings",
  gokudaieth_pool: "King Kai’s Planet",
  gokuusdceth_pool: "Go Even Beyond",
  gokuusdteth_pool: "Universe 7",
};

const ICON_FOR_POOL_GOKU: { [key: string]: string } = {
  gokugokueth_pool: "Goku Hyperbolic Time Chamber",
  gokugokuusdt_pool: "Kaioken",
  gokugokuusdc_pool: "Great Ape Goku",
  gokugokuycrv_pool: "goku Family Kamehameha",
  gokukassiarycrv_pool: "Mr Satan’s Super Gorgeous Hotel",
  gokukassiahycrv_pool: "Kame House",
  gokuwbtceth_pool: "Cell Games",
  gokuweth_pool: "Weighted Training",
  gokuyfiieth_pool: "Chibi Goten",
  gokuyfieth_pool: "Sparring with Gohan",
  gokupyloneth_pool: "Shenron",
  gokuswerveth_pool: "Nimbus Cloud",
  gokusolariteeth_pool: "Namek Three Suns",
  gokubasedsusd_pool: "Power Pole",
  gokusnxeth_pool: "Snake Way",
  gokulinketh_pool: "Fusion Earrings",
  gokudaieth_pool: "King Kai",
  gokuusdceth_pool: "Go Even Beyond",
  gokuusdteth_pool: "Universe 7",
};

const TOKENNAME_FOR_POOL_GOKU: { [key: string]: string } = {
  gokugokueth_pool: "GOKU/ETH LP",
  gokugokuusdt_pool: "GOKU/USDT LP",
  gokugokuusdc_pool: "GOKU/USDC LP",
  gokugokuycrv_pool: "GOKU/yCRV LP",
  gokukassiarycrv_pool: "KASSIAHOTEL/YCRV LP",
  gokukassiahycrv_pool: "KASSIAHOME/YCRV LP",
  gokuwbtceth_pool: "wBTC/ETH LP",
  gokuweth_pool: "wETH",
  gokuyfiieth_pool: "YFII-ETH LP",
  gokuyfieth_pool: "YFI-ETH LP",
  gokupyloneth_pool: "PYLON/ETH LP",
  gokuswerveth_pool: "SWERV/ETH LP",
  gokusolariteeth_pool: "SOLARITE/ETH LP",
  gokubasedsusd_pool: "BASED/sUSD LP",
  gokusnxeth_pool: "SNX/ETH LP",
  gokulinketh_pool: "LINK/ETH LP",
  gokudaieth_pool: "DAI/ETH LP",
  gokuusdceth_pool: "USDC/ETH LP",
  gokuusdteth_pool: "USDT/ETH LP",
};

const NAME_FOR_POOL_VEGETA: { [key: string]: string } = {
  vegetavegetaeth_pool: "Hyperbolic Time Chamber",
  vegetavegetausdt_pool: "Prince of all Saiyans",
  vegetavegetausdc_pool: "Gravity Chamber",
  vegetaethcomp_pool: "Fight me Kakarot!",
  vegetalendeth_pool: "Thats my Bulma!!",
  vegetasnxeth_pool: "Snake Way",
  vegetalinketh_pool: "GaLINK Gun",
  vegetadaieth_pool: "Final Flash",
  vegetausdceth_pool: "Majin Vegeta",
  vegetausdteth_pool: "Frieza Corps",
  vegetasushieth_pool: "Chibi Trunks",
  vegetayfieth_pool: "Future Trunks",
};

const ICON_FOR_POOL_VEGETA: { [key: string]: string } = {
  vegetavegetaeth_pool: "Vegeta Hyperbolic Time Chamber",
  vegetavegetausdt_pool: "Prince of all Saiyans",
  vegetavegetausdc_pool: "Gravity Chamber",
  vegetaethcomp_pool: "Fight me Kakarot",
  vegetalendeth_pool: "Thats my Bulma",
  vegetasnxeth_pool: "Snake Way",
  vegetalinketh_pool: "Galick Gun",
  vegetadaieth_pool: "Final Flash",
  vegetausdceth_pool: "Majin Vegeta",
  vegetausdteth_pool: "Frieza",
  vegetasushieth_pool: "Chibi Trunks",
  vegetayfieth_pool: "Future Trunks",
};

const TOKENNAME_FOR_POOL_VEGETA: { [key: string]: string } = {
  vegetavegetaeth_pool: "VEGETA/ETH LP",
  vegetavegetausdt_pool: "VEGETA/USDT LP",
  vegetavegetausdc_pool: "VEGETA/USDC LP",
  vegetaethcomp_pool: "ETH/COMP LP",
  vegetalendeth_pool: "LEND/ETH LP",
  vegetasnxeth_pool: "SNX/ETH LP",
  vegetalinketh_pool: "LINK/ETH LP",
  vegetadaieth_pool: "DAI/ETH LP",
  vegetausdceth_pool: "USDC/ETH LP",
  vegetausdteth_pool: "USDT/ETH LP",
  vegetasushieth_pool: "SUSHI/ETH LP",
  vegetayfieth_pool: "YFI/ETH LP",
}
// const SORT_FOR_POOL: { [key: string]: number } = {
//   yfi_pool: 0,
//   eth_pool: 1,
//   ampl_pool: 2,
//   comp_pool: 3,
//   ycrv_pool: 4,
//   link_pool: 5,
//   lend_pool: 6,
//   snx_pool: 7,
//   mkr_pool: 8,
// }

// const SORT_FOR_POOL: { [key: string]: number } = {
//   eth_pool: 6,
//   comp_pool: 2,
//   link_pool: 3,
//   lend_pool: 1,
//   snx_pool: 4,
//   btc_pool: 5,
// }

const Farms: React.FC = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const { dragonballz, tokenType } = useDragonballz();
  const [boost, setBoost] = useState('');

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract } = await getPoolContracts(dragonballz);
    const farmsArr: Farm[] = [];
    const poolKeys = Object.keys(pools);

    let methods:any = {
      gokugokueth: 'goku_eth_uni_lp',
      gokugokuusdt: 'goku_usdt_uni_lp',
      gokugokuusdc: 'goku_usdc_uni_lp',
      gokugokuycrv: 'goku_ycrv_uni_lp',
      gokukassiarycrv: 'kasr_ycrv_uni_lp',
      gokukassiahycrv: 'kash_ycrv_uni_lp',
      gokuwbtceth: 'wbtc_eth_uni_lp',
      gokuweth: 'weth',
      gokuyfiieth: 'yfii_eth_uni_lp',
      gokuyfieth: 'yfi_eth_uni_lp',
      gokupyloneth: 'pylon_eth_uni_lp',
      gokuswerveth: 'swrv_eth_uni_lp',
      gokusolariteeth: 'solarite_eth_uni_lp',
      gokubasedsusd: 'based_susd_uni_lp',
      gokusnxeth: 'snx_eth_uni_lp',
      gokulinketh: 'link_eth_uni_lp',
      gokudaieth: 'dai_eth_uni_lp',
      gokuusdceth: 'usdc_eth_uni_lp',
      gokuusdteth: 'usdt_eth_uni_lp',
      vegetavegetaeth: 'vegeta_eth_sushi_lp',
      vegetavegetausdt: 'vegeta_usdt_sushi_lp',
      vegetavegetausdc: 'vegeta_usdc_sushi_lp',
      vegetaethcomp: 'eth_comp_sushi_lp',
      vegetalendeth: 'lend_eth_sushi_lp',
      vegetasnxeth: 'snx_eth_sushi_lp',
      vegetalinketh: 'link_eth_sushi_lp',
      vegetadaieth: 'dai_eth_sushi_lp',
      vegetausdceth: 'usdc_eth_sushi_lp',
      vegetausdteth: 'usdt_eth_sushi_lp',
      vegetasushieth: 'sushi_eth_sushi_lp',
      vegetayfieth: 'yfi_eth_sushi_lp',
    };
    
    setFarms([]);
    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i];
      const pool = pools[poolKey];

      // console.log(poolKey);
      // console.log("pool", pool);
      let tokenKeySuff = poolKey.replace("_pool", "");
      let tokenKey = methods[tokenKeySuff];

      // console.log(tokenKey);

      const method = pool.methods[tokenKey];
      console.log(method);
      if (method) {
        try {
          let tokenAddress = "";
          if (tokenKey === "uni_lp") {
            // checking need to update with new uni_lp for dragonballz
            tokenAddress = "0xEaC70A956602990947679770D5ce1446641daf4F";
          } else {
            tokenAddress = await method().call();
          }

          farmsArr.push({
            contract: pool,
            name: tokenType === "goku" ? NAME_FOR_POOL_GOKU[poolKey] : NAME_FOR_POOL_VEGETA[poolKey],
            depositToken: tokenKey,
            depositTokenAddress: tokenAddress,
            depositTokenName: tokenType === "goku" ? TOKENNAME_FOR_POOL_GOKU[poolKey] : TOKENNAME_FOR_POOL_VEGETA[poolKey],
            earnToken: tokenType,
            earnTokenAddress: tokenType === "goku" ? gokuAddress : vegetaAddress,
            icon: tokenType === "goku" ? ICON_FOR_POOL_GOKU[poolKey] : ICON_FOR_POOL_VEGETA[poolKey],
            id: tokenKey,
          });


        } catch (e) {
          console.log("==================================", e)
          // console.log(e);
        }
      }
    }
    setFarms(farmsArr);
  }, [dragonballz, setFarms]);

  useEffect(() => {
    if (dragonballz) {
      fetchPools();
    }
  }, [dragonballz, fetchPools]);

  return <Context.Provider value={{ farms, boost, setBoost }}>{children}</Context.Provider>;
};

export default Farms;
