import { FCD_URL, MICRO } from '@terra-utilities/index';
import { formatTxData } from '../../../transactions/fetchTx';
const { curly } = require('node-libcurl');
const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FILTER_POST_UST = '0.1';

const checkValidPost = (post) => {
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

const filterAndFormatPost = (data) => {
  const transactions = data.txs;
  const result = transactions.reduce((postList, post) => {
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

const _getPost = async (offset = 0, limit = 100) => {
  try {
    const { data } = await curly.get(`${FCD_URL}/v1/txs?offset=${offset}&limit=${limit}&account=${ADDRESS}`);
    return { ...data };
  } catch (err) {
    return { err };
  }
};

export const getPost = async (offset = 0, limit = 100) => {
  try {
    const result = await _getPost(offset, limit);
    const postRequest = result ?? [];
    const next = postRequest?.data?.next ?? false;
    const posts = postRequest?.data && filterAndFormatPost(postRequest?.data);
    return { posts, next };
  } catch (err) {
    return { posts: [], next: false };
  }
};

export default async function handler(req, res) {
  try {
    const posts = await getPost();
    res.status(200).json(posts ?? []);
  } catch (err) {
    res.status(500).json([]);
  }
}
