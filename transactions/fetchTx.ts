import { TESTNET_LCD_URL, LCD_URL } from '@terra-utilities/index';
import axios from 'axios';

export const formatTxData: (a: any) => txData = (txResult: any) => {
  return {
    memo: txResult?.tx?.value?.memo,
    block: txResult?.height,
    txhash: txResult?.txhash,
    timestamp: txResult?.timestamp,
    from_address: txResult?.tx?.value?.msg[0]?.value.from_address,
    to_address: txResult?.tx?.value?.msg[0]?.value.to_address,
  };
};

export const fetchTx = async (txHash: string, _network = 'mainnet') => {
  try {
    const lcdUrl = process.env.NEXT_PUBLIC_IS_TESTNET ? TESTNET_LCD_URL : LCD_URL;
    const result = await axios.get(`${lcdUrl}/cosmos/tx/v1beta1/txs/${txHash}`);
    return result?.data;
  } catch (err) {
    return { error: true, msg: 'Error fetching tx data' };
  }
};
