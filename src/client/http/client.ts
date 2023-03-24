import ky from 'ky';
import { AvailableResources } from '../utils/http';

const buildPrefixUtl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
  if (port) {
    return `${url}:${port}`;
  }
  return url;
};

const client = ky.create({
  prefixUrl: buildPrefixUtl(),
});

export async function getPaginatedResource<T>(
  resource: AvailableResources,
  query?: any,
) {
  return await client
    .get(resource, {
      searchParams: query as any,
    })
    .json()
    .then(
      (response: Omit<T, 'error'>) => {
        return { error: null, response };
      },
      (error: Error) => {
        return { error, response: null };
      },
    );
}

export async function getResourceById<T>(
  resource: AvailableResources,
  id: string,
  query?: any,
) {
  return await client
    .get(`${resource}/${id}`, {
      searchParams: query as any,
    })
    .json()
    .then(
      (response: Omit<T, 'error'>) => {
        return { error: null, response };
      },
      (error: Error) => {
        return { error, response: null };
      },
    );
}

export default client;
