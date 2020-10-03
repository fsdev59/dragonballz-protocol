import React from "react";
import styled from "styled-components";

import Footer from "../Footer";

const Page: React.FC = ({ children }) => (
  <StyledPage>
    <Footer />
    <StyledMain>{children}</StyledMain>
  </StyledPage>
);

const StyledPage = styled.div`
  margin-top: 0;
  background: url(${require("../../assets/img/background.png")}) no-repeat fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-position: center;
`;

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 168px);
`;

export default Page;
