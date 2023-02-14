import useSWR from 'swr';
import { queryClientForThreadById } from 'helpers/queries';

const getKey = (id: string) => {
  if (!id) return null;
  return id;
};

const fetcher = async (id: string) => {
  try {
    if (!id) return null;
    const parseId = parseInt(id);
    const result = await queryClientForThreadById(parseId, process.env.NEXT_PUBLIC_IS_TESTNET ? true : false);
    return result;
  } catch (err) {
    return err;
  }
};

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
