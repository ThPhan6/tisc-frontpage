import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Col, Row, Upload, UploadProps } from 'antd';
import styles from './styles/index.less';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useEffect, useState } from 'react';
import {
  IBrandProfileProp,
  brandProfileValueDefault,
  websiteValueDefautl,
  IWebsiteValueProp,
} from './types';
import { ItemWebsite } from './components/ItemWebsite';
import { getBase64, showImageUrl } from '@/helper/utils';
import Logo from '@/assets/image-logo.png';
import { useBoolean, useCustomInitialState } from '@/helper/hook';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { updateBrandProfile, updateLogoBrandProfile } from '@/services/brand-profile';
import { useAppSelector } from '@/reducers';
const BrandProfile = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);
  const [fileInput, setFileInput] = useState<any>();
  const user = useAppSelector((state) => state.user);
  const [brandProfile, setBrandProfile] = useState<IBrandProfileProp>(brandProfileValueDefault);
  const { fetchUserInfo } = useCustomInitialState();
  const [logoBrandProfile, setLogoBrandProfile] = useState<string>('');

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
    // if (e.target.files) {
    //   const file = e.target.files![0];
    //   getBase64(file)
    //     .then((base64Image) => {
    //       setLogoBrandProfile(base64Image);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
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

  const handleUpdateLogo = () => {
    const formData = new FormData();
    formData.append('logo', fileInput);
    isLoading.setValue(true);
    updateLogoBrandProfile(formData as any).then((isSuccess) => {
      if (isSuccess) {
        fetchUserInfo();
      }
      isLoading.setValue(false);
    });
  };

  useEffect(() => {
    if (fileInput) {
      handleUpdateLogo();
    }
  }, [fileInput]);

  const setPreviewAvatar = () => {
    if (user.user?.brand?.logo) {
      return showImageUrl(user.user?.brand?.logo as string);
    }
    return Logo;
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFileInput(file);
      getBase64(file)
        .then((base64Image) => {
          setLogoBrandProfile(base64Image);
        })
        .catch((err) => {
          console.log(err);
        });
      return false;
    },
  };

  const onSubmitForm = () => {
    isLoading.setValue(true);
    updateBrandProfile(brandProfile).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        fetchUserInfo();
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 3000);
      }
    });
  };

  console.log(logoBrandProfile);
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
                <img src={logoBrandProfile || setPreviewAvatar()} />
              </div>
              <div className={styles.customFormLogo}>
                <FormGroup
                  label="Logo/Trademark"
                  layout="horizontal"
                  tooltip="LOGO prefers high quality, squared shape PNG format, and less than 240 KB file size."
                  required
                  formClass={styles.customLabel}
                  iconTooltip={<WarningIcon className={styles.customWarningIcon} />}
                >
                  <div className={styles['wrapper-upload']}>
                    <Upload
                      maxCount={1}
                      showUploadList={false}
                      {...props}
                      accept=".png"
                      // onChange={(value) => handleOnChangeValueFormTest}
                    >
                      <UploadIcon className={styles.icon} />
                    </Upload>
                  </div>
                </FormGroup>
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
