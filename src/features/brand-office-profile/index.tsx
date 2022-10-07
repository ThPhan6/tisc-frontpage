import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { Col, Row, Upload, UploadProps, message } from 'antd';

import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';
import Logo from '@/assets/image-logo.png';

import { updateBrandProfile, updateLogoBrandProfile, updateOfficeProfile } from './services';
import { useBoolean, useCheckPermission, useCustomInitialState } from '@/helper/hook';
import { getBase64, showImageUrl } from '@/helper/utils';

import {
  UpdateBrandProfileRequestBody,
  UpdateOfficeProfileRequestBody,
  WebsiteUrlItem,
  initialBrandProfileState,
  initialOfficeProfileState,
  websiteValueDefautl,
} from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { useAppSelector } from '@/reducers';

import { ItemWebsite } from './components/ItemWebsite';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, Title } from '@/components/Typography';

import { getListFunctionalType } from '../locations/api';
import styles from './index.less';

const LOGO_SIZE_LIMIT = 240 * 1024; // 240 KB

const BrandProfilePage = () => {
  const brandAppState = useAppSelector((state) => state.user.user?.brand);
  const submitButtonStatus = useBoolean(false);

  const isLoading = useBoolean(false);
  const [fileInput, setFileInput] = useState<any>();
  const { fetchUserInfo } = useCustomInitialState();
  const [logoBrandProfile, setLogoBrandProfile] = useState<string>('');
  const [loadedData, setLoadedData] = useState(false);

  /// for brand profile
  const [brandProfile, setBrandProfile] =
    useState<UpdateBrandProfileRequestBody>(initialBrandProfileState);

  /// for design-firm office profile
  const [designFirm, setDesignFirm] =
    useState<UpdateOfficeProfileRequestBody>(initialOfficeProfileState);
  const [designCapability, setDesignCapability] = useState<CheckboxValue[]>([]);
  const [capabilitySelected, setCapabilitySelected] = useState<CheckboxValue[]>([]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const isBrandAdmin = useCheckPermission('Brand Admin');
  const isDesignAdmin = useCheckPermission('Design Admin');

  useEffect(() => {
    if (isBrandAdmin) {
      if (brandAppState) {
        setBrandProfile({
          mission_n_vision: brandAppState.mission_n_vision,
          name: brandAppState.name,
          parent_company: brandAppState.parent_company || '',
          slogan: brandAppState.slogan || '',
          official_websites: brandAppState.official_websites || [],
        });
      }
      setLoadedData(true);
    }

    if (isDesignAdmin) {
      getListFunctionalType().then((res) => {
        if (res) {
          setDesignCapability(
            res.map((el) => ({
              label: el.name,
              value: el.id,
            })),
          );
        }
      });
    }
  }, [brandAppState]);

  const onChangeValueForm = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    if (isBrandAdmin) {
      setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
    }

    setDesignFirm({ ...designFirm, [e.target.name]: e.target.value });
  };

  /// for brand profile
  const handleAddWebsiteItem = () => {
    setBrandProfile((state) => {
      const newWebsiteItem = [...state.official_websites, websiteValueDefautl];
      return { ...state, official_websites: newWebsiteItem };
    });
  };
  const onChangeWebsiteItem = (websiteItem: WebsiteUrlItem, index: number) => {
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
      return showImageUrl(brandAppState?.logo);
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
        .catch(() => {
          message.error('Upload Failed');
        });
      return true;
    },
  };

  const onSubmitForm = () => {
    isLoading.setValue(true);

    const updateData = isBrandAdmin
      ? updateBrandProfile({
          name: brandProfile.name?.trim() ?? '',
          parent_company: brandProfile.parent_company?.trim() ?? '',
          slogan: brandProfile.slogan?.trim() ?? '',
          mission_n_vision: brandProfile.mission_n_vision?.trim() ?? '',
          official_websites: brandProfile.official_websites.map((website) => ({
            ...website,
            url: website.url?.trim() ?? '',
          })),
        })
      : updateOfficeProfile({
          name: designFirm.name?.trim() ?? '',
          parent_company: designFirm.parent_company?.trim() ?? '',
          slogan: designFirm.slogan?.trim() ?? '',
          profile_n_philosophy: designFirm.profile_n_philosophy?.trim() ?? '',
          official_website: designFirm.official_website?.trim() ?? '',
          design_capabilities: designFirm.design_capabilities ?? [],
        });

    updateData.then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        fetchUserInfo();
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
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
              <Title level={8}>{isBrandAdmin ? 'BRAND PROFILE' : 'OFFICE PROFILE'}</Title>
            </div>

            <div className={styles.form}>
              <FormGroup
                label={isBrandAdmin ? 'Brand Name' : 'Design Firm Name'}
                layout="vertical"
                required
                formClass={styles.customFormGroup}>
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder={
                    isBrandAdmin ? 'registered name/trademark' : 'registered company name'
                  }
                  name="name"
                  onChange={onChangeValueForm}
                  value={isBrandAdmin ? brandProfile.name : designFirm.name}
                />
              </FormGroup>

              <FormGroup
                label="Parent Company"
                layout="vertical"
                formClass={styles.customFormGroup}>
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder="holding company name, if any"
                  name="parent_company"
                  onChange={onChangeValueForm}
                  value={isBrandAdmin ? brandProfile.parent_company : designFirm.parent_company}
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
                  iconTooltip={<WarningIcon className={styles.customWarningIcon} />}>
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
                  placeholder={isBrandAdmin ? 'brand slogan, if any' : 'design slogan, if any'}
                  name="slogan"
                  onChange={onChangeValueForm}
                  value={isBrandAdmin ? brandProfile.slogan : designFirm.slogan}
                />
              </FormGroup>

              <FormGroup
                label={isBrandAdmin ? 'Mission & Vision' : 'Profile & Philosophy'}
                layout="vertical"
                required
                formClass={styles.customFormArea}>
                <CustomTextArea
                  placeholder={
                    isBrandAdmin
                      ? 'maximum 250 words of brand history, story, and unique product/service offerings'
                      : 'maximum 250 words of firm design practice, philiosophy, service offerings, and unique capacity'
                  }
                  showCount
                  maxLength={250}
                  borderBottomColor="mono-medium"
                  name={isBrandAdmin ? 'mission_n_vision' : 'profile_n_philosophy'}
                  onChange={onChangeValueForm}
                  value={
                    isBrandAdmin ? brandProfile.mission_n_vision : designFirm.profile_n_philosophy
                  }
                />
              </FormGroup>

              {isBrandAdmin ? (
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
                        onChange={(value) => onChangeWebsiteItem(value, index)}
                        onDeleteWebsiteItem={() => handleDeleteWebsiteItem(index)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: '40px' }}>
                  <FormGroup
                    label="Offical Website"
                    required
                    layout="vertical"
                    formClass={styles.customFormGroup}>
                    <CustomInput
                      borderBottomColor="mono-medium"
                      placeholder="paste URL link here"
                      name="office_website"
                      onChange={onChangeValueForm}
                      value={designFirm.official_website}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Design Capabilities"
                    required
                    layout="vertical"
                    formClass={styles.customFormGroup}>
                    <CustomCheckbox
                      checkboxClass={styles.capability}
                      options={designCapability}
                      selected={capabilitySelected}
                      heightItem="36px"
                      inputPlaceholder="please specify"
                      isCheckboxList
                      otherInput
                      onChange={(checkboxSelected) => {
                        /// for show item selected
                        setCapabilitySelected(checkboxSelected);

                        /// onChange data
                        setDesignFirm({
                          ...designFirm,
                          design_capabilities: checkboxSelected.map((el) =>
                            String(el.value === 'other' ? el.label : el.value),
                          ),
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              )}
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
