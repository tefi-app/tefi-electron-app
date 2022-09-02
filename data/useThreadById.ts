import useSWR from 'swr';
import axios from 'axios';
import { CLUB_SERVER_ROOT } from '../constants';

const getKey = (id: string) => {
  return `${CLUB_SERVER_ROOT}/dagora/thread/${id}?isTestnet=true`;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useThreadById = (id: string) => {
  const { data, error } = useSWR(getKey(id), fetcher);
  const isLoading = !data && !error;

  const state = {
    isLoading,
    thread: data as Thread,
    isError: error,
  };

  return state;
};