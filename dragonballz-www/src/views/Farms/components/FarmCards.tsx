import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { CSSTransition } from 'react-transition-group';

import Button from "../../../components/Button";
import Card from "../../../components/Card";
import CardContent from "../../../components/CardContent";
import CardIcon from "../../../components/CardIcon";
import Loader from "../../../components/Loader";

import useFarms from "../../../hooks/useFarms";

import { Farm } from "../../../contexts/Farms";

import { getPoolStartTime } from "../../../dragonballzUtils";

import farmer from "../../../assets/img/saiyan.png";
import useDragonballz from "../../../hooks/useDragonballz";

type Func = () => void

const FarmCards: React.FC = () => {
  const [farms] = useFarms();

  const [showTransition, setShowTransition] = useState(false);

  const rows = farms.reduce<Farm[][]>(
    (farmRows, farm) => {
      const newFarmRows = [...farmRows];
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farm]);
      } else {
        newFarmRows[newFarmRows.length - 1].push(farm);
      }
      return newFarmRows;
    },
    [[]]
  );

  useEffect(() => {
    if (!!rows[0].length) {
      setShowTransition(true);
    }
  }, [rows[0].length]);

  return (
    <StyledCards>
      {!!rows[0].length ?
        <CSSTransition
          in={showTransition}
          timeout={500}
          classNames="farmcards"
          unmountOnExit
        >
          <div>
            {rows.map((farmRow, i) => (
              <StyledRow key={`farm-row-${i}`}>
                {farmRow.map((farm, j) => (
                  <React.Fragment key={`farm-item-${i * farmRow.length + j}`}>
                    <FarmCard farm={farm} />
                    {(j === 0 || j === 1) && <StyledSpacer />}
                  </React.Fragment>
                ))}
              </StyledRow>
            ))}
          </div>
        </CSSTransition>
        :
        <StyledLoadingWrapper>
          <Loader text="Loading farms" />
        </StyledLoadingWrapper>
      }
    </StyledCards>
  );
};

interface FarmCardProps {
  farm: Farm;
}

