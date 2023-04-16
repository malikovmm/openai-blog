import ky from 'ky';
import {
  AvailableResources,
  buildHeaders,
  buildPrefixUtl,
} from '../utils/http';
import { GetServerSidePropsContext } from 'next/types';

const client = ky.create({
  prefixUrl: buildPrefixUtl(),
});

export async function getResourceById<T>(
  resource: AvailableResources,
  ctx: GetServerSidePropsContext,
): Promise<T> {
  return await client
    .get(`${resource}/${ctx.params.id}`, {
      searchParams: ctx.query as any,
      headers: buildHeaders(ctx.req.cookies['poltavsky-sessid']),
    })
    .json<T>();
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
    .json<T>();
}
export default client;
