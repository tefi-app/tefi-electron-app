import css from '@styled-system/css';
import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText, SubText } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { Box } from '@contco/core-ui';
const HEADING_TEXT = `Rewards`;

const CSS_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
    fontSize: ['11px', null, null, '14px', null, null, 16],
  });

export interface RewardsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  pylonAssets: PylonAccount;
}

const Rewards: React.FC<RewardsProps> = ({ ancAssets, mirrorAssets, pylonAssets }) => {
  const borrowRewards = ancAssets?.debt?.reward;
  const govRewards = ancAssets?.gov?.reward;
  const poolRewards = ancAssets?.pool?.reward;
  const ancPrice = ancAssets?.assets[0]?.price;

  const totalReward = ancAssets?.totalReward;

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.rewardsSum;
    const pylonStakingTotal = pylonAssets?.pylonSum?.pylonStakingRewardsSum;
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const total = (parseFloat(mirrorTotal) + parseFloat(totalReward) + parseFloat(pylonStakingTotal) + parseFloat(pylonPoolTotal)).toFixed(3);
    return total ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const getPylonPoolRewards = () => {
    if(pylonAssets?.pylonPool) {
    return pylonAssets?.pylonPool.map((assets: PylonPool, index: number) => (
      <Row key={index}>
        <StyledText fontWeight="500"> {assets?.lpName}</StyledText>
        <StyledText isChildren={true}>
          {' '}
          {parseFloat(assets?.stakedLP).toFixed(3)} LP
          <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {'UST'}
          </HoverText>
        </StyledText>
        <div>
        <StyledText css={CSS_APR}> {formatApr(assets?.apy)}%</StyledText>
        <SubText> (APY)</SubText>
        </div>
        <div>
        <StyledText>{parseFloat(assets?.rewards).toFixed(3)} {assets?.symbol}</StyledText>
        <SubText>${parseFloat(assets?.rewardsValue).toFixed(3)}</SubText>
        </div>
      
      </Row>
    ))
    }
    return null;
  }

  const getPylonStakingRewards = () => {
    if(pylonAssets?.pylonStakings) {
    return pylonAssets?.pylonStakings.map((assets: PylonStakings, index: number) => (
      <Row key={index}>
        <StyledText fontWeight="500"> {assets?.symbol}</StyledText>
        <div>
        <StyledText>
          {parseFloat(assets?.balance).toFixed(3)} {assets?.symbol}
        </StyledText>
        <SubText>${parseFloat(assets.stakedValue).toFixed(3)}</SubText>
        </div>
        <div>
        <StyledText css={CSS_APR}> {formatApr(assets?.apy)}%</StyledText>
        <SubText> (APY)</SubText>
        </div>
        <div>
        <StyledText>{parseFloat(assets?.rewards).toFixed(3)} {assets?.symbol}</StyledText>
        <SubText>${parseFloat(assets?.rewardsValue).toFixed(3)}</SubText>
        </div>
      
      </Row>
    ))
    }
    return null;
  }
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getRewardsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
        {RewardsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
       {getPylonPoolRewards()}
       {getPylonStakingRewards()}
      {parseFloat(ancAssets.debt?.value) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {borrowRewards?.name}</StyledText>
          <StyledText>-</StyledText>
          <StyledText css={CSS_APR}> {borrowRewards?.apy}%</StyledText>
          <Box>
            <StyledText>{borrowRewards?.reward} ANC</StyledText>
            <SubText>
              $
              {borrowRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(borrowRewards?.reward) * parseFloat(ancPrice)).toFixed(3)}
            </SubText>
          </Box>
        </Row>
      ) : null}
      {govRewards?.staked && parseFloat(govRewards?.staked) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {govRewards?.name}</StyledText>
          <StyledText>{govRewards?.staked ? parseFloat(govRewards?.staked).toFixed(3) + ' ANC' : null}</StyledText>
          <StyledText css={CSS_APR}> {govRewards?.apy}%</StyledText>
          <StyledText>
            Automatically <br />
            re-staked
          </StyledText>
        </Row>
      ) : null}
      {poolRewards?.staked && parseFloat(poolRewards?.staked) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {poolRewards?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(poolRewards?.staked).toFixed(3) + ' LP'}
            <HoverText>
              {parseFloat(ancAssets?.pool?.anc).toFixed(3)} {'ANC'} <br />
              {parseFloat(ancAssets?.pool?.ust).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText css={CSS_APR}> {poolRewards?.apy}%</StyledText>
          <Box>
            <StyledText>
              {poolRewards?.reward} {'ANC'}
            </StyledText>

            <SubText>
              $
              {poolRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(poolRewards?.reward) * parseFloat(ancPrice)).toFixed(3)}
            </SubText>
          </Box>
        </Row>
      ) : null}
      {mirrorAssets?.mirrorStaking.map((assets: MirrorStaking, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {' '}
            {parseFloat(assets?.lpBalance).toFixed(3)} LP
            <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText css={CSS_APR}> {formatApr(assets?.apr)}%</StyledText>
          <StyledText>${parseFloat(assets?.rewardsUstValue).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Rewards;
