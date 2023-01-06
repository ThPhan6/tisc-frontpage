import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { IMAGE_ACCEPT_TYPES, LOGO_SIZE_LIMIT } from '@/constants/util';
import { Col, Row, Upload, UploadProps, message } from 'antd';

// import DefaultLogo from '@/assets/icons/avatar-default.svg';
import { ReactComponent as DefaultLogo } from '@/assets/icons/avatar-default.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/upload-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-icon.svg';
import PlaceHolderImage from '@/assets/images/product-placeholder.png';

import { getListCapabilities, updateBrandProfile, updateDesignFirmOfficeProfile } from './services';
import { useScreen } from '@/helper/common';
import { useBoolean, useCheckPermission, useCustomInitialState } from '@/helper/hook';
import { getBase64, getSelectedOptions, showImageUrl } from '@/helper/utils';
import { isEqual } from 'lodash';

import {
  WebsiteUrlItem,
  initialBrandProfileState,
  initialOfficeProfileState,
  websiteValueDefautl,
} from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { useAppSelector } from '@/reducers';
import { BrandProfile, DesignFirmProfile } from '@/types/user.type';

import { ItemWebsite } from './components/ItemWebsite';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, Title } from '@/components/Typography';

import styles from './index.less';

const BrandProfilePage = () => {
  const { fetchUserInfo } = useCustomInitialState();

  const { isMobile } = useScreen();

  const isBrand = useCheckPermission(['Brand Admin', 'Brand Team']);
  const isDesign = useCheckPermission(['Design Admin', 'Design Team']);

  const brandAppState = useAppSelector((state) => state.user.user?.brand);
  const designAppState = useAppSelector((state) => state.user.user?.design);

  const isSubmitted = useBoolean(false);
  const [loadedData, setLoadedData] = useState(false);

  const [fileInput, setFileInput] = useState<any>();
  const userLogo = isBrand ? brandAppState?.logo : designAppState?.logo;
  const [currentLogo, setCurrentLogo] = useState<string>(userLogo ?? PlaceHolderImage);

  /// for brand office profile
  //! update logo for brand was using seperate api
  const [brandProfile, setBrandProfile] = useState<Partial<BrandProfile>>(initialBrandProfileState);

  /// for design-firm office profile
  const [designFirmProfile, setDesignFirmProfile] =
    useState<Partial<DesignFirmProfile>>(initialOfficeProfileState);
  const [designCapability, setDesignCapability] = useState<CheckboxValue[]>([]);

  const selectedCapability = getSelectedOptions(
    designCapability,
    designFirmProfile.capabilities ?? [],
  );
  const [curSelectCapability, setCurSelectCapability] = useState<CheckboxValue[]>([]);

  useEffect(() => {
    if (!isEqual(selectedCapability, curSelectCapability)) {
      setCurSelectCapability(selectedCapability);
    }
  }, [isSubmitted.value === true]);

  useEffect(() => {
    if (isDesign) {
      if (designAppState) {
        setDesignFirmProfile({
          name: designAppState.name ?? '',
          logo: designAppState.logo ?? '',
          parent_company: designAppState.parent_company ?? '',
          slogan: designAppState.slogan ?? '',
          profile_n_philosophy: designAppState.profile_n_philosophy ?? '',
          official_website: designAppState.official_website ?? '',
          capabilities: designAppState.capabilities ?? [],
        });
      }

      getListCapabilities().then((res) => {
        if (res) {
          setDesignCapability(
            res.map((el) => ({
              label: el.name,
              value: el.id,
            })),
          );
        }
      });
      setLoadedData(true);
    }
  }, [designAppState]);

  useEffect(() => {
    if (isBrand) {
      if (brandAppState) {
        setBrandProfile({
          mission_n_vision: brandAppState.mission_n_vision,
          name: brandAppState.name,
          parent_company: brandAppState.parent_company || '',
          slogan: brandAppState.slogan || '',
          official_websites: brandAppState.official_websites || [],
          logo: brandAppState.logo ?? '',
        });
      }
      setLoadedData(true);
    }
  }, [brandAppState]);

  const onChangeValueForm = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    if (isBrand) {
      setBrandProfile({ ...brandProfile, [e.target.name]: e.target.value });
    }

    setDesignFirmProfile({ ...designFirmProfile, [e.target.name]: e.target.value });
  };

  /// for brand profile
  const handleAddWebsiteItem = () => {
    setBrandProfile((state) => {
      let newWebsiteItem: WebsiteUrlItem[] = [];
      if (state.official_websites) {
        newWebsiteItem = [...state.official_websites, websiteValueDefautl];
      }
      return { ...state, official_websites: newWebsiteItem };
    });
  };
  const onChangeWebsiteItem = (websiteItem: WebsiteUrlItem, index: number) => {
    let newWebsiteItem: WebsiteUrlItem[] = [];
    if (brandProfile.official_websites) {
      newWebsiteItem = [...brandProfile.official_websites];
    }
    newWebsiteItem[index] = websiteItem;
    setBrandProfile({ ...brandProfile, official_websites: newWebsiteItem });
  };
  const handleDeleteWebsiteItem = (index: number) => {
    let websiteItem: WebsiteUrlItem[] = [];
    if (brandProfile.official_websites) {
      websiteItem = [...brandProfile.official_websites];
    }
    websiteItem.splice(index, 1);
    setBrandProfile({ ...brandProfile, official_websites: websiteItem });
  };

  const handleUpdateLogo = () => {
    const formData: any = new FormData();
    formData.append('logo', fileInput);
    if (isBrand) {
      setBrandProfile({ ...brandProfile, logo: formData });
    }
    if (isDesign) {
      setDesignFirmProfile({ ...designFirmProfile, logo: formData });
    }
  };

  const getPreviewAvatar = () => {
    if (fileInput) {
      return <img src={URL.createObjectURL(fileInput)} />;
    }
    if (userLogo) {
      return <img src={showImageUrl(userLogo)} />;
    }
    return <DefaultLogo className={styles.defaultLogo} />;
  };

  useEffect(() => {
    if (fileInput) {
      handleUpdateLogo();
    }
  }, [fileInput]);

  const props: UploadProps = {
    beforeUpload: (file) => {
      if (file.size > LOGO_SIZE_LIMIT) {
        message.error(MESSAGE_ERROR.reachLogoSizeLimit);
        return false;
      }
      setFileInput(file);
      getBase64(file)
        .then((base64Image) => {
          setCurrentLogo(base64Image); // only set to show, haven't added to data

          if (isDesign) {
            setDesignFirmProfile({ ...designFirmProfile, logo: base64Image.split(',')[1] });
          }
          if (isBrand) {
            setBrandProfile({ ...brandProfile, logo: base64Image.split(',')[1] });
          }
        })
        .catch(() => {
          message.error('Upload Failed');
        });
      return true;
    },
  };

  const onSubmitForm = () => {
    if (isBrand) {
      switch (true) {
        case !brandProfile.name:
          message.error('Brand Name is required');
          return;
        case !currentLogo:
          message.error('Logo is required');
          return;
        case !brandProfile.mission_n_vision:
          message.error('Mission & Vision is required');
          return;
        case !brandProfile.official_websites?.length:
          message.error('Offical Websites is required');
          return;
        default:
          break;
      }
    }

    if (isDesign) {
      switch (true) {
        case !designFirmProfile.name:
          message.error('Design Firm Name is required');
          return;
        case !designFirmProfile.logo:
          message.error('Logo is required');
          return;
        case !designFirmProfile.profile_n_philosophy:
          message.error('Profile & Philosophy is required');
          return;
        case !designFirmProfile.official_website:
          message.error('Offical Website is required');
          return;
        case !designFirmProfile.capabilities?.length:
          message.error('Design Capabilities are required');
          return;
        default:
          break;
      }
    }

    const updateData = isBrand
      ? updateBrandProfile({
          name: brandProfile.name?.trim() ?? '',
          parent_company: brandProfile.parent_company?.trim() ?? '',
          slogan: brandProfile.slogan?.trim() ?? '',
          mission_n_vision: brandProfile.mission_n_vision?.trim() ?? '',
          official_websites: brandProfile.official_websites?.map((website) => ({
            ...website,
            url: website.url?.trim() ?? '',
          })),
          logo: brandProfile.logo ?? brandAppState?.logo,
        })
      : updateDesignFirmOfficeProfile(designAppState?.id ?? '', {
          name: designFirmProfile.name?.trim() ?? '',
          logo: designFirmProfile.logo ?? designAppState?.logo,
          parent_company: designFirmProfile.parent_company?.trim() ?? '',
          slogan: designFirmProfile.slogan?.trim() ?? '',
          profile_n_philosophy: designFirmProfile.profile_n_philosophy?.trim() ?? '',
          official_website: designFirmProfile.official_website?.trim() ?? '',
          capabilities: designFirmProfile.capabilities ?? [],
        });

    updateData.then((isSuccess) => {
      if (isSuccess) {
        fetchUserInfo();
        isSubmitted.setValue(true);
        setTimeout(() => {
          isSubmitted.setValue(false);
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
        <Col span={24} lg={12}>
          <div className={styles.container}>
            <div className={styles.formTitle}>
              <Title level={8}>{isBrand ? 'BRAND PROFILE' : 'OFFICE PROFILE'}</Title>
            </div>

            <div
              className={styles.form}
              style={{
                height: isMobile
                  ? 'calc(var(--vh) * 100 - 176px)'
                  : 'calc(var(--vh) * 100 - 192px)',
              }}
            >
              <FormGroup
                label={isBrand ? 'Brand Name' : 'Design Firm Name'}
                layout="vertical"
                required
                formClass={styles.customFormGroup}
              >
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder={isBrand ? 'registered name/trademark' : 'registered company name'}
                  name="name"
                  onChange={onChangeValueForm}
                  value={isBrand ? brandProfile.name : designFirmProfile.name}
                />
              </FormGroup>

              <FormGroup
                label="Parent Company"
                layout="vertical"
                formClass={styles.customFormGroup}
              >
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder="holding company name, if any"
                  name="parent_company"
                  onChange={onChangeValueForm}
                  value={isBrand ? brandProfile.parent_company : designFirmProfile.parent_company}
                />
              </FormGroup>

              <div className={styles.logo}>
                <Upload
                  className="cursor-pointer"
                  maxCount={1}
                  showUploadList={false}
                  {...props}
                  accept={IMAGE_ACCEPT_TYPES.image}
                >
                  {getPreviewAvatar()}
                </Upload>
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
                    <Upload
                      maxCount={1}
                      showUploadList={false}
                      {...props}
                      accept={IMAGE_ACCEPT_TYPES.image}
                    >
                      <UploadIcon className={styles.icon} />
                    </Upload>
                  </div>
                </FormGroup>
              </div>

              <FormGroup label="Slogan" layout="vertical" formClass={styles.customFormGroup}>
                <CustomInput
                  borderBottomColor="mono-medium"
                  placeholder={isBrand ? 'brand slogan, if any' : 'design slogan, if any'}
                  name="slogan"
                  onChange={onChangeValueForm}
                  value={isBrand ? brandProfile.slogan : designFirmProfile.slogan}
                />
              </FormGroup>

              <FormGroup
                label={isBrand ? 'Mission & Vision' : 'Profile & Philosophy'}
                layout="vertical"
                required
                formClass={styles.customFormArea}
              >
                <CustomTextArea
                  placeholder={
                    isBrand
                      ? 'maximum 250 words of brand history, story, and unique product/service offerings'
                      : 'maximum 250 words of firm design practice, philiosophy, service offerings, and unique capacity'
                  }
                  showCount
                  maxLength={250}
                  borderBottomColor="mono-medium"
                  name={isBrand ? 'mission_n_vision' : 'profile_n_philosophy'}
                  onChange={onChangeValueForm}
                  value={
                    isBrand ? brandProfile.mission_n_vision : designFirmProfile.profile_n_philosophy
                  }
                />
              </FormGroup>

              {isBrand ? (
                <div className={styles.website}>
                  <FormGroup label="Offical Website" required formClass={styles.customText}>
                    <div className={styles.rightWebsite}>
                      <BodyText level={4}>Add Web Site</BodyText>
                      <span className={styles.iconAdd}>
                        <CustomPlusButton onClick={handleAddWebsiteItem} size={18} />
                      </span>
                    </div>
                  </FormGroup>
                  {brandProfile.official_websites?.map((item, index) => (
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
                    formClass={styles.customFormGroup}
                  >
                    <CustomInput
                      borderBottomColor="mono-medium"
                      placeholder="paste URL link here"
                      name="official_website"
                      onChange={onChangeValueForm}
                      value={designFirmProfile.official_website}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Design Capabilities"
                    required
                    layout="vertical"
                    formClass={styles.customFormGroup}
                  >
                    <CustomCheckbox
                      checkboxClass={styles.capability}
                      options={designCapability}
                      selected={
                        curSelectCapability.length ? curSelectCapability : selectedCapability
                      }
                      heightItem="36px"
                      inputPlaceholder="please specify"
                      isCheckboxList
                      clearOtherInput={isSubmitted.value}
                      otherInput
                      onChange={(checkboxSelected) => {
                        /// for show item selected
                        setCurSelectCapability(checkboxSelected);

                        /// onChange data
                        setDesignFirmProfile({
                          ...designFirmProfile,
                          capabilities: checkboxSelected.map((el) =>
                            String(el.value === 'other' ? el.label : el.value),
                          ),
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              )}
            </div>

            <div
              className={styles.actionButton}
              style={{ display: 'flex', justifyContent: isMobile ? 'center' : undefined }}
            >
              <CustomSaveButton isSuccess={isSubmitted.value} onClick={onSubmitForm} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BrandProfilePage;
