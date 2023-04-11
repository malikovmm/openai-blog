export const isImage = (file: File): boolean => {
  return file.type.split('/')[0] === 'image';
};
