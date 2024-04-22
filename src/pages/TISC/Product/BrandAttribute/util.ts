export const replaceBrandAttributeBrandId = (path: string, id: string, name: string) =>
  path.replace(':brandId', id).replace(':brandName', name);
