import React from "react";
import styled from "styled-components";

interface PageHeaderProps {
  icon: React.ReactNode;
  subtitle?: string;
  title?: string;
  tab?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title, tab }) => {
  return (
    <StyledPageHeader>
      {typeof icon === "string" && icon.length > 0 && <StyledIcon>
        <img
          src={require("../../assets/videos/" + icon + ".png")}
          height="108px"
          width="128px"
        />
      </StyledIcon>}
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
      {tab}
    </StyledPageHeader>
  );
};

const StyledPageHeader = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  // padding-bottom: ${(props) => props.theme.spacing[6]}px;
  padding-bottom: 10px;
  padding-top: ${(props) => props.theme.spacing[6]}px;
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 96px;
  height: 108px;
  line-height: 96px;
  text-align: center;
  width: 128px;
  border-radius: 40px;

  img {
    border-radius: 40px;
  }
`;

const StyledTitle = styled.h1`
  // color: ${(props) => props.theme.color.grey[600]};
  color: #e74c3c;
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  padding: 0;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
`;

const StyledSubtitle = styled.h3`
  // color: ${(props) => props.theme.color.grey[400]};
  color: white;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
`;

export default PageHeader;
