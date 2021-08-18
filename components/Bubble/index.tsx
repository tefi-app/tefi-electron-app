import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '@contco/core-ui';
import LazyImage from '../LazyImage';

const OvalShap = styled.div<BubbleProps>`
  ${({ size, isPostive, theme }) => css({
  borderRadius: '50%',
  width: [80 * size, null, null, 84 * size, 90 * size, 110 * size, 120 * size, null, 130 * size, 150 * size],
  height: [80 * size, null, null, 84 * size, 90 * size, 110 * size, 120 * size, null, 130 * size, 150 * size],
  background: `${isPostive? theme.colors.bubblePositive : theme.colors.bubbleNegative}`,
})}
will-change: transform;
transition: transform 250ms;

&:hover {
    transition: transform 250ms;
    transform: translateY(-20px);
}
`;

const StyleImage = styled(LazyImage)<BubbleProps>`
  ${({ size }) => css({
  borderRadius: '50%',
  width: [(80 / 3) * size, null, null, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  height: [(80 / 3) * size, null, null, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  position: 'relative',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  background: '#ffffff',
  border:`${5*size}px solid #ffff`,
})}
`;


const StyleText = styled(Text)`
  ${({ size }) => css({
  position: 'relative',
  top: '55%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  color: '#ffffff',
  textAlign: 'center',
  fontWeight: 900,
  fontSize: [5 * size + 'px', null, 7 * size + 'px', null, 12 * size + 'px'],
  paddingLeft: 1,
  width: [80 / 3 * size, null, null, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],
  height: [80 / 3 * size, null, null, 84 / 3 * size, 90 / 3 * size, 110 / 3 * size, 120 / 3 * size, null, 130 / 3 * size, (150 / 3) * size],

})}
`;

export type BubbleProps = {
  price: string,
  symbol?: string,
  imageUrl: string,
  size: number,
  isPostive: boolean
}


const Bubble: React.FC<BubbleProps> = ({ ...BubbleProps }) => {

  return (
    <OvalShap {...BubbleProps}>
      <StyleImage src={BubbleProps.imageUrl} {...BubbleProps} />
      <StyleText {...BubbleProps}>{BubbleProps.price}</StyleText>
    </OvalShap>
  );
};

export default Bubble;