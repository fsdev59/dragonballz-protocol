import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import Button from "../../components/Button";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
// import useBoost from "../../hooks/useBoost";
import useDragonballz from "../../hooks/useDragonballz";

import Farm from "../Farm";

import FarmCards from "./components/FarmCards";

const Farms: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const { setTokenType, tokenType } = useDragonballz();
  // const { boost, setBoost } = useBoost();

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              {/* <PageHeader
              icon={<img src={farmer} height="96" />}
              subtitle="Earn DRAGONBALLZ tokens by providing liquidity."
              title="Select a farm."
            /> */}
              <PageHeader
                icon=""
                subtitle={`Earn ${tokenType.toUpperCase()} tokens by providing liquidity.`}
                title="Select a farm."
                tab={
                  <div>
                    <SwitchTab>
                      <SwitchButton>
                        <Button
                          text="GOKU"
                          isSelected={tokenType === 'goku'}
                          onClick={() => { setTokenType('goku') }}
                          variant="primary"
                        />
                      </SwitchButton>
                      <SwitchButton>
                        <Button
                          text="VEGETA"
                          isSelected={tokenType === 'vegeta'}
                          onClick={() => { setTokenType('vegeta') }}
                          variant="secondary"
                        />
                      </SwitchButton>
                    </SwitchTab>
                    {/* <ButtonGroup>
                      <span style={{ color: "white", fontWeight: "bold" }}>Use Saiyan Rage</span>
                      <Button
                        variant={tokenType === "goku" ? "primary" : "secondary"}
                        isSelected={boost === '2x'}
                        onClick={() => setBoost(boost === '2x' ? '' : '2x')}
                      >
                        2<span style={{ fontSize: "10px" }}>x</span>
                      </Button>
                      <Button
                        variant={tokenType === "goku" ? "primary" : "secondary"}
                        isSelected={boost === '4x'}
                        onClick={() => setBoost(boost === '4x' ? '' : '4x')}
                      >
                        4<span style={{ fontSize: "10px" }}>x</span>
                      </Button>
                      <Button
                        variant={tokenType === "goku" ? "primary" : "secondary"}
                        isSelected={boost === '8x'}
                        onClick={() => setBoost(boost === '8x' ? '' : '8x')}
                      >
                        8<span style={{ fontSize: "10px" }}>x</span>
                      </Button>
                      <Button
                        variant={tokenType === "goku" ? "primary" : "secondary"}
                        isSelected={boost === '10x'}
                        onClick={() => setBoost(boost === '10x' ? '' : '10x')}
                      >
                        10<span style={{ fontSize: "10px" }}>x</span>
                      </Button>
                    </ButtonGroup> */}
                  </div>

                }
              />
              <FarmContainer>
                <ImageWrapper>
                  <Image src={require("../../assets/img/goku.png")} />
                  <Image src={require("../../assets/img/vegeta.png")} />
                </ImageWrapper>
                <FarmCards />
              </FarmContainer>
            </Route>
            <Route path={`${path}/:farmId`}>
              <Farm />
            </Route>
          </>
        ) : (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => connect("injected")}
                text="CONNECT TO A WALLET"
              // borderImage
              />
            </div>
          )}
      </Page>
    </Switch>
  );
};

const SwitchTab = styled.div`
  margin-top: 20px;
  display: flex;
`;

const SwitchButton = styled.div`
  width: 156px;
  margin-left: 10px;
  margin-right: 10px;
`;

const FarmContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: -100px;
  pointer-events: none;

  img:first-child {
    margin-left: 40px;
  }
  img:last-child {
    margin-right: 20px;
  }
`;

const Image = styled.img`
  width: 13%;
  @media only screen and (max-width: 1440px) {
    width: 10%;
  }
  @media only screen and (max-width: 1260px) {
    display: none;
  }

  pointer-events: auto;
`;

// const ButtonGroup = styled.div`
//   display: flex;
//   width: 100%;
//   margin-top: 10px;
//   justify-content: space-between;
//   align-items: center;
//   img {
//     width: 50px;
//     height: 50px;
//   }
//   button {
//     padding: 10px 10px;
//   }
// `;
export default Farms;
