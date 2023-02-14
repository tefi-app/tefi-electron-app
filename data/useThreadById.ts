import useSWR from 'swr';
import axios from 'axios';
import { queryClientForThreadById } from 'helpers/queries';

const getKey = async (id: string) => {
  try {
    if (!id) return null;
    const parseId = parseInt(id);
    const result = await queryClientForThreadById(parseId, process.env.NEXT_PUBLIC_IS_TESTNET ? true : false);
    return result;
  } catch (err) {
    return null;
  }
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
