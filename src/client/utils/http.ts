export type AvailableResources = 'category' | 'article' | 'settings';

export const buildHeaders = (sessId: string) => {
  if (!sessId) return {};
  else {
    return {
      Cookie: `poltavsky-sessid=${sessId}`,
    };
  }
};
