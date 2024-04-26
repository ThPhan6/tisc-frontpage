export const replaceBrandAttributeBrandId = (
  path: string,
  brandId: string,
  name: string,
  id?: string,
  groupId?: string,
  groupName?: string,
  subId?: string,
) => {
  const url = path.replace(':brandId', brandId).replace(':brandName', name);

  return subId
    ? url.replace(':subId', subId)
    : groupId && groupName
    ? url.replace(':groupName', groupName).replace(':groupId', groupId)
    : id
    ? url.replace(':id', id)
    : url;
};
