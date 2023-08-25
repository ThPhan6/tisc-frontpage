import React, { FC, useContext } from 'react';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/tabs-icon-18.svg';

import { FormOptionGroupContext, FormOptionGroupHeaderContext } from '../../../hook';
import { cloneDeep, uniqueId } from 'lodash';

import { BasisOptionSubForm, MainBasisOptionSubForm } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';

import styles from '../OptionItem.less';

const inputProps = {
  size: 'small',
  autoWidth: true,
  style: { maxWidth: '100%' },
} as any;

interface MainPanelHeaderProps {
  mainOption: MainBasisOptionSubForm;
  handleChangeMainSubItem: (changedSubs: MainBasisOptionSubForm) => void;
  handleDeleteMainSubOption: () => void;
  handleCopyMainOption: (mainOption: MainBasisOptionSubForm) => void;
}

export const MainPanelHeader: FC<MainPanelHeaderProps> = ({
  mainOption,
  handleChangeMainSubItem,
  handleCopyMainOption,
  handleDeleteMainSubOption,
}) => {
  const { mode } = useContext(FormOptionGroupHeaderContext);
  const { collapse, setCollapse } = useContext(FormOptionGroupContext);

  const handleChangeMainOptionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    /// change subOption name
    handleChangeMainSubItem({
      ...mainOption,
      name: e.target.value,
    });
  };

  const addNewMainOptionItem = () => {
    const newCollapse = cloneDeep(collapse);
    setCollapse({ ...newCollapse, [mainOption.id]: true });

    /// default open option item list when add new
    /// add new sub option item
    const newId = uniqueId('new-');

    const newData: Partial<BasisOptionSubForm> = {
      id: newId,
      name: '',
      main_id: mainOption.id,
      count: 0,
      subs: [],
    };

    handleChangeMainSubItem({
      ...mainOption,
      count: mainOption.subs.length + 1,
      subs: [...mainOption.subs, newData as any],
    });
  };

  const copyMainOption = () => {
    if (mode === 'list') {
      handleCopyMainOption({
        ...mainOption,
        name: `${mainOption.name} copy`,
      });
    }
  };

  return (
    <div className={styles.main_panel_header}>
      <div className={styles.main_panel_header__left}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ cursor: 'default' }}
        >
          <CustomInput
            placeholder="main option name"
            name="name"
            containerClass="main-option-input"
            onChange={handleChangeMainOptionName}
            value={mainOption.name}
            defaultWidth={mainOption.name ? 30 : 114}
            {...inputProps}
          />
        </div>
        <div className="flex-start">
          <ArrowIcon
            className={styles.main_panel_header__left_icon}
            style={{
              transform: `rotate(${collapse?.[mainOption.id] ? '180' : '0'}deg)`,
            }}
          />
        </div>
      </div>
      <div
        className={`${styles.main_panel_header__icon} ${
          mode === 'card' ? styles.disabledIcon : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex-start icons">
          <CirclePlusIcon
            className={styles.main_panel_header__icon_add}
            onClick={mode === 'list' ? addNewMainOptionItem : undefined}
          />
          <CopyIcon className={styles.main_panel_header__icon_add} onClick={copyMainOption} />
        </div>
        <ActionDeleteIcon
          className={styles.main_panel_header__icon_delete}
          onClick={handleDeleteMainSubOption}
        />
      </div>
    </div>
  );
};
