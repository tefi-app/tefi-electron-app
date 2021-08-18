import React, {useState} from 'react';
import Head from 'next/head';
import { request } from 'graphql-request';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import data from '../../components/Bubble/images.json';
import { assets} from '../../constants/assets';
import { TERRA_SWAP_GRAPHQL_URL } from '../../constants';
import { getTokenKey } from '../../helpers/market';
import {GET_PAIRS_DATA} from '../../graphql/queries/getPairsData';
import { subYears} from 'date-fns';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';

const Container = styled(Flex)`
  ${css({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 1,
    boxSizing: 'border-box',
    height: [400, 480, 520, 600, null, 860, '100vh'],
  })}
`;

const BubblesRow = styled(Flex)`
  ${css({
    margin:'auto',
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent: 'center',
  })}
`;

const HeatBubble: React.FC = ({ theme, changeTheme, pairData }: any) => {
    const priceChange = (singalPairData) =>{
        const dayCurrentPrice = singalPairData?.historicalData[0]?.[`${singalPairData.tokenKey}Price`];
        const dayOldPrice = singalPairData?.historicalData[1]?.[`${singalPairData.tokenKey}Price`];
        const change = parseFloat(dayCurrentPrice) - parseFloat(dayOldPrice);
        const percentChange = change / parseFloat(dayOldPrice)* 100;
        const roundOff = Math.abs(percentChange).toFixed(2);
        let signedPercentage = '1'; 
        if(percentChange < 0){
          signedPercentage = (parseFloat(roundOff) * -1).toFixed(2);
        }
        else {
          signedPercentage = roundOff;
        }
        return signedPercentage;
    }

    const bubbleSize = (percentage) => {
      const defaultSize = 500;
      const positivePer = parseFloat(percentage) > 0? parseFloat(percentage):parseFloat(percentage) * -1 ;
      let size = Number(((positivePer/defaultSize) * 100).toFixed(1));
      if(size < 0.5){
        size = size + 0.5
      }
      if(size > 2.5){
        size = 2.5
      }
      return size;
    }

    const BubbleMap = () => {
       const result = data.map((a: any) => (
         <div className=''>
            <Bubble 
                key={a.symbol} 
                price={priceChange(pairData[a.symbol]) +'%'} 
                isPostive={parseFloat(priceChange(pairData[a.symbol])) > 0? true : false} 
                size={bubbleSize(priceChange(pairData[a.symbol]))}
                {...a} />
       </div>
       ))
        return result
    }
    
    return (
        <div>
            <Head>
                <title>Tefi App - Bubble</title>
            </Head>
            <div>
                <div>
                    <Header theme={theme} changeTheme={changeTheme} />
                </div>
                <Container>
                <BubblesRow>
                    {BubbleMap()}
                </BubblesRow>
                </Container>                
            </div>

        </div>
    );
};

export async function getServerSideProps(_) {
  
    const poolAddresses = Object.keys(assets).map((keyName) => assets[keyName].poolAddress);
    const toDate = new Date();
    const fromDate = subYears(toDate, 1);
  
    const { pairs } = await request(TERRA_SWAP_GRAPHQL_URL, GET_PAIRS_DATA, {
      from: fromDate.getTime() / 1000,
      to: toDate.getTime() / 1000,
      interval: 'DAY',
      pairAddresses: poolAddresses,
    });
  
    const data: any = {};
  
    Object.keys(assets).map((keyName: string, index: number) => {
      data[keyName] = { ...assets[keyName], ...pairs[index], tokenKey: getTokenKey(pairs[index], keyName) };
    });
  
    return {
      props: {
        pairData: data,
      },
    };
  }

export default HeatBubble;