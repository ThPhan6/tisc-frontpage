import type { CSSProperties, FC } from 'react';

import { TextAreaProps } from 'antd/lib/input';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';

import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import { CustomTextArea } from '../Form/CustomTextArea';
import styles from './styles/DynamicFormInput.less';

export interface DynamicFormInputData {
  title: string;
  value: string;
}
export const DEFAULT_FORM_INPUT: DynamicFormInputData = {
  title: '',
  value: '',
};

interface DynamicFormInputProps extends TextAreaProps {
  data?: DynamicFormInputData[];
  setData?: (data: DynamicFormInputData[]) => void;
  titlePlaceholder?: string;
  valuePlaceholder?: string;
  maxTitleWords?: number;
  maxValueWords?: number;
  titleClass?: string;
  valueClass?: string;
  titleStyles?: CSSProperties;
  valueStyles?: CSSProperties;
  additionalDynamicFormAddMoreClass?: string;
}

const DynamicFormInput: FC<DynamicFormInputProps> = ({
  data,
  setData,
  titlePlaceholder,
  valuePlaceholder,
  titleClass = '',
  valueClass = '',
  titleStyles,
  valueStyles,
  maxTitleWords,
  maxValueWords,
  additionalDynamicFormAddMoreClass = '',
  ...props
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    <>
      <div
        className={`${styles.dynamicFormAddMore} ${additionalDynamicFormAddMoreClass}`}
        onClick={addMoreData}
      >
        <MainTitle level={4} customClass="add-attribute-text">
          Add Content
        </MainTitle>
        <CustomPlusButton size={18} />
      </div>
      {data?.map((item, index) => {
        return (
          <div className={`${styles.dynamicFormInput} dynamic-wrapper`} key={index}>
            <div className="flex-input-with-icon">
              <CustomTextArea
                customClass={`${styles.customTextArea} ${titleClass}`}
                styles={titleStyles}
                maxWords={maxTitleWords}
                placeholder={titlePlaceholder}
                value={item.title}
                onChange={(e) => onChangeText(e, index, 'title')}
                onClick={(e) => e.stopPropagation()}
                autoResize
                {...props}
              />
              <DeleteIcon onClick={() => onDelete(index)} className="delete-action-input-group" />
            </div>
            <CustomTextArea
              customClass={`${styles.customTextArea} ${valueClass}`}
              styles={valueStyles}
              maxWords={maxValueWords}
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => onChangeText(e, index, 'value')}
              onClick={(e) => e.stopPropagation()}
              autoResize
              {...props}
            />
          </div>
        );
      })}
    </>
  );
};
export default DynamicFormInput;
