import { memo } from 'react';

import { Input, InputProps, Space } from 'antd';

import styles from '@/components/EntryForm/styles/VolumeInput.less';
import { BodyText } from '@/components/Typography';

export interface InputFieldProps extends InputProps {
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
          <Input
            key={index}
            {...input}
            prefix={
              <BodyText level={5} fontFamily="Roboto">
                {input.prefix}
              </BodyText>
            }
          />
        ))}
      </Space.Compact>
    </div>
  );
};

export default memo(VolumeInput);
