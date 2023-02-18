import useSWR from 'swr';
import { useMemo, useState } from 'react';
const { TERRA_SYMBOLS } = require('../symbols');
import { round, evaluate } from 'mathjs';
import { FCD_URL, MICRO } from '@terra-utilities/index';
import axios from 'axios';

const generateDashboardAssets = (assets) => {
  if (assets) {
    const assetsTotal = round(
      assets.reduce((sum, currentVal) => sum + currentVal.value, 0),
      5,
    );
    const sortedAssets = assets.sort((a, b) => b.value - a.value);
    const largerAssets = sortedAssets.filter((asset) => asset.value >= 1);
    const data = sortedAssets.map((asset: any) => {
      return [
        { symbol: asset.symbol },
        { name: asset.name },
        { value: round(asset.balance, 5) },
        { price: round(asset.price, 5) + ' USTC' },
        { value: round(asset.value, 5) + ' USTC' },
      ];
    });
    const largeData = largerAssets.map((asset: any) => {
      return [
        { symbol: asset.symbol },
        { name: asset.name },
        { value: round(asset.balance, 5) },
        { price: round(asset.price, 5) + ' USTC' },
        { value: round(asset.value, 5) + ' USTC' },
      ];
    });

    return {
      titles: ['Ticker', 'Name', 'Balance', 'Price', 'Value'],
      data: data,
      largeData: largeData,
      total: '$' + assetsTotal,
      totalValue: assetsTotal,
    };
  }
  return {};
};

const calculatePrice = (denom, swapRates) => {
  if (denom === 'uusd') return 1;
  const price = round(evaluate(`1 / ${swapRates[denom].swaprate}`), 10);
  return price;
};

const calculateTokenUSTCValue = (amount, denom, swapRates) => {
  if (denom === 'uusd') return amount;
  const ustcValue = round(evaluate(`${amount} / ${swapRates[denom].swaprate}`), 10);
  return ustcValue;
};

const getSwapRates = async () => {
  const result = await axios.get(`${FCD_URL}/v1/market/swaprate/uusd`);
  if (result.data) {
    const swapRates = result.data.reduce((accum, currentValue) => {
      accum[currentValue.denom] = currentValue;
      return accum;
    }, {});
    return swapRates;
  } else {
    throw new Error('Error fetching swap ratres');
  }
};

const fetchAccountInfo = async (address) => {
  const result = await axios.get(`${FCD_URL}/v1/bank/${address}`);
  return result.data;
};

const generateBalanceInfo = (accountInfo, swapRates) => {
  const balanceInfo = accountInfo.balance.map((balanceInfo) => {
    const balance = evaluate(`${balanceInfo.available} / ${MICRO}`);
    const price = calculatePrice(balanceInfo.denom, swapRates);
    const value = calculateTokenUSTCValue(balance, balanceInfo.denom, swapRates);
    return {
      balance,
      price,
      value,
      name: TERRA_SYMBOLS[balanceInfo.denom].name,
      symbol: TERRA_SYMBOLS[balanceInfo.denom].symbol,
      denom: balanceInfo.denom,
    };
  });
  return balanceInfo;
};

const fetcher = async (address: string) => {
  try {
    if (!address) {
      return null;
    }
    const [accountInfo, swapRates] = await Promise.all([fetchAccountInfo(address), getSwapRates()]);
    const balanceInfo = generateBalanceInfo(accountInfo, swapRates);
    return balanceInfo ?? {};
  } catch (err) {
    return err;
  }
};

export const useAccount = (address: string) => {
  const { data, error, mutate } = useSWR(address, fetcher);
  const [isRefetching, setRefetching] = useState<boolean>(false);
  const refetch = () => {
    if (!isRefetching) {
      setRefetching(true);
    }
    mutate();
  };
  const assets = useMemo(() => generateDashboardAssets(data?.data), [data?.data]);

  return {
    rawData: data?.data,
    assets,
    isLoading: !error && !data,
    isRefetching: !error && !data && isRefetching,
    isError: error,
    refetch: refetch,
  };
};
