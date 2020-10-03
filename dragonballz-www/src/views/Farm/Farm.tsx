import React, { useMemo, useEffect, useState } from "react";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Countdown, { CountdownRenderProps } from "react-countdown";

import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import Spacer from "../../components/Spacer";

import useFarm from "../../hooks/useFarm";
import useRedeem from "../../hooks/useRedeem";
import { getContract } from "../../utils/erc20";
import useCurrentBoost from "../../hooks/useBoostCurrent";
import useBoostx2 from "../../hooks/useBoostx2";
import useBoostx4 from "../../hooks/useBoostx4";
import useBoostx8 from "../../hooks/useBoostx8";
import useBoostx10 from "../../hooks/useBoostx10";
// import useDragonballz from "../../hooks/useDragonballz";

import Harvest from "./components/Harvest";
import Stake from "./components/Stake";

const Farm: React.FC = () => {
  const { farmId } = useParams();

  // const { setTokenType, tokenType } = useDragonballz();
  const [curBoost, setCurBoost] = useState(0);

  const {
    contract,
    depositToken,
    depositTokenAddress,
    earnToken,
    name,
    icon,
  } = useFarm(farmId) || {
    depositToken: "",
    depositTokenAddress: "",
    earnToken: "",
    name: "",
    icon: "",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { ethereum } = useWallet();

  const tokenContract = useMemo(() => {
    return getContract(ethereum as provider, depositTokenAddress);
  }, [ethereum, depositTokenAddress]);

  console.log('tokencontract', tokenContract);
  console.log('contract', contract);

  const { onRedeem } = useRedeem(contract);
  const { onBoostCurrent } = useCurrentBoost(contract);
  const { onBoostx2 } = useBoostx2(contract);
  const { onBoostx4 } = useBoostx4(contract);
  const { onBoostx8 } = useBoostx8(contract);
  const { onBoostx10 } = useBoostx10(contract);

  const depositTokenName = useMemo(() => {
    return depositToken.toUpperCase();
  }, [depositToken]);

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase();
  }, [earnToken]);

  const countdownBlock = () => {
    const date = Date.parse("Sun Aug 23 2020 00:20:00 GMT+0800");
    if (Date.now() >= date) return "";
    return (
      <CountdownView>
        <Countdown date={date} />
      </CountdownView>
    );
  };

  const DragonballzNotify = (token: String) => {
    // if (token != "dragonballz")
    return "";
    // return (
    //   <DragonballzNotifyView>
    //     <p> Farm is good, but don't forget migration your DRAGONBALLZ before Migration Deadline. </p>
    //     <p>
    //       <a href='https://dragonballz.finance/'>https://dragonballz.finance/</a>
    //     </p>
    //     {countdownBlock()}
    //   </DragonballzNotifyView>
    // )
  };

  const lpPoolTips = (token: String) => {
    if (token != "uni_lp") return "";
    return (
      <DragonballzNotifyView>
        <p>
          If you want Add liquidity to Uniswap, please use this{" "}
          <a href="https://app.uniswap.org/#/add/0x4CC84b41ECECC387244512242Eec226Eb7948A92/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8">
            Uniswap link
          </a>
          .
        </p>
      </DragonballzNotifyView>
    );
  };

  useEffect(() => {
    onBoostCurrent().then(boost => setCurBoost(boost));
  }, [onBoostCurrent]);
  console.log("===================", curBoost);
  
  return (
    <>
      <PageHeader
        icon={icon}
        subtitle={`Deposit ${depositTokenName === "UNI_LP" ? "DRAGONBALLZ/YCRV" : depositTokenName} and earn ${earnTokenName}`}
        title={name}
      />
      <div><span style={{ color: "white", display: "flex", alignContent: "center", fontWeight: "bold", textAlign: "center", paddingLeft: "20px", paddingRight: "20px", border: "dotted" }}>Saiyan Rage activates immediately upon activation for a duration of 1 hour. You will not see it until you harvest, your reward will simply be multiplied by the Saiyan Rage amount. You must withdraw within the hour of the boost, if not the rage will expire and you will not get the benefit. You will get Multiplier amount for hourly earnings at time of harvest.</span></div>
      <ButtonGroup1>
        
        <span style={{ color: "white", fontWeight: "bold" }}>Use Saiyan Rage</span>
        <Button
          variant={earnToken === "goku" ? "primary" : "secondary"}
          isSelected={curBoost === 2}
          onClick={onBoostx2}
        >
          2<span style={{ fontSize: "10px" }}>x</span>
        </Button>
        <Button
          variant={earnToken === "goku" ? "primary" : "secondary"}
          isSelected={curBoost === 4}
          onClick={onBoostx4}
        >
          4<span style={{ fontSize: "10px" }}>x</span>
        </Button>
        <Button
          variant={earnToken === "goku" ? "primary" : "secondary"}
          isSelected={curBoost === 8}
          onClick={onBoostx8}
        >
          8<span style={{ fontSize: "10px" }}>x</span>
        </Button>
        <Button
          variant={earnToken === "goku" ? "primary" : "secondary"}
          isSelected={curBoost === 10}
          onClick={onBoostx10}
        >
          10<span style={{ fontSize: "10px" }}>x</span>
        </Button>
      </ButtonGroup1>
      {DragonballzNotify(depositToken)}
      <StyledFarm>
        {lpPoolTips(depositToken)}
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest poolContract={contract} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              poolContract={contract}
              tokenContract={tokenContract}
              tokenName={depositToken.toUpperCase()}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <ButtonGroup>
          <Button
            onClick={onRedeem}
            text="Harvest & Withdraw"
          // borderImage
          />
        </ButtonGroup>
        <Spacer size="lg" />
      </StyledFarm>
    </>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  button {
    width: 100%;
  }
`;

const Spacing = styled.div`
  height: 10px;
`;

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const CountdownView = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: rgb(209, 0, 75);
  margin-bottom: 20px;
`;

const DragonballzNotifyView = styled.div`
  text-align: center;
  color: #555;
`;

const ButtonGroup1 = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  // justify-content: space-between;
  justify-content: center;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
  }
  button {
    padding: 10px 10px;
  }
`;
export default Farm;
