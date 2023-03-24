import { AvailableResources } from '../utils/http';
import { EnqueueSnackbar, useSnackbar } from 'notistack';
import client from '../http/client';

function handleError(enqueueSnackbar: EnqueueSnackbar) {
  return (e: Error) => {
    console.error(e);
    enqueueSnackbar(e.message, { variant: 'error' });
  };
}

function handleSuccess<T>(message: string, enqueueSnackbar: EnqueueSnackbar) {
  return (res: T) => {
    enqueueSnackbar(message, { variant: 'success' });
    return res;
  };
}

export default function useResource<T>(resource: AvailableResources) {
  const { enqueueSnackbar } = useSnackbar();
  const createResource = (values: T) => {
    return client
      .post(resource, {
        json: values,
      })
      .json<T>()
      .then(
        handleSuccess<T>('Created', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const readResource = (id?: string) => {
    const url = id ? `${resource}/${id}` : resource;
    return client
      .get(url)
      .json<T>()
      .then(
        handleSuccess<T>('Success', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const updateResource = (
    id: string,
    values: Partial<T>,
  ): Promise<T | void> => {
    return client
      .patch(`${resource}/${id}`, {
        json: values,
      })
      .json<T>()
      .then(
        handleSuccess<T>('Updated', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  const deleteResource = (id: string) => {
    return client
      .delete(`${resource}/${id}`)
      .json<T>()
      .then(
        handleSuccess<T>('Deleted', enqueueSnackbar),
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
