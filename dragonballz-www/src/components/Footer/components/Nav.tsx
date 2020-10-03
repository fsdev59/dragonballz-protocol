import React from "react";
import styled from "styled-components";

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://discord.gg/cuJYH7x">
        <StyledLinkIcon src={require("../../../assets/img/discord.png")} />
      </StyledLink>
      <StyledLink href="https://twitter.com/degenballz">
        <StyledLinkIcon src={require("../../../assets/img/twitter.png")} />
      </StyledLink>
      <StyledLink href="https://t.me/DegenBallZ">
        <StyledLinkIcon src={require("../../../assets/img/telegram.png")} />
      </StyledLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`;

const StyledLink = styled.a`
  padding: ${(props) => props.theme.spacing[1]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }

  background-color: #dae1e768;
  border-radius: 10px;
  height: 40px;
  margin: 8px;
`;
const StyledLinkIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
`;

export default Nav;
