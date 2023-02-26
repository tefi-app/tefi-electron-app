import { DGORA_TESTNET_CONTRACT_ADDRESS } from '@constants/index';
import { terraTestnetClient, terraClient } from '../lib/lcdClients';

export const queryClientForThreadsByCategory = async (offset = 0, limit = 10, category, isTestnet) => {
  const queryClient = isTestnet ? terraTestnetClient : terraClient;
  const result = (await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
    get_threads_by_category: {
      category,
      limit,
      offset,
    },
  })) as any;
  return result?.entries;
};

export const queryClientForRepliesByThreadId = async (offset = 0, limit = 10, threadId, isTestnet) => {
  const queryClient = isTestnet ? terraTestnetClient : terraClient;
  const result = (await queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
    get_comments_by_thread: {
      thread_id: threadId,
      limit,
      offset,
    },
  })) as any;
  return result.entries;
};

export const queryClientForThreadById = async (id, isTestnet) => {
  const queryClient = isTestnet ? terraTestnetClient : terraClient;
  return queryClient.wasm.contractQuery(DGORA_TESTNET_CONTRACT_ADDRESS, {
    get_thread_by_id: {
      id,
    },
  });
};
