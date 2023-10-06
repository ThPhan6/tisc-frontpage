import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { Checkbox, Collapse } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useCheckPreLinkageForm } from '../hooks';
import { flatMap } from 'lodash';

import { useAppSelector } from '@/reducers';
import { BasisOptionSubForm } from '@/types';

import { BodyText } from '@/components/Typography';

import {
  LinkedOption,
  getSubOptionActiveSelector,
  isAllSelectedSubOptionSelector,
  isLinkageSubOptionExpandSelector,
  toggleSubOptionCollapse,
  updateConnectionList,
  updatePickedOptions,
} from '../../store';
import { LinkageSubItem } from './LinkageSubItem';

interface Props {
  subOption: BasisOptionSubForm;
  isRoot: boolean;
  mainId: string;
  onChangeCollapse?: () => void;
}

export const LinkageSubOption: FC<Props> = ({ subOption, isRoot, mainId, onChangeCollapse }) => {
  const preLinkageForm = useCheckPreLinkageForm();
  const dispatch = useDispatch();

  const expandSubOptionIds = useAppSelector((state) => state.linkage.expandSubOptionIds);

  const expand = useAppSelector(isLinkageSubOptionExpandSelector(subOption.id));

  const allSelected = useAppSelector(isAllSelectedSubOptionSelector(subOption, preLinkageForm));

  const rootMainOptionId = useAppSelector((state) => state.linkage.rootMainOptionId);
  const disabled = !preLinkageForm && (!subOption.subs.length || isRoot || !rootMainOptionId);

  const subOpiontActive = useAppSelector(getSubOptionActiveSelector([subOption], preLinkageForm));

  const handleCollapse = () => {
    dispatch(toggleSubOptionCollapse([subOption.id] as string[]));
  };

  const handleSelectAllProducts = (e: CheckboxChangeEvent) => {
    e.stopPropagation();

    const isRemove = !e.target.checked;
    const newSubOpts: LinkedOption[] = flatMap(subOption.subs).map((el) => ({
      pairId: el.id,
      isPair: !!el.paired,
      productId: el.product_id,
      status: el.paired ? 'pair' : 'unpair',
    }));

    const newSubOptIds: string[] = newSubOpts.map((s) => s.pairId).filter(Boolean);

    dispatch(
      updatePickedOptions({
        pickIds: newSubOptIds,
        remove: isRemove,
        preLinkageForm,
      }),
    );

    if (!preLinkageForm) {
      dispatch(updateConnectionList({ options: newSubOpts, remove: isRemove }));
    }
  };

  const handleCollapseWhenSelectAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (allSelected || (!allSelected && expand) || !preLinkageForm) {
      e.stopPropagation();
    }
  };

  return (
    <Collapse
      expandIcon={() => null}
      collapsible={subOption.subs.length > 0 ? undefined : 'disabled'}
      onChange={handleCollapse}
      defaultActiveKey={preLinkageForm ? undefined : subOption.id}
    >
      <Collapse.Panel
        key={subOption.id}
        header={
          <div className="flex-between flex-grow header-text">
            <div className="flex-start">
              <BodyText
                fontFamily="Roboto"
                level={6}
                style={{
                  fontWeight: subOpiontActive?.some((el) => el.id === subOption.id) ? 500 : 300,
                  paddingRight: 4,
                }}
              >
                {subOption.name}
              </BodyText>
              <div className="flex-start">{expand ? <DropupIcon /> : <DropdownIcon />}</div>
            </div>
            <Checkbox
              checked={allSelected}
              onChange={handleSelectAllProducts}
              onClick={handleCollapseWhenSelectAll}
              disabled={disabled}
            />
          </div>
        }
      >
        {subOption.subs.map((sub, idx) => (
          <LinkageSubItem key={idx} item={sub} mainId={mainId} />
        ))}
      </Collapse.Panel>
    </Collapse>
  );
};
