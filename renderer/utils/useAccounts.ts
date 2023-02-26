import { useCallback } from 'react';
import { getAnchorAccount } from '../pages/api/anchor/lib/anc';
import { getMirrorAccount } from '../pages/api/mirror/getAccountData';
import { getLoterraAccount } from '../pages/api/loterra/lib';
import { useState, useEffect } from 'react';
import { getPylonAccount } from '../pages/api/pylon/getAccountData';
import { getTerraCoreAccount } from '../pages/api/terra-core/core';
import { getStarTerraAccount } from '../pages/api/starterra/lib/account';
import { getSpectrumAccount } from '../pages/api/spectrum/lib';
import { getApolloDaoAccount } from '../pages/api/apollo/lib';
import { getTWDAccount } from '../pages/api/terraworld/lib';

export const fetchAccountsData = async (address: string) => {
  const anchorPromise = getAnchorAccount(address);
  const mirrorPromise = getMirrorAccount(address);
  const loterraPromise = getLoterraAccount(address);
  const pylonPromise = getPylonAccount(address);
  const spectrumPromise = getSpectrumAccount(address);
  const starterraPromise = getStarTerraAccount(address);
  const corePromise = getTerraCoreAccount({ args: { address: address } });
  const apolloPromise = getApolloDaoAccount(address);
  const terraworldPromise = getTWDAccount(address);
  const result = Promise.all([
    anchorPromise,
    mirrorPromise,
    loterraPromise,
    pylonPromise,
    spectrumPromise,
    starterraPromise,
    corePromise,
    apolloPromise,
    terraworldPromise,
  ]);
  return result;
};

const useAccounts = (address: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const [anchor, mirror, loterra, pylon, spectrum, starterra, core, apollo, terraworld] = await fetchAccountsData(
        address,
      );

      if (anchor && mirror && loterra && pylon && spectrum && starterra && core && apollo && terraworld) {
        setData({ assets: { ...core, mirror, anchor, loterra, spectrum, starterra, pylon, apollo, terraworld } });
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [address]);

  const refetch = () => {
    if (!refreshing) {
      setRefreshing(true);
      fetch();
    }
  };

  useEffect(() => {
    if (data !== null) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (address) {
      setLoading(true);
      setData(null);
      setError(null);
      setRefreshing(null);
      fetch();
    }
  }, [address]);

  return { data, loading, fetch, refetch, error, refreshing };
};

export default useAccounts;
