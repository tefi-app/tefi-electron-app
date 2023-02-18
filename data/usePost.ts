import { useEffect, useState } from 'react';
import { FCD_URL, MICRO } from '@terra-utilities/index';
import { formatTxData } from '../transactions/fetchTx';
import axios from 'axios';

const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FILTER_POST_UST = '0.1';

const filterAndFormatPost = (data: any) => {
  const transactions = data.txs;
  const result = transactions.reduce((postList: any[], post: any) => {
    const isValid = checkValidPost(post);
    if (isValid) {
      const postData = formatTxData(post);
      postList = [...postList, postData];
      return postList;
    }
    return postList;
  }, []);
  return result;
};

const checkValidPost = (post: any) => {
  if (
    post?.tx?.value?.memo &&
    post?.tx?.value?.msg[0].type == 'bank/MsgSend' &&
    post?.tx?.value?.msg[0]?.value.amount[0].denom == 'uusd' &&
    post?.tx?.value?.msg[0]?.value.amount[0].amount / MICRO >= parseFloat(FILTER_POST_UST)
  ) {
    return true;
  }
  return false;
};

const _fetchPosts = async (offset: number, limit: number) => {
  const { data } = await axios.get(`${FCD_URL}v1/txs?offset=${offset}&limit=${limit}&account=${ADDRESS}`);
  const result = data ?? [];
  const next = result?.data?.next ?? false;
  const posts = result?.data && filterAndFormatPost(result?.data);
  return { posts, next };
};

const usePosts = (offset = 0, limit = 100) => {
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: fetchedPosts, next } = await _fetchPosts(offset, limit);
        setPosts(fetchedPosts);
        setNext(next);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [offset, limit]);
  return { posts, next, loading };
};

export default usePosts;
