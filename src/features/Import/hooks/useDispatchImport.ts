import { REGEX_HASH_WITH_DIGITS, isNumeric } from '@/helper/utils';
import { forEach, isNil } from 'lodash';

import { setDataImport, setErrors } from '../reducers';
import { ImportDatabaseHeader } from '@/features/Import/types/import.type';
import store, { useAppSelector } from '@/reducers';
import { InventoryImportRequest, WarehouseRequest } from '@/types';

import { generateWarehouseInStock, generateWarehouseName } from '../utils';

export const useDispatchDataImport = () => {
  const unitTypeData = useAppSelector((s) => s.summary.unitType);
  const warehouses = useAppSelector((s) => s.import.warehouses);
  const fileResult = useAppSelector((s) => s.import.fileResult);
  const headerMatching = useAppSelector((s) => s.import.headerMatching);

  const warehouseBusinessNames = warehouses
    ?.map((warehouse) => warehouse?.business_name?.toLowerCase())
    .filter(Boolean) as string[];

  const matchingData = (header?: Record<string, string> | null) => {
    const newHeader = header ?? headerMatching;

    return fileResult?.data
      .map((item) => {
        const newData: any = {};

        forEach(item, (value, key) => {
          if (!isNil(newHeader?.[key])) {
            newData[newHeader[key]] = value;
          }
        });

        return newData;
      })
      .filter((item) => item?.sku !== '');
  };

  const validateDataImport = (header?: Record<string, any> | null) => {
    const newData = matchingData(header);

    if (!newData?.length) return { error: {}, validated: false };

    const newError: Record<string, any[]> = {};
    const skus: string[] = [];
    const descriptions: string[] = [];

    let hasUnitPrice = false;
    const unitPrices: string[] = [];

    let hasUnitType = false;
    const unitTypes: string[] = [];

    let hasBackOrder = false;
    const backOrders: string[] = [];
    let hasOnOrder = false;
    const onOrders: string[] = [];

    const warehousesNames: (string | undefined)[] = [];
    const warehousesInStocks: (string | undefined)[] = [];

    newData.forEach((data) => {
      forEach(data, (value, key) => {
        if (key === ImportDatabaseHeader.PRODUCT_ID) {
          skus.push(value);
        }

        if (key === ImportDatabaseHeader.UNIT_PRICE) {
          hasUnitPrice = true;

          if (isNumeric(value)) {
            unitPrices.push(value);
          } else {
            const unitPrice: string = value?.split(' ')?.[1];

            if (isNumeric(unitPrice)) {
              unitPrices.push(unitPrice);
            }
          }
        }

        if (key === ImportDatabaseHeader.UNIT_TYPE) {
          hasUnitType = true;

          const unitType = unitTypeData.find(
            (el) =>
              el.name.toLowerCase() === value.toLowerCase() ||
              el.code.toLowerCase() === value.toLowerCase(),
          );

          if (unitType) {
            unitTypes.push(value);
          }
        }

        if (key === ImportDatabaseHeader.DESCRIPTION) {
          descriptions.push(value);
        }

        if (key === ImportDatabaseHeader.BACK_ORDER) {
          hasBackOrder = true;

          if (isNumeric(value) && Number(value) >= 0) {
            backOrders.push(value);
          }
        }

        if (key === ImportDatabaseHeader.ON_ORDER) {
          hasOnOrder = true;

          if (isNumeric(value) && Number(value) >= 0) {
            onOrders.push(value);
          }
        }

        warehouses?.forEach((_warehouse, wsIdx) => {
          const { key: warehouseKey } = generateWarehouseName(wsIdx + 1);
          const { key: warehouseInStockKey } = generateWarehouseInStock(wsIdx + 1);

          if (key.trim() === warehouseKey) {
            if (isNil(value) || value === '') {
              warehousesNames.push('');
            } else {
              if (warehouseBusinessNames?.includes(String(value).toLowerCase())) {
                warehousesNames.push(value);
              } else {
                warehousesNames.push(undefined);
                newError[warehouseKey] = [`${warehouseKey} is invalid.`];
              }
            }
          }

          if (key.trim() === warehouseInStockKey) {
            if (isNil(value) || value === '') {
              warehousesInStocks.push('0');
            } else if (isNumeric(value) && Number(value) >= 0) {
              warehousesInStocks.push(value);
            } else {
              warehousesInStocks.push(undefined);
              newError[warehouseInStockKey] = [`${warehouseInStockKey} in stock is invalid.`];
            }
          }
        });
      });
    });

    if (skus.length !== newData.length) {
      newError[ImportDatabaseHeader.PRODUCT_ID] = ['SKU is required.'];
    }

    if (unitPrices.length !== newData.length && hasUnitPrice) {
      newError[ImportDatabaseHeader.UNIT_PRICE] = ['Unit price is required.'];
    }

    if (unitTypes.length !== newData.length && hasUnitType) {
      newError[ImportDatabaseHeader.UNIT_TYPE] = ['Unit type is required.'];
    }

    if (backOrders.length !== newData.length && hasBackOrder) {
      newError[ImportDatabaseHeader.BACK_ORDER] = ['Back order is invalid.'];
    }

    if (onOrders.length !== newData.length && hasOnOrder) {
      newError[ImportDatabaseHeader.ON_ORDER] = ['On order is invalid.'];
    }

    if (descriptions.length !== newData.length && descriptions.length !== 0) {
      newError[ImportDatabaseHeader.DESCRIPTION] = ['Description is invalid.'];
    }

    store.dispatch(setErrors(newError));

    return {
      error: newError,
      data: newData,
      validated:
        skus.length === newData.length &&
        (unitPrices.length === 0 || unitPrices.length === newData.length) &&
        (unitTypes.length === 0 || unitTypes.length === newData.length) &&
        (backOrders.length === 0 || backOrders.length === newData.length) &&
        (onOrders.length === 0 || onOrders.length === newData.length) &&
        (descriptions.length === 0 || descriptions.length === newData.length) &&
        (warehousesNames.length === 0 || warehousesNames.length === newData.length) &&
        (warehousesInStocks.length === 0 || warehousesInStocks.length === newData.length),
    };
  };

  const getWarehouses = (inventory: any) => {
    const warehouseMatch: Pick<WarehouseRequest, 'index' | 'quantity'>[] = [];

    warehouseBusinessNames?.forEach((_warehouseName, wsIdx) => {
      const { key: warehouseKey } = generateWarehouseName(wsIdx + 1);
      const { key: warehouseInStockKey } = generateWarehouseInStock(wsIdx + 1);

      /// don't choose warehouse in stock
      if (!(warehouseInStockKey in inventory)) return;

      /// don't choose warehouse name
      if (!(warehouseKey in inventory) && !warehouseMatch.length) {
        Object.keys(inventory).forEach((key) => {
          const indexMatch = key.match(REGEX_HASH_WITH_DIGITS);

          if (!indexMatch) return;

          const index = parseInt(indexMatch[1], 10);
          const { key: inStockKey } = generateWarehouseInStock(index);

          if (!isNumeric(inventory[inStockKey])) return;

          warehouseMatch.push({
            index: index - 1,
            quantity: parseInt(inventory[inStockKey], 10),
          });
        });

        return;
      }

      const warehouseIndex = warehouseBusinessNames?.findIndex(
        (wsName) => wsName.toLowerCase() === inventory?.[warehouseKey]?.toLowerCase(),
      );

      if (warehouseIndex < 0 || !isNumeric(inventory[warehouseInStockKey])) return;

      warehouseMatch.push({
        index: warehouseIndex,
        quantity: parseInt(inventory[warehouseInStockKey], 10),
      });
    });

    return warehouseMatch;
  };

  const dispatchImportData = (header?: Record<string, string> | null) => {
    const dataMatching = validateDataImport(header);

    if (!dataMatching?.data?.length) return;

    store.dispatch(
      setDataImport(
        dataMatching.data.map((item: any) => {
          const newItem: Partial<Omit<InventoryImportRequest, 'inventory_category_id'>> = {};

          if (!isNil(item?.sku)) {
            newItem.sku = item.sku.toString().trim();
          }

          if (!isNil(item?.description)) {
            newItem.description = item.description.toString().trim();
          }

          if (isNumeric(item?.unit_price)) {
            newItem.unit_price = Number(item.unit_price);
          } else {
            const unitPrice: string = item?.unit_price?.split(' ')?.[1];

            if (isNumeric(unitPrice)) {
              newItem.unit_price = Number(unitPrice);
            }
          }

          if (isNumeric(item?.back_order as any)) {
            newItem.back_order = Number(item.back_order);
          }

          if (isNumeric(item?.on_order as any)) {
            newItem.on_order = Number(item.on_order);
          }

          const unitType = unitTypeData.find(
            (el) =>
              el?.name?.toLowerCase() === item?.unit_type?.toLowerCase() ||
              el?.code?.toLowerCase() === item?.unit_type?.toLowerCase(),
          )?.id;

          if (unitType) {
            newItem.unit_type = unitType;
          }

          const warehouseMatch: WarehouseRequest[] = getWarehouses(item);

          if (warehouseMatch.length) {
            newItem.warehouses = warehouseMatch;
          }

          return newItem;
        }),
      ),
    );
  };

  return {
    validateDataImport,
    dispatchImportData,
  };
};
