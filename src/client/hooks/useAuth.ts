import { EnqueueSnackbar, useSnackbar } from 'notistack';
import client from '../http/client';
import { LoginDto } from '../../server/auth/dto/login.dto';
import { KyResponse } from 'ky';
import useChainableRouter from './useChainableRouter';

function handleError(enqueueSnackbar: EnqueueSnackbar) {
  return (e: Error): Error => {
    console.error(e);
    enqueueSnackbar(e.message, { variant: 'error' });
    return e;
  };
}

export default function UseAuth() {
  const { enqueueSnackbar } = useSnackbar();
  const cRouter = useChainableRouter();

  const login = (values: LoginDto): Promise<boolean | Error> => {
    return client
      .post('auth/login', {
        json: values,
      })
      .then((res: KyResponse) => {
        if (res.ok) {
          return cRouter.create().setPath('/admin').push();
        }
        throw new Error('bad response');
      }, handleError(enqueueSnackbar));
  };
  return {
    login,
  };
}
