import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { Flex, Box, Text } from '@core-ui/index';
import { RawViewer } from '@editor/index';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { ModalLarge, Heading3, ButtonRound } from '../../UIComponents';
import { CLUB_SERVER_ROOT, TEFI_DAGORA_CONTRACT_ADDRESS } from '@constants/index';
import { simulateSendContractMsg } from '../../../transactions/sendContract';
import useWallet from '../../../lib/useWallet';
import { useRepliesByThread } from '../../../data/useRepliesByThread';

const TITLE = 'Confirm Post Reply';
const DEFAULT_TX_STATE = '---';

const FormContainer = styled(Flex)`
  ${css({
    alignItems: 'center',
    flexDirection: 'column',
  })}
`;

const StyledViewer = styled(RawViewer)`
  ${css({
    overflowY: 'scroll',
    height: 260,
    width: ['calc(80vw - 40px)', null, null, 480],
    minHeight: [120, null, null, 200],
    color: 'secondary',
    bg: 'postBg',
    px: 3,
    pt: 1,
    mt: [3, null, null, 4],
  })}
`;

const FeeContainer = styled(Flex)`
  ${css({
    mt: 4,
    pt: 3,
    width: ['calc(80vw - 40px)', null, null, 480],
    justifyContent: 'space-between',
    alignItems: 'center',
  })}
`;

const FeeText = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: ['8px', null, null, 0],
    fontWeight: 'bold',
  })}
`;

interface Props {
  onSend: any;
  replyContent: any;
  isVisible: boolean;
  threadId: number;
}

export const PostCommentView: React.FC<Props> = ({ onSend, replyContent, isVisible, threadId }) => {
  const [txFee, setTxFee] = useState<string>(null);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { useConnectedWallet } = useWallet();
  const { mutate } = useSWRConfig();

  const { getMutateKey } = useRepliesByThread(threadId);

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;

  const calculateTxTax = async () => {
    if (!isTxCalculated) {
      setSimulationLoading(true);
      const result = await simulateSendContractMsg(walletAddress, contractMsgs);
      if (!result.error) {
        setTxFee(result.fee);
        setIsTxCalculated(true);
      }
      setSimulationLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculateTxTax();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isTxCalculated) {
      setIsTxCalculated(false);
      setTxFee(DEFAULT_TX_STATE);
    }
  }, [replyContent?.raw]);

  const contractMsgs = useMemo(
    () => [
      new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, {
        add_comment: { comment: JSON.stringify(replyContent.raw), thread_id: threadId },
      }),
    ],
    [replyContent?.raw],
  );

  const onPostSuccess = async (txResult) => {
    try {
      const eventAttributes = txResult?.tx_response?.logs[0]?.events[2]?.attributes;
      const author = eventAttributes?.[2]?.value;
      const comment = eventAttributes?.[3]?.value;
      const comment_id = eventAttributes?.[4]?.value;
      const body = { reply: { comment_id: parseInt(comment_id), author, comment, thread_id: threadId } };
      const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET ? true : false;
      await axios.post(CLUB_SERVER_ROOT + '/dagora/thread/replies/cache?isTestnet=' + isTestnet, body);
      const key = getMutateKey(0);
      mutate(key);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async () => {
    if (isTxCalculated) {
      const data = { msgs: contractMsgs, sender: walletAddress };
      onSend(data, true, onPostSuccess);
    }
  };

  return (
    <ModalLarge>
      <Heading3>{TITLE}</Heading3>
      <FormContainer>
        <Box mt={4}>
          <StyledViewer data={replyContent?.raw || []} />
        </Box>
        <FeeContainer>
          <FeeText>TxFee:</FeeText>
          <FeeText>{simulationLoading ? 'Loading...' : txFee ? `${txFee} USTC` : DEFAULT_TX_STATE}</FeeText>
        </FeeContainer>
        <Box mt={4}>
          <ButtonRound onClick={onSubmit} disabled={!isTxCalculated}>
            {isTxCalculated ? 'Post' : 'Next'}
          </ButtonRound>
        </Box>
      </FormContainer>
    </ModalLarge>
  );
};
