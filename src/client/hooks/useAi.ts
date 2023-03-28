import client from '../http/client';
import { CreateArticleAiDto } from '../../server/article/dto/create-article-ai.dto';
import { EnqueueSnackbar, useSnackbar } from 'notistack';
import { Article } from '../../server/article/entities/article.entity';
import { useState } from 'react';

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

export default function UseAi() {
  const { enqueueSnackbar } = useSnackbar();
  const [httpStatus, setHttpStatus] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retry, setRetry] = useState(null);
  const [message, setMessage] = useState('');
  const createArticle = (dto: CreateArticleAiDto) => {
    return client
      .post(`article/ai`, {
        json: dto,
        timeout: 600000, // 10 min
        hooks: {
          beforeRetry: [
            (options) => {
              setRetry(options.retryCount);
              setHttpStatus(429);
              setMessage(options.error.message);
            },
          ],
        },
      })
      .json<Article>()
      .then(
        (res) => {
          setSuccess(true);
          enqueueSnackbar('Success', { variant: 'success' });
          return res;
        },
        // handleSuccess<Article>(msg ?? 'Updated', enqueueSnackbar),
        handleError(enqueueSnackbar),
      );
  };
  return {
    httpStatus,
    success,
    retry,
    message,
    createArticle,
  };
}
