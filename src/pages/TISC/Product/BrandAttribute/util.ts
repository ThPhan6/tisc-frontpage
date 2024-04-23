export const replaceBrandAttributeBrandId = (
  path: string,
  brandId: string,
  name: string,
  id?: string,
) =>
  id
    ? path.replace(':brandId', brandId).replace(':brandName', name).replace(':id', id)
    : path.replace(':brandId', brandId).replace(':brandName', name);
