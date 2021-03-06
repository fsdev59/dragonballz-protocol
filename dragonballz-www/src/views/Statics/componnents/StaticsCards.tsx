import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import Web3 from "web3";
import useDragonballz from "../../../hooks/useDragonballz";

import Card from "../../../components/Card";
import CardContent from "../../../components/CardContent";
import Loader from "../../../components/Loader";
import useFarms from "../../../hooks/useFarms";
import { Farm } from "../../../contexts/Farms";
import { getPoolStartTime } from "../../../dragonballzUtils";
import { getDisplayBalance } from "../../../utils/formatBalance";
import { getStats } from "../../../views/Home/utils";
import { OverviewData } from "../../../views/Home/types";
import { Dragonballz } from "../../../dragonballz";
import BigNumber from "bignumber.js";
export interface DragonballzContext {
  dragonballz?: typeof Dragonballz;
}

const ADDRESS = "0x4CC84b41ECECC387244512242Eec226Eb7948A92";
let currentPrice = 0;
let dragonballz: any;

const FarmCards: React.FC = () => {
  const [farms] = useFarms();
  dragonballz = useDragonballz().dragonballz;
  const [
    { circSupply, curPrice, nextRebase, targetPrice, totalSupply },
    setStats,
  ] = useState<OverviewData>({});

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(dragonballz);
    setStats(statsData);
    currentPrice = parseFloat(
      getDisplayBalance(new BigNumber(statsData.curPrice))
    );
  }, [dragonballz, setStats]);

  useEffect(() => {
    if (dragonballz) {
      fetchStats();
    }
  }, [dragonballz]);

  const priceBlock = () => {
    return <TitleView>Current price: ${currentPrice}</TitleView>;
  };

  if (!loaded) {
    loaded = true;
  }

  return (
    <div>
      {/* {currentPrice ? priceBlock() : ""} */}
      <StyledCards>
        {farms.length ? (
          farms.map((farm, i) => (
            <React.Fragment key={i}>
              <StaticsCard farm={farm} price={currentPrice} />
            </React.Fragment>
          ))
        ) : (
          <StyledLoadingWrapper>
            <Loader text="Loading farms" />
          </StyledLoadingWrapper>
        )}
      </StyledCards>
    </div>
  );
};

interface StaticsCardProps {
  farm: Farm;
  price: number;
}
let loaded = false;

