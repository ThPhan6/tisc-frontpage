import { FC, useState } from 'react';

import { USER_STATUS_TEXTS } from '@/constants/util';
import { Collapse, Row } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useScreen } from '@/helper/common';
import { showImageUrl } from '@/helper/utils';

import { TeamDetail } from '../type';
import { CollapsingProps } from '@/features/how-to/types';
import { ProductConsiderStatus, ProductSpecifyStatus } from '@/features/project/types/project.type';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { ResponsiveCol } from '@/components/Layout';
import { LogoIcon } from '@/components/LogoIcon';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText, Title } from '@/components/Typography';
import GeneralData from '@/features/user-group/components/GeneralData';

import styles from './Component.less';

interface ProductProps extends CollapsingProps {
  index: number;
  item: any;
  type: TabKey;
}

type TabKey = 'productConsider' | 'productSpecified' | 'project';

interface ProductAndProjectTabProps {
  type: TabKey;
  data?: {
    title: string;
    image: string | JSX.Element;
    content:
      | TeamDetail
      | {
          name: string;
          image: string;
          status?: number;
          isSpecified?: boolean;
        }[];
  }[];
  summary: {
    deleted?: number;
    consider?: number;
    unlisted?: number;
    specified?: number;
    cancelled?: number;
    team?: number;
  };
}

const ProductAndProjectHeader: FC<ProductProps> = (props) => {
  const { item, activeKey, handleActiveCollapse, index, type } = props;

  const showLogo = () => {
    if (type === 'project') {
      return <TeamIcon avatar={item.image} size={18} name={item.title} />;
    }
    if (typeof item.image === 'object' && item.image !== null) {
      return item.image;
    }
    return <LogoIcon logo={item.image} className={styles.customLogo} />;
  };

  return (
    <div className={styles.panel_header}>
      <div
        className={`${styles.panel_header__field}`}
        onClick={() => handleActiveCollapse(item.title ? index : -1)}
      >
        <div
          className={`${styles.titleIcon} ${
            String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
          }`}
        >
          {showLogo()}
          <BodyText level={5} fontFamily="Roboto" style={{ marginLeft: '12px' }}>
            {item.title}
          </BodyText>
          {type !== 'project' && (
            <BodyText level={5} fontFamily="Roboto" style={{ marginLeft: '12px' }}>
              ({item.content.length})
            </BodyText>
          )}
        </div>
        <div className={styles.icon}>
          {String(index) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
        </div>
      </div>
    </div>
  );
};

const renderContent = (type: TabKey, item: any) => {
  return (
    <div style={{ paddingBottom: '8px' }}>
      {type === 'project' ? (
        <div style={{ padding: '0 16px' }}>
          <TextForm label={'Gender'}>{item.gender === true ? 'Male' : 'Female'}</TextForm>
          <TextForm label={'Work Location'}>{item.work_location}</TextForm>
          <TextForm label={'Department'}>{item.department}</TextForm>
          <TextForm label="Position/Title">{item.position}</TextForm>
          <TextForm label="Work Email">{item.email}</TextForm>
          <FormGroup label="Work Phone" labelColor="mono-color-dark" layout="vertical">
            <PhoneInput
              codeReadOnly
              phoneNumberReadOnly
              value={{
                zoneCode: item.phone_code,
                phoneNumber: item.phone,
              }}
              containerClass={styles.phoneInputCustom}
            />
          </FormGroup>
          <FormGroup label="Work Mobile" labelColor="mono-color-dark" layout="vertical">
            <PhoneInput
              codeReadOnly
              phoneNumberReadOnly
              value={{
                zoneCode: item.phone_code,
                phoneNumber: item.mobile,
              }}
              containerClass={styles.phoneInputCustom}
            />
          </FormGroup>
          <TextForm label="Access Level">{item.access_level}</TextForm>
          <TextForm label="Status">{USER_STATUS_TEXTS[item.status]}</TextForm>
        </div>
      ) : (
        item?.map((product: any, index: number) => (
          <div
            className={`${styles.contentItem} ${
              !product.isSpecified && product.status === ProductConsiderStatus.Unlisted
                ? styles.unlisted
                : undefined
            } ${
              product.isSpecified && product.status === ProductSpecifyStatus.Cancelled
                ? styles.cancelled
                : undefined
            }`}
            key={index}
          >
            <img
              src={showImageUrl(product.image)}
              style={{ width: '24px', height: '24px', marginRight: '12px' }}
            />
            <BodyText level={5} fontFamily="Roboto">
              {product.name}
            </BodyText>
          </div>
        ))
      )}
    </div>
  );
};

export const ProductAndProjectTab: FC<ProductAndProjectTabProps> = ({ type, data, summary }) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  const { isTablet } = useScreen();
  return (
    <Row>
      <ResponsiveCol className={styles.container}>
        <div
          className={styles.content}
          style={{
            height: isTablet ? 'calc(var(--vh) * 100 - 264px)' : 'calc(var(--vh) * 100 - 288px)',
          }}
        >
          <GeneralData>
            {data?.length
              ? data?.map((item, index) => (
                  <Collapse ghost activeKey={activeKey}>
                    <Collapse.Panel
                      header={
                        <ProductAndProjectHeader
                          index={index}
                          item={item}
                          activeKey={activeKey}
                          handleActiveCollapse={handleActiveCollapse}
                          type={type}
                        />
                      }
                      key={index}
                      showArrow={false}
                      className={
                        String(index) !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']
                      }
                    >
                      {renderContent(type, item.content)}
                    </Collapse.Panel>
                  </Collapse>
                ))
              : null}
          </GeneralData>
        </div>
        <div className={styles.bottom}>
          {type === 'project' ? (
            <>
              <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
                Team Member:
              </BodyText>
              <Title level={9}>{summary.team}</Title>
            </>
          ) : (
            <>
              <div style={{ marginRight: '32px', display: 'flex', alignItems: 'center' }}>
                <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
                  {type === 'productConsider' ? 'Considered' : 'Specified'}:
                </BodyText>
                <Title level={9}>
                  {type === 'productConsider' ? summary.consider : summary.specified}
                </Title>
              </div>
              <div style={{ marginRight: '32px', display: 'flex', alignItems: 'center' }}>
                <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
                  {type === 'productConsider' ? 'Unlisted' : 'Cancelled'}:
                </BodyText>
                <Title level={9}>
                  {type === 'productConsider' ? summary.unlisted : summary.cancelled}
                </Title>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
                  Deleted:
                </BodyText>
                <Title level={9}>{summary.deleted}</Title>
              </div>
            </>
          )}
        </div>
      </ResponsiveCol>
    </Row>
  );
};
