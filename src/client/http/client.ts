import ky from 'ky';
import { AvailableResources, buildHeaders } from '../utils/http';
import { GetServerSidePropsContext } from 'next/types';

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
  ctx: GetServerSidePropsContext,
) {
  return await client
    .get(resource, {
      searchParams: ctx.query as any,
      headers: buildHeaders(ctx.req.cookies['poltavsky-sessid']),
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
  ctx: GetServerSidePropsContext,
) {
  return await client
    .get(`${resource}/${ctx.params.id}`, {
      searchParams: ctx.query as any,
      headers: buildHeaders(ctx.req.cookies['poltavsky-sessid']),
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

export async function getResource<T>(
  resource: AvailableResources,
  ctx: GetServerSidePropsContext,
) {
  return await client
    .get(`${resource}`, {
      searchParams: ctx.query as any,
      headers: buildHeaders(ctx.req.cookies['poltavsky-sessid']),
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
export async function doGet(path: string, ctx: GetServerSidePropsContext) {
  return await client
    .get(`${path}`, {
      searchParams: ctx.query as any,
      headers: buildHeaders(ctx.req.cookies['poltavsky-sessid']),
    })
    .json()
    .then(
      (response: Omit<void, 'error'>) => {
        return { error: null, response };
      },
      (error: Error) => {
        console.log('error', error);
        return { error, response: null };
      },
    );
}

export default client;
