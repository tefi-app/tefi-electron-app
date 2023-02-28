import { LCDClient } from '@terra-money/terra.js';
import { TESTNET_LCD_URL, } from '@constants/index';
import { LCD_URL } from '@terra-utilities/index';

export const terraTestnetClient = new LCDClient({
  URL: TESTNET_LCD_URL,
  chainID: 'pisco-1',
});

export const terraClient = new LCDClient({
  URL: LCD_URL,
  chainID: 'columbus-5',
});
