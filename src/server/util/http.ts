import { Response } from 'express';
export function setSession(res: Response, sessionId: string, expireAt: Date) {
  res.cookie('poltavsky-sessid', sessionId, {
    httpOnly: true,
    sameSite: true,
    expires: expireAt,
  });
}
