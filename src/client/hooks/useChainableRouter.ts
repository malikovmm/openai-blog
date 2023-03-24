import { ChainableRouter } from '../utils/routing';
import { useRouter } from 'next/router';

export default function useChainableRouter() {
  const router = useRouter();
  return new ChainableRouter(router);
}
