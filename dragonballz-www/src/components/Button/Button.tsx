import React, { useContext, useMemo } from "react";
import styled, { ThemeContext } from "styled-components";

import { Link } from "react-router-dom";

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  text?: string;
  to?: string;
  variant?: "primary" | "secondary";
  borderImage?: boolean;
  isSelected? : boolean;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
  borderImage,
  isSelected
}) => {
  const { color, spacing } = useContext(ThemeContext);

  let buttonColor: string;
  switch (variant) {
    case "primary":
      buttonColor = "#F85B1A";
      break;
    case "secondary":
      buttonColor = "#181463";
      break;
    default:
      buttonColor = "#28a745";
  }

  let boxShadow: string;
  let buttonSize: number;
  let buttonPadding: number;
  let fontSize: number;
  switch (size) {
    case "sm":
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`;
      buttonPadding = spacing[3];
      buttonSize = 36;
      fontSize = 14;
      break;
    case "lg":
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`;
      buttonPadding = spacing[4];
      buttonSize = 72;
      fontSize = 16;
      break;
    case "md":
    default:
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`;
      buttonPadding = spacing[4];
      buttonSize = 56;
      fontSize = 16;
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>;
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      );
    } else {
      return text;
    }
  }, [href, text, to]);

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
      borderImage={borderImage}
      isSelected={isSelected}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  );
};

interface StyledButtonProps {
  boxShadow: string;
  color: string;
  disabled?: boolean;
  fontSize: number;
  padding: number;
  size: number;
  borderImage: boolean;
  isSelected: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: ${props => props.isSelected ? props.color : 'transparent'};
  border: 2px solid ${props => props.color};
  border-radius: 0.6em;
  color: white;
  cursor: pointer;
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  font-weight: 400;
  line-height: 1;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  -webkit-transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  &:hover, &:focus {
    color: #fff;
    outline: 0;
  }

  &:hover {
    box-shadow: 0 0 40px 40px ${props => props.color} inset;
  }
`;

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  /* height: 56px; */
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`;

export default Button;
