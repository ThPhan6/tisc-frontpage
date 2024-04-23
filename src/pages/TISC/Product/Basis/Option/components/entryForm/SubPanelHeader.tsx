import { FC, useContext } from 'react';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-18.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/tabs-icon-18.svg';

import {
  FormGroupContext,
  FormOptionGroupHeaderContext,
  useCheckBasicOptionForm,
} from '../../../hook';
import { cloneDeep } from 'lodash';

import { BasisOptionSubForm, SubBasisOption } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';

import styles from '../OptionItem.less';

const inputProps = {
  size: 'small',
  autoWidth: true,
  style: { maxWidth: '100%' },
} as any;

interface SubPanelHeaderProps {
  subOption: BasisOptionSubForm;
  handleChangeSubItem: (changedSubs: BasisOptionSubForm) => void;
  handleDeleteSubOption: () => void;
  handleCopySubOtionItem?: () => void;
  dragIcon: JSX.Element;
}

export const SubPanelHeader: FC<SubPanelHeaderProps> = ({
  dragIcon,
  subOption,
  handleChangeSubItem,
  handleCopySubOtionItem,
  handleDeleteSubOption,
}) => {
  const isBasicOption = useCheckBasicOptionForm();
  const placeholder = isBasicOption ? 'sub option name' : 'sub preset name';
  const { mode } = useContext(FormOptionGroupHeaderContext);
  const { collapse, setCollapse } = useContext(FormGroupContext);

  const addNewSubOptionItem = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();

    if (mode !== 'list') {
      return;
    }

    const newCollapse = cloneDeep(collapse);
    setCollapse({ ...newCollapse, [subOption.id]: true });

    /// default open option item list when add new
    /// add new sub option item
    const newSubOptionItem: Partial<SubBasisOption> = {
      value_1: '',
      value_2: '',
      unit_2: '',
      unit_1: '',
      product_id: '',
      paired: 0,
    };

    handleChangeSubItem({
      ...subOption,
      count: subOption.subs.length + 1,
      subs: [...subOption.subs, newSubOptionItem as any],
    });
  };

  const handleChangeSubOptionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    /// change subOption name
    handleChangeSubItem({
      ...subOption,
      name: e.target.value,
    });
  };

  return (
    <div className={styles.panel_header}>
      <div className={styles.panel_header__field}>
        <div className={styles.panel_header__field_left}>
          <div
            className="flex-start"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ cursor: 'default' }}
          >
            {dragIcon}
            <CustomInput
              placeholder={placeholder}
              name="name"
              containerClass="sub-option-input"
              onChange={handleChangeSubOptionName}
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={subOption.name}
              defaultWidth={subOption.name ? 30 : placeholder.length * 8}
              {...inputProps}
            />
          </div>
          <div className={styles.panel_header__field_title}>
            <ArrowIcon
              className={styles.panel_header__field_title_icon}
              style={{
                transform: `rotate(${collapse?.[subOption.id] ? '180' : '0'}deg)`,
              }}
            />
          </div>
        </div>
        <div
          className={`${styles.panel_header__right} ${mode === 'card' ? styles.disabledIcon : ''}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex-start icons">
            <PlusIcon className={styles.panel_header__field_add} onClick={addNewSubOptionItem} />
            {isBasicOption ? (
              <CopyIcon
                className={styles.panel_header__field_add}
                onClick={mode === 'list' ? handleCopySubOtionItem : undefined}
              />
            ) : null}
          </div>
          <ActionDeleteIcon
            className={styles.panel_header__input_delete_icon}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSubOption();
            }}
          />
        </div>
      </div>
    </div>
  );
};
