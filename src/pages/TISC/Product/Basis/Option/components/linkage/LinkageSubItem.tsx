import { FC } from 'react';

import { message } from 'antd';

import { useCheckPreLinkageForm } from '../hooks';
import { showImageUrl } from '@/helper/utils';
import { getLinkageConnection } from '@/services';
import { flatMap } from 'lodash';

import store, { useAppSelector } from '@/reducers';
import { SubBasisOption } from '@/types';

import { BodyText } from '@/components/Typography';

import {
  LinkedOption,
  isPairedOptionItemSelector,
  isSelectedSubItemSelector,
  linkageOptionSelector,
  setLinkageState,
  updateConnectionList,
  updatePickedOptions,
} from '../../store';
import style from '../Linkage.less';

interface Props {
  item: SubBasisOption;
  mainId: string;
}

export const LinkageSubItem: FC<Props> = ({ item, mainId }) => {
  const preLinkageForm = useCheckPreLinkageForm();

  const remove = useAppSelector(isSelectedSubItemSelector(item.id || '', preLinkageForm));

  const paired = useAppSelector(isPairedOptionItemSelector(item.id || ''));

  const connectionList = useAppSelector((state) => state.linkage.connectionList);
  const productStatus = connectionList.find((el) => el.pairId === item.id)?.status || 'inactive';

  const rootSubItemId = useAppSelector((state) => state.linkage.rootSubItemId);

  const rootMainOptionId = useAppSelector((state) => state.linkage.rootMainOptionId);
  const allowSelectOnSelectForm = !rootSubItemId || rootMainOptionId !== mainId;

  const options = useAppSelector(linkageOptionSelector);

  const handleChooseProduct = () => {
    if (!item.id) {
      message.error('Option not found');
      return;
    }

    if (allowSelectOnSelectForm || preLinkageForm) {
      store.dispatch(
        updatePickedOptions({
          pickIds: [item.id],
          remove: remove,
          preLinkageForm,
        }),
      );
    }

    if (preLinkageForm) {
      return;
    }

    /* handle select on select-form(has connection list) */
    /// has chosen root
    if (rootSubItemId) {
      /// de-select root
      if (rootSubItemId === item.id) {
        ///clear all
        store.dispatch(
          setLinkageState({
            chosenOptionIds: [],
            connectionList: [],
            originConnectionList: [],
            rootSubItemId: '',
            rootMainOptionId: '',
            rootSubItemProductId: '',
          }),
        );
        return;
      }

      if (!allowSelectOnSelectForm) {
        return;
      }

      const chosenOption = [
        {
          isPair: !!item.paired,
          pairId: item.id as string,
          productId: item.product_id,
          status: productStatus,
        },
      ];

      store.dispatch(updateConnectionList({ options: chosenOption, remove: remove }));
    } else {
      store.dispatch(
        setLinkageState({
          rootMainOptionId: mainId,
          rootSubItemProductId: item.product_id,
          /// set root is sub item
          rootSubItemId: item.id,
        }),
      );

      getLinkageConnection(item.id).then((res) => {
        if (res) {
          const linkageOptionIds = flatMap(
            options.map((el) => flatMap(el.subs.map((sub) => sub.subs))),
          ).map((el) => el.id);

          const data = res
            .map((el) => {
              if (linkageOptionIds.includes(el.pairId)) {
                return {
                  isPair: el.isPair,
                  pairId: el.pairId,
                  productId: el.productId,
                  status: el.isPair ? 'pair' : 'unpair',
                };
              }

              return undefined;
            })
            .filter(Boolean) as LinkedOption[];

          store.dispatch(
            setLinkageState({
              connectionList: data, // to render and upsert pair/unpair linkage
              originConnectionList: data, // to update connection list when select
            }),
          );
        }
      });
    }
  };

  return (
    <div
      className={`${paired && !remove && productStatus !== 'inactive' ? style.subItemPaired : ''} ${
        !remove ? '' : preLinkageForm ? style.subItemChosen : style.subItemSelected
      }`}
      onClick={handleChooseProduct}
    >
      <div
        className={style.subItem}
        style={{
          cursor: preLinkageForm ? 'pointer' : allowSelectOnSelectForm ? 'pointer' : 'default',
        }}
      >
        <img src={showImageUrl(item.image)} />
        <BodyText fontFamily="Roboto" level={6} style={{ fontWeight: 500 }}>
          {item.product_id}
        </BodyText>
      </div>
    </div>
  );
};
