import useSWRInfinite from 'swr/infinite';
import { CLUB_SERVER_ROOT } from '@constants/index';
import { useState, useEffect } from 'react';
import { queryClientForThreadsByCategory } from 'helpers/queries';

const DEFAULT_LIMIT = 10;

interface URL {
  category: string;
  limit: number;
  offset: number;
}

const getKey = (pageIndex: number, previousPageData: any, category: string) => {
  if (!category) return null;
  if (pageIndex === 0)
    return {
      category: category,
      limit: DEFAULT_LIMIT,
      offset: 0,
    } as URL;
  if (!previousPageData) return null;
  return {
    category: category,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_LIMIT * pageIndex,
  } as URL;
};

const fetcher = async (obj: URL) => {
  try {
    const result = await queryClientForThreadsByCategory(
      obj.offset,
      obj.limit,
      obj.category,
      process.env.NEXT_PUBLIC_IS_TESTNET ? true : false,
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const useThreadsByCategory = (category: string) => {
  const { data, error, size, setSize } = useSWRInfinite(
    (index: number, data: any) => getKey(index, data, category),
    fetcher,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = size > 0 && data && typeof data[currentPage - 1] === 'undefined';
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < DEFAULT_LIMIT);
  const showLoadMore = size === 1 && isReachingEnd && isLoadingInitialData ? false : currentPage !== size;

  useEffect(() => {
    if (size === 1 && !isLoadingInitialData && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [size, isLoadingInitialData]);

  const loadMore = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
    setCurrentPage(currentPage + 1);
  };

  const getMutateKey = (offset: number) => {
    return `${CLUB_SERVER_ROOT}/dagora/threads/${category}?limit=${DEFAULT_LIMIT}&offset=${offset}&isTestnet=${
      process.env.NEXT_PUBLIC_IS_TESTNET ? true : false
    }`;
  };
  const allThreads: Thread[] = data ? data.reduce((acm, page) => [...acm, ...page], []) : [];
  const pageThreads = allThreads.slice(0, DEFAULT_LIMIT * currentPage);

  const state = {
    threads: pageThreads,
    size,
    setSize,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isError: error,
    isReachingEnd,
    loadMore,
    isEmpty,
    showLoadMore,
    getMutateKey,
  };

  return state;
};