const StaticsCard: React.FC<StaticsCardProps> = ({ farm, price }) => {
  const [data, setData] = useState(null);

  // price = 5000;

  const getData = useCallback(async () => {
    const selfAddress = dragonballz.web3.currentProvider.selectedAddress;
    const token = farm.depositToken;
    let ah: any = {
      //weth: "eth_pool",
      uni_lp: "ycrvUNIV_pool",
      //wbtc: "btc_pool",
      //link: "yalink_pool",
      dragonballz_pylon_uni_lp: "pylonlp_pool",
      ycrv_pylon_uni_lp: "ycrvpylonlp_pool",
      pyloneth: "pyloneth_pool",
    };
    let key = ah[token] || `${token}_pool`;
    console.log("Key", key);
    const STAKING_POOL = dragonballz.contracts[key];
    console.log("ST", STAKING_POOL);
    console.log(token);
    const Token =
      token === "uni_lp"
        ? dragonballz.contracts["ycrvUNIV"]
        : (token === "dragonballz_pylon_uni_lp" ? dragonballz.contracts["pylonlp"]
        : (token === "ycrv_pylon_uni_lp" ? dragonballz.contracts["ycrvpylonlp"]
        : (token === "pyloneth" ? dragonballz.contracts["pyloneth"]
        : dragonballz.contracts[token])));
    const DRAGONBALLZ_TOKEN = dragonballz.contracts.dragonballz;

    const rewardTokenTicker = "DRAGONBALLZ";
    const stakingTokenTicker = token;
    const dragonballzScale =
      (await DRAGONBALLZ_TOKEN.methods.dragonballzsScalingFactor().call()) / 1e18;
    const rewardPoolAddr = STAKING_POOL._address;
    const amount =
      (await STAKING_POOL.methods.balanceOf(selfAddress).call()) / 1e18;
    const earned =
      (dragonballzScale * (await STAKING_POOL.methods.earned(selfAddress).call())) /
      1e18;

    const totalSupply = (await Token.methods.totalSupply().call()) / 1e18;

    const totalStakedAmount =
      (await Token.methods.balanceOf(rewardPoolAddr).call()) / 1e18;

    const weekly_reward =
      (Math.round((await STAKING_POOL.methods.rewardRate().call()) * 604800) *
        dragonballzScale) /
      1e18;

    const rewardPerToken = weekly_reward / totalStakedAmount;

    let hash: any = {
      yfi: ["yearn-finance"],
      yfii: ["yfii-finance"],
      crv: ["curve-dao-token"],
      weth: ["ethereum"],
      link: ["chainlink"],
      mkr: ["maker"],
      comp: ["compound-governance-token"],
      snx: ["havven"],
      lend: ["ethlend"],
      uni_lp: ["curve-fi-ydai-yusdc-yusdt-ytusd"],
      wbtc: ["wrapped-bitcoin"],
      dragonballz: ["dragonballz"],
      based: ["based-money"],
      eth_pylon_uni_lp: ["pylon-finance"],
      ewtb: ["energy-web-token"],
      pylon: ["pylon-finance"],
      ycrv_pylon_uni_lp: ["curve-fi-ydai-yusdc-yusdt-ytusd"],
      dragonballz_pylon_uni_lp: ["pylon-finance"], 
      zombie: ["zombie-finance"],
      solarite: ["solarite"],
      rari: ["rarible"],
      pyloneth: ["pylon-finance"],
      usdc: ["usd-coin"],
      usdt: ["tether"],
      yalink: ["chainlink"],
    };
    let stakingTokenPrice = 1;

    if (Object.keys(hash).includes(token)) {
      let d = await lookUpPrices(hash[token]);
      let data: any = Object.values(d[0] || d)[0];
      data = data.usd || data;
      console.log(data);
      stakingTokenPrice = parseFloat(data.toString());
      // if(token == 'yfi') debugger;

      // temparary commented
      // let da = await lookUpPrices(hash["dragonballz"]);
      // console.log(da);
      // let dataA: any = Object.values(da[0] || da)[0];
      // console.log (dataA);
      // dataA = data.usd || dataA;

      // price = parseFloat(dataA.usd.toString());
      // console.log(token, '-', price);
      price = 10;

      if (token === "pyloneth") {
        // need to update this url after uni_lp pool deployed
        const UNI_TOKEN_ADDR = "0xbe9ba93515e87c7bd3a0cebb9f61aaabe7a77dd3";
        const totalyCRVInUniswapPair =
          (await dragonballz.contracts["pylon"].methods
            .balanceOf(UNI_TOKEN_ADDR)
            .call()) / 1e18;
        const totalDRAGONBALLZInUniswapPair =
          (await DRAGONBALLZ_TOKEN.methods.balanceOf(UNI_TOKEN_ADDR).call()) / 1e18;
        let yCRVPrice = stakingTokenPrice;
        const totalSupplyOfStakingToken =
          (await dragonballz.contracts["pyloneth"].methods.totalSupply().call()) /
          1e18;
        stakingTokenPrice =
          (yCRVPrice * totalyCRVInUniswapPair +
            price * totalDRAGONBALLZInUniswapPair) /
          totalSupplyOfStakingToken;
        console.log(yCRVPrice, '-', totalyCRVInUniswapPair, '-', totalDRAGONBALLZInUniswapPair, '-', totalSupplyOfStakingToken);
        console.log(stakingTokenPrice);
      }

      if (token === "uni_lp") {
        // need to update this url after uni_lp pool deployed
        const UNI_TOKEN_ADDR = "0xEaC70A956602990947679770D5ce1446641daf4F";
        const totalyCRVInUniswapPair =
          (await dragonballz.contracts["ycrv"].methods
            .balanceOf(UNI_TOKEN_ADDR)
            .call()) / 1e18;
        const totalDRAGONBALLZInUniswapPair =
          (await DRAGONBALLZ_TOKEN.methods.balanceOf(UNI_TOKEN_ADDR).call()) / 1e18;
        let yCRVPrice = stakingTokenPrice;
        const totalSupplyOfStakingToken =
          (await dragonballz.contracts["ycrvUNIV"].methods.totalSupply().call()) /
          1e18;
        stakingTokenPrice =
          (yCRVPrice * totalyCRVInUniswapPair +
            price * totalDRAGONBALLZInUniswapPair) /
          totalSupplyOfStakingToken;
        
          console.log(yCRVPrice, '-', totalyCRVInUniswapPair, '-', totalDRAGONBALLZInUniswapPair, '-', totalSupplyOfStakingToken);
          console.log(stakingTokenPrice);
      }
    }

    let weeklyEstimate =
      (token === "wbtc")
        ? rewardPerToken * amount * 10000000000
        : ((token === "usdc" || token === "usdt")?rewardPerToken * amount * 1000000000000:rewardPerToken * amount);
    let weeklyROI = (rewardPerToken * price * 100) / stakingTokenPrice;


    setData({
      token,
      weekly_reward,
      amount,
      totalSupply,
      totalStakedAmount,
      earned,
      price,
      stakingTokenPrice,
      weeklyEstimate,
      stakingTokenTicker,
      rewardTokenTicker,
      weeklyROI,
    });
  }, [farm, setData]);

  useEffect(() => {
    getData();
  }, [farm, getData]);

  const DataDetail = (data: any) => {
    const {
      totalSupply,
      totalStakedAmount,
      weekly_reward,
      amount,
      earned,
      weeklyEstimate,
      rewardTokenTicker,
      stakingTokenTicker,
      stakingTokenPrice,
      price,
      weeklyROI,
    } = data;
    //const {totalSupply, totalStakedAmount, weekly_reward, amount, earned, weeklyEstimate, rewardTokenTicker, stakingTokenTicker, stakingTokenPrice, weeklyROI} = data
    // debugger
    //const price = 5000;

    return (
      <div>
        <StyledPre>
          ========== PRICES ==========
          <br />1 {rewardTokenTicker} = {price}$<br />1 {stakingTokenTicker==="uni_lp"?"dragonballz/ycrv":stakingTokenTicker} ={" "}
          {stakingTokenPrice}$<br />
          <br />
          ========== STAKING =========
          <br />
          There are total :{" "}
          {(stakingTokenTicker === "wbtc")
            ? totalSupply * 10000000000
            : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?totalSupply * 1000000000000:totalSupply)}{" "}
          {stakingTokenTicker==="uni_lp"?"dragonballz/ycrv":stakingTokenTicker}.<br />
          There are total :{" "}
          {(stakingTokenTicker === "wbtc")
            ? totalStakedAmount * 10000000000
            : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?totalStakedAmount * 1000000000000:totalStakedAmount)}{" "}
          {stakingTokenTicker==="uni_lp"?"dragonballz/ycrv":stakingTokenTicker} staked in {rewardTokenTicker}'s{" "}
          {stakingTokenTicker==="uni_lp"?"dragonballz/ycrv":stakingTokenTicker} staking pool.
          <br />={" "}
          <span className="total">
            {(stakingTokenTicker === "wbtc")
              ? toDollar(totalStakedAmount * 10000000000 * stakingTokenPrice)
              : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?toDollar(totalStakedAmount * 1000000000000 * stakingTokenPrice):toDollar(totalStakedAmount * stakingTokenPrice))}
          </span>
          <br />
          You are staking :{" "}
          {(stakingTokenTicker === "wbtc") ? amount * 10000000000 : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?amount * 1000000000000:amount)}{" "}
          {stakingTokenTicker==="uni_lp"?"dragonballz/ycrv":stakingTokenTicker} ({toFixed((amount * 100) / totalStakedAmount, 3)}
          % of the pool)
          <br />={" "}
          {toDollar(
            ((stakingTokenTicker === "wbtc") ? amount * 10000000000 : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?amount * 1000000000000:amount)) *
              stakingTokenPrice
          )}
          <br />
          <br />
          ======== {rewardTokenTicker} REWARDS ========
          <br />
          Claimable Rewards : {toFixed(earned, 4)} {rewardTokenTicker} = $
          {toFixed(earned * price, 2)}
          <br />
          Hourly estimate : {toFixed(weeklyEstimate / (24 * 7), 4)}{" "}
          {rewardTokenTicker} = {toDollar((weeklyEstimate / (24 * 7)) * price)}{" "}
          <br />
          Daily estimate : {toFixed(weeklyEstimate / 7, 2)} {rewardTokenTicker}{" "}
          = {toDollar((weeklyEstimate / 7) * price)} <br />
          Weekly estimate : {toFixed(weeklyEstimate, 2)} {rewardTokenTicker} ={" "}
          {toDollar(weeklyEstimate * price)} <br />
          Hourly ROI in USD :{" "}
          {toFixed(
            ((stakingTokenTicker === "wbtc")
              ? weeklyROI / 10000000000
              : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?weeklyROI / 1000000000000:weeklyROI)) /
              7 /
              24,
            4
          )}
          %<br />
          Daily ROI in USD :{" "}
          {toFixed(
            ((stakingTokenTicker === "wbtc")
              ? weeklyROI / 10000000000
              : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?weeklyROI / 1000000000000:weeklyROI)) / 7,
            4
          )}
          %<br />
          Weekly ROI in USD :{" "}
          {toFixed(
            (stakingTokenTicker === "wbtc") ? weeklyROI / 10000000000 : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?weeklyROI / 1000000000000:weeklyROI),
            4
          )}
          %<br />
          APY (unstable) :{" "}
          {toFixed(
            ((stakingTokenTicker === "wbtc")
              ? weeklyROI / 10000000000
              : ((stakingTokenTicker === "usdc" || stakingTokenTicker === "usdt")?weeklyROI / 1000000000000:weeklyROI)) * 52,
            4
          )}
          %<br />
        </StyledPre>
      </div>
    );
  };

  return (
    
    <StyledCardWrapper>
      {farm.id === 'uni_lp' && (
        <StyledCardAccent />
      )}
      {/* {<StyledCardAccent />} */}
      <Card>
        <CardContent>
          <StyledContent>
            <StyledTitle>{farm.name}</StyledTitle>
            <StyledDetails>
              {data ? DataDetail(data) : "Loading..."}
            </StyledDetails>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const StyledCardAccent = styled.div`
  // background: linear-gradient(
  //   45deg,
  //   rgba(255, 0, 0, 1) 0%,
  //   rgba(255, 154, 0, 1) 10%,
  //   rgba(208, 222, 33, 1) 20%,
  //   rgba(79, 220, 74, 1) 30%,
  //   rgba(63, 218, 216, 1) 40%,
  //   rgba(47, 201, 226, 1) 50%,
  //   rgba(28, 127, 238, 1) 60%,
  //   rgba(95, 21, 242, 1) 70%,
  //   rgba(186, 12, 248, 1) 80%,
  //   rgba(251, 7, 217, 1) 90%,
  //   rgba(255, 0, 0, 1) 100%
  // );
  box-shadow: 0px 0px 6px 15px #ff6b15;
  border-radius: 12px;
  // filter: blur(4px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  // z-index: 1;
`;
const StyledPre = styled.pre`
  @media (max-width: 768px) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  color: white;
`;

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 960px) {
    width: 90%;
    margin: auto;
  }
`;

const StyledLoadingWrapper = styled.div`
  
  align-items: center;
  justify-content: center;
  color: white;
`;

const StyledRow = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  width: 100%;
  position: relative;
  display: inline-block;
  margin: 15px 0;
`;

const StyledTitle = styled.h4`
  // color: ${(props) => props.theme.color.grey[600]};
  color: #f6f5fa;
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`;

const StyledContent = styled.div`
  align-items: center;
`;

const TitleView = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  @media (max-width: 960px) {
    width: 90%;
    margin: auto;
  }
`;
const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledDetails = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}px;
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: left;
`;

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`;
const StyledDetailView = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
  display: flex;
  flex: 1;
`;
const StyledDetailSpan = styled.div`
  text-align: right;
  width: 200px;
  padding-right: 10px;
  display: inline-block;
`;

const toFixed = function (num: any, fixed: any) {
  return num.toFixed(fixed);
};
const toDollar = (str: any) => {
  return `$${str}`;
};

const lookUpPrices = async function (id_array: any) {
  let ids = id_array.join("%2C");
  let res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
      ids +
      "&vs_currencies=usd"
  );
  return res.json();
};

export default FarmCards;
