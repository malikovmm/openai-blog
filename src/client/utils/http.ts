export type AvailableResources =
  | 'category'
  | 'article'
  | 'article/ai'
  | 'settings';

export const buildHeaders = (sessId: string) => {
  if (!sessId) return {};
  else {
    return {
      Cookie: `poltavsky-sessid=${sessId}`,
    };
  }
};

export const buildImageUrl = (fileName: string): string => {
  return `${buildPrefixUtl()}/images/${fileName}`;
};

export const buildPrefixUtl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
  if (port) {
    return `${url}:${port}`;
  }
  return url;
};
