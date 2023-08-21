import { FC } from 'react';

import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { useCheckPreLinkageForm } from '../hooks';
import { flatMap } from 'lodash';

import store, { useAppSelector } from '@/reducers';
import { BasisOptionForm } from '@/types';

import { BodyText } from '@/components/Typography';

import {
  LinkedOption,
  getSubOptionActiveSelector,
  isAllSelectedMainOptionSelector,
  updateConnectionList,
  updatePickedOptions,
} from '../../store';
import style from '../Linkage.less';
import { LinkageSubOption } from './LinkageSubOption';

interface Props {
  mainOption: BasisOptionForm;
}

export const LinkageOptionDataset: FC<Props> = ({ mainOption }) => {
  const preLinkageForm = useCheckPreLinkageForm();

  const allSelected = useAppSelector(isAllSelectedMainOptionSelector(mainOption, preLinkageForm));
  const rootMainOptionId = useAppSelector((state) => state.linkage.rootMainOptionId);
  const isRoot = rootMainOptionId === mainOption.id;

  const disabled = !preLinkageForm && (!rootMainOptionId || isRoot || false);

  const subOpiontsActive = useAppSelector(
    getSubOptionActiveSelector(mainOption.subs, preLinkageForm),
  );
  const mainOptionIds = subOpiontsActive?.map((el) => el.main_id);

  const mainOptionActiveIds = mainOption.subs.map((el) =>
    mainOptionIds?.includes(el.main_id) ? el.main_id : '',
  );

  const handleSelectAllSubOptions = (e: CheckboxChangeEvent) => {
    const isRemove = !e.target.checked;

    const newSubOptIds = flatMap(
      mainOption.subs.map((sub) => sub.subs.map((el) => el.id as string)),
    );

    const subOpts: LinkedOption[] = flatMap(
      mainOption.subs.map((sub) =>
        sub.subs.map((el) => ({
          pairId: el.id as string,
          isPair: !!el.paired,
          productId: el.product_id,
          status: 'inactive',
        })),
      ),
    );

    store.dispatch(
      updatePickedOptions({
        pickIds: newSubOptIds,
        remove: isRemove,
        preLinkageForm,
      }),
    );

    if (!preLinkageForm) {
      store.dispatch(updateConnectionList({ options: subOpts, remove: isRemove }));
    }
  };

  // const handleCollapse = () => {
  //   const subOptIds = mainOption.subs.map((el) => el.id) as string[];

  //   store.dispatch(toggleSubOptionCollapse(subOptIds));
  // };

  return (
    <div className={style.content}>
      <Checkbox
        className={style.mainOptHeader}
        checked={allSelected}
        disabled={disabled}
        onChange={handleSelectAllSubOptions}
        // onClick={handleCollapse}
      >
        <BodyText
          fontFamily="Roboto"
          level={6}
          style={{
            fontWeight: mainOptionActiveIds.includes(mainOption.id as string) ? 500 : 300,
          }}
        >
          {mainOption.name}
        </BodyText>
      </Checkbox>
      <div className={style.mainOptContent}>
        {mainOption.subs.map((subOpt, subOptIdx) => {
          return (
            <LinkageSubOption
              key={subOptIdx}
              subOption={subOpt}
              isRoot={isRoot}
              mainId={mainOption.id || ''}
              // onChangeCollapse={handleCollapse}
            />
          );
        })}
      </div>
    </div>
  );
};
