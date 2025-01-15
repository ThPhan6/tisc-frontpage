export const calculateOutOfStock = (totalStock: number, onOrder: number) => {
  const outOfStock = onOrder - totalStock;
  return outOfStock <= 0 ? 0 : -outOfStock;
};
