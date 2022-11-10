import { useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { pushTo } from '@/helper/history';

import { ServiceHeader } from './components/ServiceHeader';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './index.less';
import moment from 'moment';

const RevenueCreatePage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(0);
  const dueDate = moment(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');

  return (
    <ServiceHeader>
      <div className={styles.serviceForm}>
        <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
        <EntryFormWrapper
          handleCancel={() => pushTo(PATH.tiscRevenueService)}
          contentSubmitButton="Bill"
          customClass={styles.customForm}>
          <FormGroup
            label="Service type"
            required
            layout="vertical"
            style={{ marginBottom: '16px' }}>
            <CollapseRadioList options={[]} placeholder={'select from the list'} otherInput />
          </FormGroup>
          <InputGroup
            label="Brand Company"
            required
            fontLevel={3}
            value={''}
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            rightIcon
            onRightIconClick={() => {
              setVisible(true);
            }}
            placeholder="select from the list"
          />
          <InputGroup label="Ordered By" required fontLevel={3} hasBoxShadow hasPadding hasHeight />
          <FormGroup
            label="Chargeable Rate / Total Quantity / Sales Tax"
            layout="vertical"
            style={{ marginBottom: '16px' }}>
            <Row gutter={[24, 8]}>
              <Col span={8}>
                <div className={styles.item}>
                  <MainTitle level={4} style={{ width: '80%' }}>
                    Unit Rate
                  </MainTitle>
                  <CustomInput placeholder="0.00" />
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.item}>
                  <MainTitle level={4} style={{ width: '80%' }}>
                    Quantity
                  </MainTitle>
                  <CustomInput value={quantity} />
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <DropupIcon onClick={() => setQuantity(quantity + 1)} />
                    <DropdownIcon
                      onClick={() => {
                        if (quantity === 0) return;
                        setQuantity(quantity - 1);
                      }}
                    />
                  </span>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.item}>
                  <MainTitle level={4} style={{ width: '50%' }}>
                    Tax (%)
                  </MainTitle>
                  <CustomInput placeholder="0" />
                </div>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup label="Billing Amount" layout="vertical" formClass={styles.borderBottom}>
            <Row gutter={[24, 8]}>
              <Col span={16}></Col>
              <Col span={8}>
                <div className={styles.bill}>
                  <Title level={8}>US$</Title>
                  <Title level={8}>0.00</Title>
                </div>
              </Col>
            </Row>
          </FormGroup>
          <InputGroup
            label="Due Date"
            fontLevel={3}
            hasBoxShadow
            hasPadding
            hasHeight
            value={dueDate}
            className={styles.customInput}
          />
          <InputGroup
            label="Remark"
            fontLevel={3}
            hasBoxShadow
            hasPadding
            hasHeight
            placeholder="type text"
            colorPrimaryDark
          />
        </EntryFormWrapper>
        <Popover title="SELECT COMPANY" visible={visible} setVisible={setVisible}>
          <FormGroup label={'Brand Company'} layout="vertical" style={{ marginBottom: '16px' }}>
            <CollapseRadioList options={[]} placeholder={'select brand company'} otherInput />
          </FormGroup>
          <BodyText level={3}>Order By</BodyText>
        </Popover>
      </div>
    </ServiceHeader>
  );
};
export default RevenueCreatePage;
