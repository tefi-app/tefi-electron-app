import BigNumber from 'bignumber.js';
import { Coin } from '@terra-money/terra.js';
import { LCD_URL } from '@terra-utilities/index';
import axios from 'axios';

const DEFAULT_DENOM = 'uusd';

const fetchCapital = async (denom = DEFAULT_DENOM) => {
  try {
    const result = await axios.get(`${LCD_URL}/terra/treasury/v1beta1/tax_caps/${denom}`);
    const data = result?.data ?? {};
    const taxCap = data?.tax_cap;
    return taxCap;
  } catch (err) {
    return err;
  }
};

export const calculateTax = async (amount: string, denom = DEFAULT_DENOM) => {
  try {
    const result = await axios.get(`${LCD_URL}/terra/treasury/v1beta1/tax_rate`);
    const { data: taxRateResult } = result?.data ?? {};
    const taxRate = taxRateResult?.tax_rate ?? '0';
    const taxCap = denom === 'uluna' ? '0' : await fetchCapital(denom);
    const taxAmount = BigNumber.min(new BigNumber(amount).times(taxRate), new BigNumber(taxCap))
      .integerValue(BigNumber.ROUND_CEIL)
      .toString();
    return new Coin(denom, taxAmount);
  } catch (err) {
    return err;
  }
};
