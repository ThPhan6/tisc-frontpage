import { memo } from 'react';

import { Space } from 'antd';

import { CustomInputProps } from '@/components/Form/types';

import styles from '@/components/EntryForm/styles/VolumeInput.less';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

export interface InputFieldProps extends CustomInputProps {
  placeholder?: string;
  prefix?: string;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}

interface VolumeInputProps {
  label: string;
  inputs: InputFieldProps[];
  containerClass?: string;
  containerStyle?: React.CSSProperties;
}

const VolumeInput = ({ label, inputs, containerClass = '', containerStyle }: VolumeInputProps) => {
  return (
    <div className={`${styles.volume_discount_input} ${containerClass}`} style={containerStyle}>
      <BodyText level={3}>{label}</BodyText>
      <Space.Compact>
        {inputs.map((input, index) => (
          <CustomInput
            key={index}
            {...input}
            prefix={
              <BodyText level={5} fontFamily="Roboto">
                {input.prefix}
              </BodyText>
            }
            type="number"
            max={100}
          />
        ))}
      </Space.Compact>
    </div>
  );
};

export default memo(VolumeInput);
