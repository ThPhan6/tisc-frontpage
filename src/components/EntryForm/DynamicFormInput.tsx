import type { FC } from 'react';

import type { InputProps } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';

import { CustomInput } from '@/components/Form/CustomInput';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import styles from './styles/DynamicFormInput.less';

interface DynamicFormInputData {
  title: string;
  value: string;
}
export const DEFAULT_FORM_INPUT: DynamicFormInputData = {
  title: '',
  value: '',
};

interface DynamicFormInputProps extends InputProps {
  data?: DynamicFormInputData[];
  setData?: (data: DynamicFormInputData[]) => void;
  fontLevel?: 1 | 2 | 3 | 4 | 5;
  titlePlaceholder?: string;
  valuePlaceholder?: string;
  maxTitleWords?: number;
  maxValueWords?: number;
}

const DynamicFormInput: FC<DynamicFormInputProps> = ({
  data,
  setData,
  fontLevel,
  titlePlaceholder,
  valuePlaceholder,
  maxTitleWords,
  maxValueWords,
}) => {
  const addMoreData = () => {
    if (setData && data) {
      setData([...data, DEFAULT_FORM_INPUT]);
    }
  };
  const onDelete = (index: number) => {
    if (setData && data) {
      const newData = data.filter((_item, key) => key != index);
      setData(newData);
    }
  };
  const onChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'title' | 'value',
  ) => {
    const text = e.target.value;
    const textLength = text.split(' ').length;
    if (type === 'title') {
      if (maxTitleWords) {
        if (maxTitleWords < textLength) {
          return;
        }
      }
    }
    if (type === 'value') {
      if (maxValueWords) {
        if (maxValueWords < textLength) {
          return;
        }
      }
    }

    if (setData && data) {
      const newData = [...data];
      newData[index][type] = text;
      setData(newData);
    }
  };

  return (
    <div>
      <div className={styles.dynamicFormAddMore} onClick={addMoreData}>
        <MainTitle level={4} customClass="add-attribute-text">
          Add Content
        </MainTitle>
        <CustomPlusButton size={18} />
      </div>
      {data?.map((item, index) => (
        <div className={`${styles.dynamicFormInput} dynamic-wrapper`} key={index}>
          <div className="flex-input-with-icon">
            <CustomInput
              fontLevel={fontLevel ?? 5}
              className="dynamic-title-box"
              value={item.title}
              onChange={(e) => onChangeText(e, index, 'title')}
              onClick={(e) => e.stopPropagation()}
              placeholder={titlePlaceholder}
            />
            <DeleteIcon onClick={() => onDelete(index)} className="delete-action-input-group" />
          </div>
          <CustomInput
            fontLevel={fontLevel ? ((fontLevel + 1) as 6) : 6}
            className="dynamic-value-box"
            value={item.value}
            onChange={(e) => onChangeText(e, index, 'value')}
            onClick={(e) => e.stopPropagation()}
            placeholder={valuePlaceholder}
          />
        </div>
      ))}
    </div>
  );
};
export default DynamicFormInput;
