import { EnqueueSnackbar, useSnackbar } from 'notistack';
import client from '../http/client';

const imagePath = 'image';

interface ImageCreateResponse {
  fileName: string;
}

function handleError(enqueueSnackbar: EnqueueSnackbar) {
  return (e: Error): Error => {
    console.error(e);
    enqueueSnackbar(e.message, { variant: 'error' });
    return e;
  };
}

function handleSuccess(message: string, enqueueSnackbar: EnqueueSnackbar) {
  return (res: ImageCreateResponse): string => {
    enqueueSnackbar(message, { variant: 'success' });
    console.log('res.fileName', res.fileName);
    return res.fileName;
  };
}

export default function useImage() {
  const { enqueueSnackbar } = useSnackbar();
  const saveImage = (file: File, msg?: string): Promise<string | Error> => {
    const formData = new FormData();
    formData.append('file', file);
    return client
      .post(imagePath, {
        body: formData,
        timeout: 60000,
      })
      .json<ImageCreateResponse>()
      .then(
        handleSuccess(msg ?? 'Saved', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };

  const findImage = (prompt: string, msg?: string): Promise<string | Error> => {
    return client
      .get(`${imagePath}/search`, {
        timeout: 60000,
        searchParams: {
          q: prompt,
        },
      })
      .json<ImageCreateResponse>()
      .then(
        handleSuccess(msg ?? 'Saved', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  return { saveImage, findImage };
}
