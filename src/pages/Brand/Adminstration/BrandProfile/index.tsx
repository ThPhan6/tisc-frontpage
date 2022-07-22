import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Col, message, Row, Upload, UploadProps } from 'antd';
import styles from './styles/index.less';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { useEffect, useState } from 'react';
import { UpdateBrandProfileRequestBody, websiteValueDefautl } from './types';
import { ItemWebsite } from './components/ItemWebsite';
import { getBase64, showImageUrl } from '@/helper/utils';
import Logo from '@/assets/image-logo.png';
import { useBoolean, useCustomInitialState } from '@/helper/hook';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { updateBrandProfile, updateLogoBrandProfile } from '@/services/brand-profile';
import { useAppSelector } from '@/reducers';
import { WebsiteUrlItem } from '@/types/user.type';
import { MESSAGE_ERROR } from '@/constants/message';

const initialBrandProfileState: UpdateBrandProfileRequestBody = {
  mission_n_vision: '',
  name: '',
  parent_company: '',
  slogan: '',
  official_websites: [],
};

const LOGO_SIZE_LIMIT = 240 * 1024; // 240 KB

const BrandProfilePage = () => {
  const brandAppState = useAppSelector((state) => state.user.user?.brand);
  const submitButtonStatus = useBoolean(false);

  const isLoading = useBoolean(false);
  const [fileInput, setFileInput] = useState<any>();
  const [brandProfile, setBrandProfile] =
    useState<UpdateBrandProfileRequestBody>(initialBrandProfileState);
  const { fetchUserInfo } = useCustomInitialState();
  const [logoBrandProfile, setLogoBrandProfile] = useState<string>('');
  const [loadedData, setLoadedData] = useState(false);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (brandAppState) {
      setBrandProfile({
        mission_n_vision: brandAppState.mission_n_vision,
        name: brandAppState.name,
        parent_company: brandAppState.parent_company || '',
        slogan: brandAppState.slogan || '',
        official_websites: brandAppState.official_websites || [],
      });
      setLoadedData(true);
    }
  }, [brandAppState]);

  const handleOnChangeValueForm = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
  };

  const handleAddWebsiteItem = () => {
    setBrandProfile((state) => {
      const newWebsiteItem = [...state.official_websites, websiteValueDefautl];
      return { ...state, official_websites: newWebsiteItem };
    });
  };

  const handleOnChangeWebsiteItem = (websiteItem: WebsiteUrlItem, index: number) => {
    const newWebsiteItem = [...brandProfile.official_websites];
    newWebsiteItem[index] = websiteItem;
    setBrandProfile({ ...brandProfile, official_websites: newWebsiteItem });
  };

  const handleDeleteWebsiteItem = (index: number) => {
    const websiteItem = [...brandProfile.official_websites];
    websiteItem.splice(index, 1);
    setBrandProfile({ ...brandProfile, official_websites: websiteItem });
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
    if (brandAppState?.logo) {
      return showImageUrl(brandAppState?.logo as string);
    }
    return Logo;
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      if (file.size > LOGO_SIZE_LIMIT) {
        message.error(MESSAGE_ERROR.reachLogoSizeLimit);
        return false;
      }
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
    updateBrandProfile({
      name: brandProfile.name?.trim() ?? '',
      parent_company: brandProfile.parent_company?.trim() ?? '',
      slogan: brandProfile.slogan?.trim() ?? '',
      mission_n_vision: brandProfile.mission_n_vision?.trim() ?? '',
      official_websites: brandProfile.official_websites.map((website) => {
        return {
          ...website,
          url: website.url?.trim() ?? '',
        };
      }),
    }).then((isSuccess) => {
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

  if (!loadedData) {
    return null;
  }

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
                  placement="bottom"
                  required
                  formClass={styles.customLabel}
                  iconTooltip={<WarningIcon className={styles.customWarningIcon} />}
                >
                  <div className={styles['wrapper-upload']}>
                    <Upload maxCount={1} showUploadList={false} {...props} accept=".png">
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
                      <CustomPlusButton onClick={handleAddWebsiteItem} size={18} />
                    </span>
                  </div>
                </FormGroup>
                {brandProfile.official_websites.map((item, index) => (
                  <div key={index}>
                    <ItemWebsite
                      websiteValue={item}
                      onChange={(value) => handleOnChangeWebsiteItem(value, index)}
                      onDeleteWebsiteItem={() => handleDeleteWebsiteItem(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.actionButton}>
              <CustomSaveButton isSuccess={submitButtonStatus.value} onClick={onSubmitForm} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BrandProfilePage;
