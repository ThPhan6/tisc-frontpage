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
import { getBase64 } from '@/helper/utils';
import Logo from '@/assets/image-logo.png';
import { useBoolean } from '@/helper/hook';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';

const BrandProfile = () => {
  const [brandProfile, setBrandProfile] = useState<BrandProfileProp>(brandProfileValueDefault);
  const submitButtonStatus = useBoolean(false);

  const onSubmitForm = () => {
    submitButtonStatus.setValue(true);
  };

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
    if (e.target.files) {
      const file = e.target.files![0];
      getBase64(file)
        .then((base64Image) => {
          setBrandProfile({ ...brandProfile, image: base64Image });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddWebsiteItem = () => {
    const newWebsiteItem = [...brandProfile.website, websiteValueDefautl];
    setBrandProfile({ ...brandProfile, website: newWebsiteItem });
  };

  const handleOnChangeWebsiteItem = (websiteItem: WebsiteValueProp, index: number) => {
    const newWebsiteItem = [...brandProfile.website];
    newWebsiteItem[index] = websiteItem;
    setBrandProfile({ ...brandProfile, website: newWebsiteItem });
  };

  return (
    <div className={styles.content}>
      <Row>
        <Col span={12}>
          <div className={styles.container}>
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
                    onChange={handleOnChangeValueForm}
                    value={brandProfile.brand}
                  />
                </FormGroup>
              </div>
              <FormGroup
                label="Parent Company"
                layout="vertical"
                formClass={styles.customFormGroup}
              >
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder="holding company name, if any"
                  name="company"
                  onChange={handleOnChangeValueForm}
                  value={brandProfile.company}
                />
              </FormGroup>
              <div className={styles.logo}>
                <img src={brandProfile.image ? brandProfile.image : Logo} />
              </div>
              <div className={styles.customFormLogo}>
                <FormGroup
                  label="Logo/Trademark"
                  layout="horizontal"
                  tooltip="LOGO prefers high quality, squared shape PNG format, and less than 240 KB file size."
                  required
                  formClass={styles.customLabel}
                  iconTooltip={<WarningIcon className={styles.customWarningIcon} />}
                ></FormGroup>
                <div className={styles.customIcon}>
                  <label htmlFor="image">
                    <UploadIcon style={{ cursor: 'pointer' }} />
                  </label>
                  <div>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="image"
                      accept=".png"
                      onChange={handleOnChangeValueForm}
                    />
                  </div>
                </div>
              </div>
              <FormGroup label="Slogan" layout="vertical" formClass={styles.customFormGroup}>
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder="brand slogan, if any"
                  name="slogan"
                  onChange={handleOnChangeValueForm}
                  value={brandProfile.slogan}
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
                  onChange={handleOnChangeValueForm}
                  value={brandProfile.mission}
                />
              </FormGroup>
              <div className={styles.website}>
                <FormGroup label="Offical Website" required formClass={styles.customText}>
                  <div className={styles.rightWebsite}>
                    <BodyText level={4}>Add Web Site</BodyText>
                    <span className={styles.iconAdd}>
                      <CustomPlusButton onClick={handleAddWebsiteItem} />
                    </span>
                  </div>
                </FormGroup>
                {brandProfile.website.map((item, index) => (
                  <div key={index}>
                    <ItemWebsite
                      websiteValue={item}
                      onChange={(value) => handleOnChangeWebsiteItem(value, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.actionButton}>
              {submitButtonStatus.value ? (
                <CustomButton
                  icon={<CheckSuccessIcon />}
                  size="small"
                  buttonClass={styles.customButtonSuccess}
                />
              ) : (
                <CustomButton size="small" buttonClass={styles.customButton} onClick={onSubmitForm}>
                  Save
                </CustomButton>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BrandProfile;