let dragonballz: any;

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0);
  const [data, setData] = useState(null);

  const { tokenType } = useDragonballz();
  dragonballz = useDragonballz().dragonballz;
  const videoRef = useRef<HTMLVideoElement>();

  const getStartTime = useCallback(async () => {
    //const startTime = await getPoolStartTime(farm.contract);
    const startTime = 1601683200;
    setStartTime(startTime);
  }, [farm, setStartTime]);

  const getData = useCallback(async () => {
    const selfAddress = dragonballz.web3.currentProvider.selectedAddress;
    const token = farm.depositToken;
    console.log(token);
    let ah_vegeta: any = {
      vegeta_eth_sushi_lp: 'vegetavegetaeth_pool',
      vegeta_usdt_sushi_lp: 'vegetavegetausdt_pool',
      vegeta_usdc_sushi_lp: 'vegetavegetausdc_pool',
      eth_comp_sushi_lp: 'vegetaethcomp_pool',
      lend_eth_sushi_lp: 'vegetalendeth_pool',
      snx_eth_sushi_lp: 'vegetasnxeth_pool',
      link_eth_sushi_lp: 'vegetalinketh_pool',
      dai_eth_sushi_lp: 'vegetadaieth_pool',
      usdc_eth_sushi_lp: 'vegetausdceth_pool',
      usdt_eth_sushi_lp: 'vegetausdteth_pool',
      sushi_eth_sushi_lp: 'vegetasushieth_pool',
      yfi_eth_sushi_lp: 'vegetayfieth_pool',
    };
    let ah_goku: any = {
      //weth: "eth_pool",
      // uni_lp: "ycrvUNIV_pool",
      //wbtc: "btc_pool",
      //link: "yalink_pool",
      // dragonballz_pylon_uni_lp: "pylonlp_pool",
      // ycrv_pylon_uni_lp: "ycrvpylonlp_pool",
      // pyloneth: "pyloneth_pool",
      goku_eth_uni_lp: 'gokugokueth_pool',
      goku_usdt_uni_lp: 'gokugokuusdt_pool',
      goku_usdc_uni_lp: 'gokugokuusdc_pool',
      goku_ycrv_uni_lp: 'gokugokuycrv_pool',
      kasr_ycrv_uni_lp: 'gokukassiarycrv_pool',
      kash_ycrv_uni_lp: 'gokukassiahycrv_pool',
      wbtc_eth_uni_lp: 'gokuwbtceth_pool',
      weth: 'gokuweth_pool',
      yfii_eth_uni_lp: 'gokuyfiieth_pool',
      yfi_eth_uni_lp: 'gokuyfieth_pool',
      pylon_eth_uni_lp: 'gokupyloneth_pool',
      swrv_eth_uni_lp: 'gokuswerveth_pool',
      solarite_eth_uni_lp: 'gokusolariteeth_pool',
      based_susd_uni_lp: 'gokubasedsusd_pool',
      snx_eth_uni_lp: 'gokusnxeth_pool',
      link_eth_uni_lp: 'gokulinketh_pool',
      dai_eth_uni_lp: 'gokudaieth_pool',
      usdc_eth_uni_lp: 'gokuusdceth_pool',
      usdt_eth_uni_lp: 'gokuusdteth_pool',
    };
    let key = farm.earnToken=="goku"?ah_goku[token]:ah_vegeta[token];

    console.log("==========Key, token:", key, token);
    console.log(dragonballz.contracts);
    const STAKING_POOL = dragonballz.contracts[key];

    let tokenKey = key.replace("_pool", "");
    // let tokenKey = methods[tokenKeySuff];

    // const Token =
    //   token === "uni_lp"
    //     ? dragonballz.contracts["ycrvUNIV"]
    //     : (token === "dragonballz_pylon_uni_lp" ? dragonballz.contracts["pylonlp"]
    //       : (token === "ycrv_pylon_uni_lp" ? dragonballz.contracts["ycrvpylonlp"]
    //         : (token === "pyloneth" ? dragonballz.contracts["pyloneth"]
    //           : dragonballz.contracts[token])));
    const Token = dragonballz.contracts[tokenKey];
    console.log("==========STPOOL, TOKEN:", STAKING_POOL, Token);

    console.log(dragonballz.contracts);
    
    const DRAGONBALLZ_TOKEN = Object.keys(dragonballz.contracts).includes("goku")?dragonballz.contracts.goku:dragonballz.contracts.vegeta;
    console.log(DRAGONBALLZ_TOKEN);

    const rewardTokenTicker = "DRAGONBALLZ";
    const stakingTokenTicker = token;
    const dragonballzScale =
      Object.keys(dragonballz.contracts).includes("goku") ? ((await DRAGONBALLZ_TOKEN.methods.gokusScalingFactor().call()) / 1e18) : ((await DRAGONBALLZ_TOKEN.methods.vegetasScalingFactor().call()) / 1e18);
      
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

    let price = 10;
    if (Object.keys(hash).includes(token)) {
      console.log("!!!!!!!!!!!!!!!!!!!!")
      let d = await lookUpPrices(hash[token]);
      let data: any = Object.values(d[0] || d)[0];
      data = data.usd || data;
      console.log(data);
      stakingTokenPrice = parseFloat(data.toString());

      // if (token === "pyloneth") {
      //   // need to update this url after uni_lp pool deployed
      //   const UNI_TOKEN_ADDR = "0xbe9ba93515e87c7bd3a0cebb9f61aaabe7a77dd3";
      //   const totalyCRVInUniswapPair =
      //     (await dragonballz.contracts["pylon"].methods
      //       .balanceOf(UNI_TOKEN_ADDR)
      //       .call()) / 1e18;
      //   const totalDRAGONBALLZInUniswapPair =
      //     (await DRAGONBALLZ_TOKEN.methods.balanceOf(UNI_TOKEN_ADDR).call()) / 1e18;
      //   let yCRVPrice = stakingTokenPrice;
      //   const totalSupplyOfStakingToken =
      //     (await dragonballz.contracts["pyloneth"].methods.totalSupply().call()) /
      //     1e18;
      //   stakingTokenPrice =
      //     (yCRVPrice * totalyCRVInUniswapPair +
      //       price * totalDRAGONBALLZInUniswapPair) /
      //     totalSupplyOfStakingToken;
      //   console.log(yCRVPrice, '-', totalyCRVInUniswapPair, '-', totalDRAGONBALLZInUniswapPair, '-', totalSupplyOfStakingToken);
      //   console.log(stakingTokenPrice);
      // }

      // if (token === "uni_lp") {
      //   // need to update this url after uni_lp pool deployed
      //   const UNI_TOKEN_ADDR = "0xEaC70A956602990947679770D5ce1446641daf4F";
      //   const totalyCRVInUniswapPair =
      //     (await dragonballz.contracts["ycrv"].methods
      //       .balanceOf(UNI_TOKEN_ADDR)
      //       .call()) / 1e18;
      //   const totalDRAGONBALLZInUniswapPair =
      //     (await DRAGONBALLZ_TOKEN.methods.balanceOf(UNI_TOKEN_ADDR).call()) / 1e18;
      //   let yCRVPrice = stakingTokenPrice;
      //   const totalSupplyOfStakingToken =
      //     (await dragonballz.contracts["ycrvUNIV"].methods.totalSupply().call()) /
      //     1e18;
      //   stakingTokenPrice =
      //     (yCRVPrice * totalyCRVInUniswapPair +
      //       price * totalDRAGONBALLZInUniswapPair) /
      //     totalSupplyOfStakingToken;

      //   console.log(yCRVPrice, '-', totalyCRVInUniswapPair, '-', totalDRAGONBALLZInUniswapPair, '-', totalSupplyOfStakingToken);
      //   console.log(stakingTokenPrice);
      // }
    }

    let weeklyEstimate =
      (token === "wbtc")
        ? rewardPerToken * amount * 10000000000
        : ((token === "usdc" || token === "usdt") ? rewardPerToken * amount * 1000000000000 : rewardPerToken * amount);
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
  }, [farm, setData, dragonballz]);

  useEffect(() => {
    // getData();
  }, [farm, getData]);

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const paddedHours = hours < 10 ? `0${hours}` : hours;
    return (
      <span style={{ width: "100%" }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    );
  };
  useEffect(() => {
    // if (farm && farm.id === "uni_lp") {
    if (farm) {
      getStartTime();
      console.log(startTime);
    }
  }, [farm, getStartTime]);

  const poolActive = startTime * 1000 - Date.now() <= 0;

  let boost;
  if (farm.depositTokenName === 'VEGETA/ETH LP' || farm.depositTokenName === 'VEGETA/USDT LP' || farm.depositTokenName === 'VEGETA/USDC LP') {
    boost = "20x";
  } else if (farm.depositTokenName === 'LEND/ETH LP' || farm.depositTokenName === 'USDC/ETH LP') {
    boost = "5x";
  } else if (farm.depositTokenName === 'GOKU/ETH LP' || farm.depositTokenName === 'GOKU/USDT LP' || farm.depositTokenName === 'GOKU/USDC LP' || farm.depositTokenName === 'GOKU/yCRV LP') {
    boost = "15x";
  } else if (farm.depositTokenName === 'wBTC/ETH LP' || farm.depositTokenName === 'wETH') {
    boost = "2x";
  }

  return (
    <StyledCardWrapper>
      <CardContainer>
        <VideoBackground>
          <video id="background-video" height="100%" loop muted playsInline ref={videoRef}>
            <source src={require("../../../assets/videos/" + farm.icon + ".mp4")} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </VideoBackground>
        <CardBack
          onMouseOver={(e) => {
            videoRef.current.play()
          }}
          onMouseOut={(e) => {
            videoRef.current.pause()
          }}>
          {/* {farm.id === 'uni_lp' && ( */}
          {boost && <StyledCardAccent>
            <img src={farmer} height="30" />
            <SymbolText><span>{boost}</span></SymbolText>
          </StyledCardAccent>}
          {/* )} */}
          {/* {<StyledCardAccent />} */}
          <Card>
            <CardContent>
              <StyledContent>
                <CardIcon>
                  <img
                    src={require("../../../assets/videos/" + farm.icon + ".png")}
                    height="80px"
                    width="80px"
                    style={{ borderRadius: '40px' }}
                  />
                </CardIcon>
                <StyledTitle><h4>{farm.name}</h4></StyledTitle>
                <StyledDetails>
                  <StyledDetail>
                    Deposit{" "}
                    {farm.depositTokenName}
                  </StyledDetail>
                  {/* <StyledDetail>Earn {farm.earnToken.toUpperCase()}</StyledDetail> */}
                  <StyledDetail>Earn {tokenType.toUpperCase()}</StyledDetail>
                </StyledDetails>

                <Button
                  disabled={!poolActive}
                  text={poolActive ? 'Select' : undefined}
                  to={`farms/${farm.id}`}
                >
                  {!poolActive && <Countdown date={new Date(startTime * 1000)} renderer={renderer} />}
                </Button>
              </StyledContent>
              {/* <StatContent>
                <StatGroup>
                  <span style={{ fontSize: '14px', color: "grey" }}>Pool Total</span><br />
                  {!!data && ((data.stakingTokenTicker === "wbtc")
                    ? data.totalSupply * 10000000000
                    : ((data.stakingTokenTicker === "usdc" || data.stakingTokenTicker === "usdt") ? data.totalSupply * 1000000000000 : data.totalSupply))}
                </StatGroup>
                <StatGroup>
                  <span style={{ fontSize: '14px', color: "grey" }}>APY</span><br />
                  {!!data && toFixed(
                    ((data.stakingTokenTicker === "wbtc")
                      ? data.weeklyROI / 10000000000
                      : ((data.stakingTokenTicker === "usdc" || data.stakingTokenTicker === "usdt") ? data.weeklyROI / 1000000000000 : data.weeklyROI)) * 52,
                    4
                  )}%
                </StatGroup>
              </StatContent> */}
            </CardContent>
          </Card>
        </CardBack>
      </CardContainer>

    </StyledCardWrapper >
  );
};

