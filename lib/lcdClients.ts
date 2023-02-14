import { LCDClient } from '@terra-money/terra.js';
import { LCD_URL, TESTNET_LCD_URL } from '../constants';

export const terraTestnetClient = new LCDClient({
  URL: TESTNET_LCD_URL,
  chainID: 'pisco-1',
});

export const terraClient = new LCDClient({
  URL: LCD_URL,
  chainID: 'columbus-5',
});
