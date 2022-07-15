import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Col, Row } from 'antd';
import styles from './styles/index.less';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useState } from 'react';
import {
  IBrandProfileProp,
  brandProfileValueDefault,
  websiteValueDefautl,
  IWebsiteValueProp,
} from './types';
import { ItemWebsite } from './components/ItemWebsite';
import { getBase64 } from '@/helper/utils';
import Logo from '@/assets/image-logo.png';
import { useBoolean } from '@/helper/hook';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';

const BrandProfile = () => {
  const [brandProfile, setBrandProfile] = useState<IBrandProfileProp>(brandProfileValueDefault);
  const submitButtonStatus = useBoolean(false);

  const onSubmitForm = () => {
    submitButtonStatus.setValue(true);
    setTimeout(() => {
      submitButtonStatus.setValue(false);
    }, 1000);
  };

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
    if (e.target.files) {
      const file = e.target.files![0];
      getBase64(file)
        .then((base64Image) => {
          setBrandProfile({ ...brandProfile, slogan: base64Image });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddWebsiteItem = () => {
    setBrandProfile((state) => {
      const newWebsiteItem = [...state.official_websites, websiteValueDefautl];
      return { ...state, official_websites: newWebsiteItem };
    });
  };

  const handleOnChangeWebsiteItem = (websiteItem: IWebsiteValueProp, index: number) => {
    const newWebsiteItem = [...brandProfile.official_websites];
    newWebsiteItem[index] = websiteItem;
    setBrandProfile({ ...brandProfile, official_websites: newWebsiteItem });
  };

  console.log(brandProfile);
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
                    name="name"
                    onChange={handleOnChangeValueForm}
                    value={brandProfile.name}
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
                  name="parent_company"
                  onChange={handleOnChangeValueForm}
                  value={brandProfile.parent_company}
                />
              </FormGroup>
              <div className={styles.logo}>
                <img src={brandProfile.slogan ? brandProfile.slogan : Logo} />
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
                  name="mission_n_vision"
                  onChange={handleOnChangeValueForm}
                  value={brandProfile.mission_n_vision}
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
                {brandProfile.official_websites.map((item, index) => (
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
              <CustomSaveButton
                submitButtonStatus={submitButtonStatus.value}
                onClick={onSubmitForm}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BrandProfile;
