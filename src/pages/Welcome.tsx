import CustomButton from '@/components/Button';
import { CustomRadio } from '@/components/CustomRadio';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { CustomInputEditor } from '@/components/Form/InputEditor';
import { BodyText, MainTitle, Title } from '@/components/Typography';
import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import React from 'react';
import { ReactComponent as SingleRightIcon } from '../assets/icons/single-right.svg';
import styles from './Welcome.less';

const Welcome: React.FC = () => {
  const optionsRadio = [
    { label: 'radio button 1', value: '1' },
    { label: 'radio button 2', value: '2' },
  ];
  return (
    <PageContainer>
      <Card>
        {/* Input Editor */}

        <div className={styles.mb}>
          <CustomInputEditor placeholder="Type text..." layout="horizontal" />
        </div>
        <div className={styles.mb}>
          <CustomInputEditor placeholder="Type text..." layout="vertical" />
        </div>

        {/* radio */}
        <FormGroup label="Test Radio horizontal" tooltip="How are you">
          <CustomRadio options={optionsRadio} defaultValue={optionsRadio[0]} />
        </FormGroup>
        <FormGroup label="Radio horizontal - other input" tooltip="How are you" layout="vertical">
          <CustomRadio
            direction="horizontal"
            options={optionsRadio}
            defaultValue={optionsRadio[0]}
            otherInput
          />
        </FormGroup>
        <FormGroup label="Radio vertical" tooltip="How are you" layout="vertical">
          <CustomRadio defaultValue={optionsRadio[0]} options={optionsRadio} direction="vertical" />
        </FormGroup>
        <FormGroup label="Radio vertical - other input" tooltip="How are you" layout="vertical">
          <CustomRadio
            otherInput
            defaultValue={optionsRadio[0]}
            options={optionsRadio}
            direction="vertical"
          />
        </FormGroup>
        <FormGroup label="Radio list" tooltip="How are you" layout="vertical">
          <CustomRadio options={optionsRadio} isRadioList />
        </FormGroup>
        <FormGroup label="Radio list - other input" tooltip="How are you" layout="vertical">
          <CustomRadio options={optionsRadio} isRadioList otherInput />
        </FormGroup>

        {/* input */}
        <FormGroup
          label="FormGroup horizontal"
          tooltip="How are you"
          message="message"
          messageType="error"
        >
          <CustomInput focusColor="tertiary" borderBottomColor="mono-medium" />
        </FormGroup>
        <FormGroup
          label="FormGroup vertical"
          tooltip="How are you"
          message="message"
          messageType="warning"
          layout="vertical"
        >
          <CustomInput borderBottomColor="mono-medium" focusColor="secondary" />
        </FormGroup>

        <CustomInput placeholder="input" focusColor="primary" />
        <CustomInput placeholder="input" prefix={<UserOutlined />} focusColor="primary" />
        <CustomInput placeholder="input" disabled />
        <CustomInput placeholder="input" prefix={<UserOutlined />} disabled focusColor="primary" />

        <CustomInput theme="dark" placeholder="input" focusColor="primary" />
        <CustomInput
          theme="dark"
          placeholder="input"
          prefix={<UserOutlined />}
          focusColor="primary"
        />
        <CustomInput theme="dark" disabled placeholder="input" focusColor="primary" />
        <CustomInput
          theme="dark"
          disabled
          placeholder="input"
          prefix={<UserOutlined />}
          focusColor="primary"
        />
        <FormGroup label="Textarea horizontal" tooltip="How are you" layout="vertical">
          <CustomTextArea showCount placeholder="Type text..." />
        </FormGroup>
        <FormGroup label="Textarea vertical" tooltip="How are you">
          <CustomTextArea showCount placeholder="Type text..." />
        </FormGroup>

        <div className={styles.card}>
          <CustomButton size="large">Button</CustomButton>
          <CustomButton size="large" icon={<SingleRightIcon />}>
            Button
          </CustomButton>
          <CustomButton size="large" variant="secondary">
            Button
          </CustomButton>
          <CustomButton size="large" icon={<SingleRightIcon />} variant="secondary">
            Button
          </CustomButton>
          <CustomButton size="large" variant="dashed">
            Button
          </CustomButton>
          <CustomButton size="large" icon={<SingleRightIcon />} variant="dashed">
            Button
          </CustomButton>
          <CustomButton size="large" variant="link">
            Button
          </CustomButton>
          <CustomButton size="large" icon={<SingleRightIcon />} variant="link">
            Button
          </CustomButton>
          <CustomButton size="large" variant="text">
            Button
          </CustomButton>
          <CustomButton size="large" icon={<SingleRightIcon />} variant="text">
            Button
          </CustomButton>
        </div>
        <div className={styles.card}>
          <CustomButton>Button</CustomButton>
          <CustomButton icon={<SingleRightIcon />}>Button</CustomButton>
          <CustomButton variant="secondary">Button</CustomButton>
          <CustomButton icon={<SingleRightIcon />} variant="secondary">
            Button
          </CustomButton>
          <CustomButton variant="dashed">Button</CustomButton>
          <CustomButton icon={<SingleRightIcon />} variant="dashed">
            Button
          </CustomButton>
          <CustomButton variant="link">Button</CustomButton>
          <CustomButton icon={<SingleRightIcon />} variant="link">
            Button
          </CustomButton>
          <CustomButton variant="text">Button</CustomButton>
          <CustomButton icon={<SingleRightIcon />} variant="text">
            Button
          </CustomButton>
        </div>
        <div className={styles.card}>
          <CustomButton size="small">Button</CustomButton>
          <CustomButton size="small" icon={<SingleRightIcon />}>
            Button
          </CustomButton>
          <CustomButton size="small" variant="secondary">
            Button
          </CustomButton>
          <CustomButton size="small" icon={<SingleRightIcon />} variant="secondary">
            Button
          </CustomButton>
          <CustomButton size="small" variant="dashed">
            Button
          </CustomButton>
          <CustomButton size="small" icon={<SingleRightIcon />} variant="dashed">
            Button
          </CustomButton>
          <CustomButton size="small" variant="link">
            Button
          </CustomButton>
          <CustomButton size="small" icon={<SingleRightIcon />} variant="link">
            Button
          </CustomButton>
          <CustomButton size="small" variant="text">
            Button
          </CustomButton>
          <CustomButton size="small" icon={<SingleRightIcon />} variant="text">
            Button
          </CustomButton>
        </div>
        <div className={styles.card}>
          <CustomButton properties="warning">Button</CustomButton>
          <CustomButton properties="warning" icon={<SingleRightIcon />}>
            Button
          </CustomButton>
          <CustomButton properties="warning" variant="secondary">
            Button
          </CustomButton>
          <CustomButton properties="warning" icon={<SingleRightIcon />} variant="secondary">
            Button
          </CustomButton>
          <CustomButton properties="warning" variant="dashed">
            Button
          </CustomButton>
          <CustomButton properties="warning" icon={<SingleRightIcon />} variant="dashed">
            Button
          </CustomButton>
          <CustomButton properties="warning" variant="link">
            Button
          </CustomButton>
          <CustomButton properties="warning" icon={<SingleRightIcon />} variant="link">
            Button
          </CustomButton>
          <CustomButton properties="warning" variant="text">
            Button
          </CustomButton>
          <CustomButton properties="warning" icon={<SingleRightIcon />} variant="text">
            Button
          </CustomButton>
        </div>
        <div className={styles.card}>
          <CustomButton disabled>Button</CustomButton>
          <CustomButton disabled icon={<SingleRightIcon />}>
            Button
          </CustomButton>
          <CustomButton disabled variant="secondary">
            Button
          </CustomButton>
          <CustomButton disabled icon={<SingleRightIcon />} variant="secondary">
            Button
          </CustomButton>
          <CustomButton disabled variant="dashed">
            Button
          </CustomButton>
          <CustomButton disabled icon={<SingleRightIcon />} variant="dashed">
            Button
          </CustomButton>
          <CustomButton disabled variant="link">
            Button
          </CustomButton>
          <CustomButton disabled icon={<SingleRightIcon />} variant="link">
            Button
          </CustomButton>
          <CustomButton disabled variant="text">
            Button
          </CustomButton>
          <CustomButton disabled icon={<SingleRightIcon />} variant="text">
            Button
          </CustomButton>
        </div>
        <div className={styles.card}>
          <CustomButton properties="square">A</CustomButton>
          <CustomButton properties="square" icon={<SingleRightIcon />} />
          <CustomButton properties="square" variant="secondary">
            A
          </CustomButton>
          <CustomButton properties="square" icon={<SingleRightIcon />} variant="secondary" />
          <CustomButton properties="square" variant="dashed">
            A
          </CustomButton>
          <CustomButton properties="square" icon={<SingleRightIcon />} variant="dashed" />
        </div>
        <div className={styles.card}>
          <CustomButton disabled properties="square">
            A
          </CustomButton>
          <CustomButton disabled properties="square" icon={<SingleRightIcon />} />
          <CustomButton disabled properties="square" variant="secondary">
            A
          </CustomButton>
          <CustomButton
            disabled
            properties="square"
            icon={<SingleRightIcon />}
            variant="secondary"
          />
          <CustomButton disabled properties="square" variant="dashed">
            A
          </CustomButton>
          <CustomButton disabled properties="square" icon={<SingleRightIcon />} variant="dashed" />
        </div>
        <div className={styles.card}>
          <CustomButton properties="circle">A</CustomButton>
          <CustomButton properties="circle" icon={<SingleRightIcon />} />
          <CustomButton properties="circle" variant="secondary">
            A
          </CustomButton>
          <CustomButton properties="circle" icon={<SingleRightIcon />} variant="secondary" />
          <CustomButton properties="circle" variant="dashed">
            A
          </CustomButton>
          <CustomButton properties="circle" icon={<SingleRightIcon />} variant="dashed" />
        </div>
        <div className={styles.card}>
          <CustomButton disabled properties="circle">
            A
          </CustomButton>
          <CustomButton disabled properties="circle" icon={<SingleRightIcon />} />
          <CustomButton disabled properties="circle" variant="secondary">
            A
          </CustomButton>
          <CustomButton
            disabled
            properties="circle"
            icon={<SingleRightIcon />}
            variant="secondary"
          />
          <CustomButton disabled properties="circle" variant="dashed">
            A
          </CustomButton>
          <CustomButton disabled properties="circle" icon={<SingleRightIcon />} variant="dashed" />
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i: any, index) => (
            <Title key={index} level={i}>
              Header {i}
            </Title>
          ))}
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6, 7].map((i: any, index) => (
            <BodyText fontFamily="Roboto" key={index} level={i}>
              BodyText {i}
            </BodyText>
          ))}
        </div>
        <div>
          {[1, 2, 3, 4].map((i: any, index) => (
            <MainTitle key={index} level={i}>
              MainTitle {i}
            </MainTitle>
          ))}
        </div>
        <div>
          {[1, 2, 3, 4].map((i: any, index) => (
            <BodyText key={index} level={i}>
              BodyText {i}
            </BodyText>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
