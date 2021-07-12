import { useEffect, useState } from 'react';
import { AssetsTitle } from '../../constants';
import { CheckBox, Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { plus } from '../../pages/api/mirror/utils';
import { Flex } from '@contco/core-ui';

const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core;
  pylonAssets: PylonAccount;
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core, pylonAssets }: AssetsProps) => {

  const [holdings, setHoldings] = useState<Holdings[]>([]);

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const pylonHoldingsSum = pylonAssets?.pylonSum?.pylonHoldingsSum;
    const total = parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancAssets?.total?.anchorHoldingsSum) + parseFloat(pylonHoldingsSum);
    return total.toFixed(3) ?? '0';
  };

  useEffect(() => {
    const holdings = [ ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins, ...ancAssets?.assets];
    const sortedHoldings = holdings.sort((a: any,b: any) => b.value - a.value);
    setHoldings(sortedHoldings);
  }, [mirrorAssets, ancAssets, core,pylonAssets]);

  const handleChange = (e: any) => {
    const holdings = [ ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins, ...ancAssets?.assets];
    const sortedHoldings = holdings.sort((a: any,b: any) => b.value - a.value);
    if (e.target.checked) {
      const largerAssets = sortedHoldings.filter((asset: Holdings) => parseFloat(asset?.value) >= 1);
      setHoldings(largerAssets);
    } else {
      setHoldings(sortedHoldings);
    }
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <StyledText>${getAssetsTotal()}</StyledText>
          <Flex alignItems="center">
            <CheckBox type="checkbox" onChange={handleChange} />
            <StyledText>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <Row>
        {AssetsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {holdings.map((asset: Holdings) => (
        <Row key={asset.symbol}>
          <StyledText fontWeight={500}> {asset.symbol}</StyledText>
          <StyledText fontWeight={500}> {asset.name}</StyledText>
          <StyledText> {convertToFloatValue(asset.balance)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.price)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.value)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
