import { AvailableResources } from '../utils/http';
import { EnqueueSnackbar, useSnackbar } from 'notistack';
import client from '../http/client';

function handleError(enqueueSnackbar: EnqueueSnackbar) {
  return (e: Error): Error => {
    console.error(e);
    enqueueSnackbar(e.message, { variant: 'error' });
    return e;
  };
}

function handleSuccess<T = void>(
  message: string,
  enqueueSnackbar: EnqueueSnackbar,
) {
  return (res: T): T => {
    enqueueSnackbar(message, { variant: 'success' });
    return res;
  };
}

export default function useResource<T>(resource: AvailableResources) {
  const { enqueueSnackbar } = useSnackbar();
  const createResource = <T>(values: T, msg?: string): Promise<T | Error> => {
    return client
      .post(resource, {
        json: values,
      })
      .json<T>()
      .then(
        handleSuccess<T>(msg ?? 'Created', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const readResource = <T>(id?: string, msg?: string): Promise<T | Error> => {
    const url = id ? `${resource}/${id}` : resource;
    return client
      .get(url)
      .json<T>()
      .then(
        handleSuccess<T>(msg ?? 'Success', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const updateResource = (
    id: string,
    values: Partial<T>,
    msg?: string,
  ): Promise<T | Error> => {
    return client
      .patch(`${resource}/${id}`, {
        json: values,
      })
      .json<T>()
      .then(
        handleSuccess<T>(msg ?? 'Updated', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const deleteResource = (id: string, msg?: string): Promise<void | Error> => {
    return client
      .delete(`${resource}/${id}`)
      .json()
      .then(
        handleSuccess<void>(msg ?? 'Deleted', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  return {
    createResource,
    readResource,
    updateResource,
    deleteResource,
  };
}
