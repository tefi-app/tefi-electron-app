import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import { Editor } from '@contco/editor';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { ModalLarge, Heading3, InputLabel, Input, ButtonRound } from '../../UIComponents';
import { TEFI_DAGORA_CONTRACT_ADDRESS } from '../../../constants';
import { simulateSendContractMsg } from '../../../transactions/sendContract';
import useWallet from '../../../lib/useWallet';

const TITLE = 'Create A New Thread';
const EDITOR_PLACEHOLDER = 'Click anywhere to start typing';
const DEFAULT_TX_STATE = '---';
const DEFAULT_CATEGORY = 'General';

const FormContainer = styled(Flex)`
  ${css({
    alignItems: 'center',
    flexDirection: 'column',
  })}
`;

const EditorScrollContainer = styled(Box)`
  ${css({
    height: 200,
    overflowY: 'scroll',
  })}
`;

const EditorContainer = styled(Box)`
  ${css({
    width: ['calc(80vw - 40px)', null, null, 480],
    color: 'secondary',
    bg: 'postBg',
    px: 3,
    pt: 1,
  })}
`;

const StyledEditor = styled(Editor)`
  ${css({
    height: '100%',
    minHeight: [120, null, null, 140],
    width: '100%',
  })}
`;

const FeeContainer = styled(Flex)`
  ${css({
    mt: 4,
    width: ['calc(80vw - 40px)', null, null, 480],
    justifyContent: 'space-between',
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
}

const EMPTY_CONTENT = [{ type: 'paragraph', children: [{ text: '' }] }];

export const PostThreadView: React.FC<Props> = ({ onSend }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<any>({});
  const [txFee, setTxFee] = useState<string>(null);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { useConnectedWallet } = useWallet();

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;

  const onPostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    resetTxState();
  };

  const isSubmitDisabled = useMemo(() => {
    const emptyContent =
      Object.keys(content).length === 0 || JSON.stringify(content?.raw) === JSON.stringify(EMPTY_CONTENT);
    if (title.trim() === '' || emptyContent) {
      return true;
    }
    return false;
  }, [content, title]);

  const onSubmit = async () => {
    if (!isSubmitDisabled) {
      if (!isTxCalculated) {
        setSimulationLoading(true);
        const msgs = [
          new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, {
            create_thread: { category: DEFAULT_CATEGORY, content: JSON.stringify(content.raw), title },
          }),
        ];
        const result = await simulateSendContractMsg(walletAddress, msgs, true);
        if (!result.error) {
          setTxFee(result.fee);
          setIsTxCalculated(true);
        }
        setSimulationLoading(false);
      } else {
        const msgs = [
          new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, {
            create_thread: { category: DEFAULT_CATEGORY, content: JSON.stringify(content.raw), title },
          }),
        ];
        const data = { msgs, sender: walletAddress };
        onSend(data, true);
      }
    }
  };

  const onContentUpdate = (content) => {
    setContent(content);
    resetTxState();
  };

  const resetTxState = () => {
    if (isTxCalculated) {
      setIsTxCalculated(false);
      setTxFee(DEFAULT_TX_STATE);
    }
  };

  return (
    <ModalLarge>
      <Heading3>{TITLE}</Heading3>
      <FormContainer>
        <Box mt={4}>
          <InputLabel>Title</InputLabel>
          <Input onChange={onPostInput} name="title" type="text" placeholder="Write Title" />
        </Box>
        <Box mt={4}>
          <InputLabel>Content</InputLabel>
          <EditorScrollContainer>
            <EditorContainer>
              <StyledEditor
                placeholder={EDITOR_PLACEHOLDER}
                placeholderStyles={{ color: 'inherit' }}
                data={content}
                onContentUpdate={onContentUpdate}
              />
            </EditorContainer>
          </EditorScrollContainer>
        </Box>
        <FeeContainer>
          <FeeText>TxFee:</FeeText>
          <FeeText>{simulationLoading ? 'Loading...' : txFee ? `${txFee} USTC` : DEFAULT_TX_STATE}</FeeText>
        </FeeContainer>
        <Box mt={4}>
          <ButtonRound onClick={onSubmit} disabled={isSubmitDisabled}>
            {isTxCalculated ? 'Post' : 'Next'}
          </ButtonRound>
        </Box>
      </FormContainer>
    </ModalLarge>
  );
};
