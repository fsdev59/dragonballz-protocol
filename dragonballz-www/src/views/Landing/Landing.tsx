import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Footer from "../../components/Footer";
import useDragonballz from "../../hooks/useDragonballz";

const colorList: { [key: string]: string } = {
  GOKU: "#F85B1A",
  VEGETA: "#181463"
};

const Landing: React.FC = () => {
  const { setTokenType } = useDragonballz();
  const history = useHistory();

  const [text, setText] = useState("");

  return (
    <LandingWrapper>
      <div>
        <Footer />
      </div>
      <LandingContainer>
        <Character>
          <Title color={text}>{text}</Title>
        </Character>
        <ImageContainer>
          <div>
            <Text>
              Goku<br />(UniSwap)
            </Text>
            <GokuImage
              className="image"
              onClick={() => {
                setTokenType('goku');
                history.push('/farms');
              }}
              onMouseOver={() => {
                setText("GOKU");
              }}
              onMouseOut={() => {
                setText("");
              }}
            >
            </GokuImage>
          </div>
          <Divider>
            <div />
          </Divider>
          <div>
            <Text>
              Vegeta<br />(SushiSwap)
            </Text>
            <VegetaImage
              className="image"
              onClick={() => {
                setTokenType('vegeta')
                history.push('/farms');
              }}
              onMouseOver={() => {
                setText("VEGETA");
              }}
              onMouseOut={() => {
                setText("");
              }}
            >
            </VegetaImage>
          </div>
        </ImageContainer>
      </LandingContainer>
    </LandingWrapper>
  )
}

const LandingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  background: url(${require("../../assets/img/background.png")}) no-repeat fixed;
`;

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-top: 100px;
  @media (max-width: 960px) {
    width: 80%;
  }
`;

const Character = styled.div`
  margin-bottom: 50px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div.image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 270px;
    height: 366px;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    -o-transition: all 1s;
    transition: all 1s;
    background-size: cover;
    @media (max-width: 480px) {
      width: 135px;
      height: 183px;
    }
  }

  &:hover {
    cursor: pointer;
  }

  &:focus {
    div {
      transform: scale(1.2);
    }
  }
`;

const GokuImage = styled.div`
  background: url(${require("../../assets/img/goku.png")});
  &:hover {
    background: url(${require("../../assets/img/goku-back.png")});
    background-size: cover;
    p {
      color: white;
      opacity: 1;
      pointer-events: none;
    }
  }
`;

const VegetaImage = styled.div`
  background: url(${require("../../assets/img/vegeta.png")});
  &:hover {
    background: url(${require("../../assets/img/vegeta-back.png")});
    background-size: cover;
    p {
      color: white;
      opacity: 1;
      pointer-events: none;
    }
  }
`;

const Text = styled.p`
  margin-top: -150px;
  text-align: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  @media (max-width: 480px) {
    font-size: 14px;
    margin-top: -60px;
  }
`;

const Title = styled.p`
  margin-top: -150px;
  text-align: center;
  color: ${props => colorList[props.color]};
  font-size: 26px;
  font-weight: bold;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
`;

const Divider = styled.div`
  width: 2px;
  div {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 0;
    background: linear-gradient(to bottom,  rgba(100,199,171,0) 0%,rgba(86,180,199,1) 53%,rgba(74,163,223,0) 100%);
    @media (max-width: 480px) {
      background: linear-gradient(to bottom,  rgba(100,199,171,0) 0%,rgba(86,280,199,1) 53%,rgba(74,163,223,0) 100%);
    }
  }
`;

export default Landing;