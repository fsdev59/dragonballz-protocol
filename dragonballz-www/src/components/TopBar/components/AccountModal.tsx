import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { goku as gokuAddress, vegeta as vegetaAddress } from "../../../constants/tokenAddresses";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { getDisplayBalance } from "../../../utils/formatBalance";

import { getCurrentVotes, getProposalThreshold } from "../../../dragonballzUtils";
import useDragonballz from "../../../hooks/useDragonballz";
import useDelegate from "../../../hooks/useDelegate";
import { useWallet } from "use-wallet";

import Button from "../../Button";
import CardIcon from "../../CardIcon";
import IconButton from "../../IconButton";
import { AddIcon, RemoveIcon } from "../../icons";
import Label from "../../Label";
import Modal, { ModalProps } from "../../Modal";
import ModalTitle from "../../ModalTitle";

import famerImg from "../../../assets/img/farmer.png";

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account } = useWallet();
  const { dragonballz } = useDragonballz();

  const [votes, setvotes] = useState("");
  const [devsVotes, setdevsVotes] = useState("");
  const [proposalThreshold, setProposalThreshold] = useState("");

  const handleSignOutClick = useCallback(() => {
    onDismiss!();
  }, [onDismiss]);

  // old grap address: 0x00007569643bc1709561ec2E86F385Df3759e5DD
  // new address: 0x57d97b3df6d349622d38b6d297b2bfa2d7d15ec1
  const onDelegateSelf = useDelegate().onDelegate;
  const onDelegateDev = useDelegate(
    "0x57d97B3Df6D349622d38B6D297b2bFa2D7d15Ec1"
  ).onDelegate;

  const gokuBalance = useTokenBalance(gokuAddress);
  const vegetaBalance = useTokenBalance(vegetaAddress);

  const displayGokuBalance = useMemo(() => {
    return getDisplayBalance(gokuBalance);
  }, [gokuBalance]);

  const displayVegetaBalance = useMemo(() => {
    return getDisplayBalance(vegetaBalance);
  }, [vegetaBalance]);

  // const fetchVotes = useCallback(async () => {
  //   const votes = await getCurrentVotes(dragonballz, account)
  //   const devsVotes = await getCurrentVotes(dragonballz, "0x57d97B3Df6D349622d38B6D297b2bFa2D7d15Ec1")
  //   const proposalThreshold = await getProposalThreshold(dragonballz);
  //   setvotes(getDisplayBalance(votes))
  //   setdevsVotes(getDisplayBalance(devsVotes))
  //   setProposalThreshold(getDisplayBalance(proposalThreshold))
  // }, [account, dragonballz])

  // useEffect(() => {
  //   if (dragonballz) {
  //     fetchVotes()
  //   }
  // }, [fetchVotes, dragonballz])

  return (
    <Modal>
      <ModalTitle text="My Account" />

      <StyledBalanceWrapper>
        <CardIcon>
          <img src={famerImg} height="60" />
        </CardIcon>
        <StyledBalance>
          <StyledValue>{displayGokuBalance}</StyledValue>
          <Label text="GOKU Balance" />
        </StyledBalance>
        <StyledBalance>
          <StyledValue>{displayVegetaBalance}</StyledValue>
          <Label text="VEGETA Balance" />
        </StyledBalance>
        {/* <StyledBalance>
          <StyledValue>{votes}</StyledValue>
          <Label text="Current Votes" />
        </StyledBalance>
        <StyledBalance>
          <StyledValue>{devsVotes}</StyledValue>
          <Label text="Devs Votes" />
        </StyledBalance> */}
        {/* <StyledBalance>
          <Label text="Proposal threshold is" />
          <StyledValue>{proposalThreshold}</StyledValue>
        </StyledBalance> */}
      </StyledBalanceWrapper>

      {/* <StyledSpacer />
      {votes != "" && votes == "0.000" &&
        <Label text="Not yet?" /> && 
        <Button
          onClick={onDelegateSelf}
          text="Setup Vote"
          borderImage
        />
      }
      <StyledSpacer />
      <Button
        onClick={onDelegateDev}
        text="Share votes to Devs"
        borderImage
      />
      <StyledSpacer /> */}
      <Button onClick={handleSignOutClick} text="Sign out" />
      <StyledSpacer />
    </Modal>
  );
};

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledValue = styled.div`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 36px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledBalanceIcon = styled.div`
  font-size: 36px;
  margin-right: ${(props) => props.theme.spacing[3]}px;
`;

const StyledBalanceActions = styled.div`
  align-items: center;
  display: flex;
  margin-top: ${(props) => props.theme.spacing[4]}px;
`;

export default AccountModal;
