import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Col, Row } from 'antd';
import styles from './styles/index.less';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import CustomButton from '@/components/Button';
import { useState } from 'react';
import {
  BrandProfileProp,
  brandProfileValueDefault,
  websiteValueDefautl,
  WebsiteValueProp,
} from './types';
import { ItemWebsite } from './components/ItemWebsite';

const BrandProfile = () => {
  const [brandProfile, setBrandProfile] = useState<BrandProfileProp>(brandProfileValueDefault);
  // const [image, setImage] = useState('@/assets/image-logo.png');

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
  };

  const handleOnChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const newWebsite = [...brandProfile.website, websiteValueDefautl];
    setBrandProfile({ ...brandProfile, website: newWebsite });
  };

  const handleOnChangeWebsiteItem = (websiteItem: WebsiteValueProp, index: number) => {
    const newWebsiteItem = [...brandProfile.website];
    newWebsiteItem[index] = websiteItem;
    setBrandProfile({ ...brandProfile, website: newWebsiteItem });
  };

  const handleUploadImage = () => {};

  console.log(brandProfile);

  return (
    <div className={styles.content}>
      <Row>
        <Col span={12}>
          <div className={styles.formTitle}>
            <Title level={8}>BRAND PROFILE</Title>
          </div>
          <div className={styles.form}>
            <div>
              <FormGroup
                label="Brand Name"
                layout="vertical"
                required
                formClass={styles.customFormGroup}
              >
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder="registered name/trademark"
                  name="brand"
                  onChange={handleOnChange}
                />
              </FormGroup>
            </div>

            <FormGroup label="Parent Company" layout="vertical" formClass={styles.customFormGroup}>
              <CustomInput
                borderBottomColor="mono-medium"
                placeholder="holding company name, if any"
                name="company"
                onChange={handleOnChange}
              />
            </FormGroup>
            <div className={styles.logo}>
              <img src="https://9mobi.vn/cf/images/2015/03/nkk/hinh-anh-dep-1.jpg" />
            </div>
            <div className={styles.customFormLogo}>
              <FormGroup
                label="Logo/Trademark"
                layout="horizontal"
                tooltip="LOGO prefers high quality, squared shape PNG format, and less than 240 KB file size."
                required
                formClass={styles.customLabel}
                type="warning"
              ></FormGroup>
              <UploadIcon onClick={handleUploadImage} />
            </div>

            <FormGroup label="Slogan" layout="vertical" formClass={styles.customFormGroup}>
              <CustomInput
                borderBottomColor="mono-medium"
                placeholder="brand slogan, if any"
                name="slogan"
                onChange={handleOnChange}
              />
            </FormGroup>
            <FormGroup
              label="Mission & Vision"
              layout="vertical"
              required
              formClass={styles.customFormArea}
            >
              <CustomTextArea
                placeholder="maximum 250 words of brand history, story, and unique product/service offerings"
                showCount
                maxLength={250}
                borderBottomColor="mono-medium"
                name="mission"
                onChange={handleOnChangeTextArea}
              />
            </FormGroup>
            <div className={styles.website}>
              <FormGroup label="Offical Website" required formClass={styles.customText}>
                <div className={styles.rightWebsite}>
                  <BodyText level={4}>Add Web Site</BodyText>
                  <span style={{ marginLeft: '12px' }}>
                    <CustomPlusButton onClick={handleAddItem} />
                  </span>
                </div>
              </FormGroup>
              {brandProfile.website.map((item, index) => (
                <div key={index}>
                  <ItemWebsite
                    value={item}
                    onChange={() => handleOnChangeWebsiteItem(item, index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.actionButton}>
            <CustomButton size="small" buttonClass={styles.customButton}>
              Save
            </CustomButton>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BrandProfile;