const toFixed = function (num: any, fixed: any) {
  return num.toFixed(fixed);
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

const StyledCardAccent = styled.div`
  /* box-shadow: 0px 0px 6px 15px #ff6b15; */
  /* border-radius: 12px; */
  /* // filter: blur(4px); */
  /* position: absolute; */
  /* top: -2px; */
  /* right: -2px; */
  /* bottom: -2px; */
  /* left: -2px; */
  position: absolute;
  top: 3px;
  right: 3px;
`;

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  /* display: flex; */
  position: relative;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  height: 450px;
`;

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 15px;
  &:hover {
    box-shadow: 5px -5px 15px rgba(0,0,0, .3);
  }
`;

const CardFront = styled.div`
  width: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const CardBack = styled.div`
  width: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  /* backface-visibility: hidden;
  transform: rotateY(180deg);
  transform: rotateX(-180deg); */
  /* background: #E59982; */
  box-shadow: inset 0px -200px 350px #000;
  display: flex;
  align-items: center;
  border-radius: 15px;
`;

const StyledTitle = styled.div`
  display: table;
  h4 {
    text-align: center;
    color: #f6f5fa;
    font-size: 24px;
    font-weight: 700;
    margin: ${(props) => props.theme.spacing[2]}px 0 0;
    padding: 0;
    display: table-cell;
    vertical-align: middle;
  }
  flex: 1;
`;

const StyledContent = styled.div`
  height: 305px;
  align-items: center;
  display: flex;
  flex-direction: column;
  color: white;
  padding-bottom: 20px;
  border-bottom: 1px solid white;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDetails = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]}px;
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
  flex: 1;
`;

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`;

const VideoBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;  
  border-radius: 15px;
`;

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;

const StatGroup = styled.div`
  text-align: center;
  color: white;
`;

const SymbolText = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;

  span {
    font-size: 12px;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
`;

export default FarmCards;
