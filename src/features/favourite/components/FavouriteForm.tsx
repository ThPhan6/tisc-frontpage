import { useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { Col, Row } from 'antd';

import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';

import { retrieveFavouriteProduct, skipFavouriteProduct } from '../services';
import { emailMessageError, emailMessageErrorType } from '@/helper/utils';
import { getUserInfoMiddleware } from '@/pages/LandingPage/services/api';

import { FavouriteRetrieve } from '../types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './FavouriteForm.less';

const FavouriteForm = () => {
  const [valueForm, setValueForm] = useState<FavouriteRetrieve>({
    personal_email: '',
    phone_code: '',
    mobile: '',
  });

  const handleOnChangeValueForm = (
    fieldName1: string,
    fieldValue1: string,
    fieldName2?: string,
    fieldValue2?: string,
  ) => {
    setValueForm({ ...valueForm, [fieldName1]: fieldValue1, [fieldName2 as string]: fieldValue2 });
  };

  const onSubmitForm = () => {
    retrieveFavouriteProduct(valueForm).then((res) => {
      if (res) {
        getUserInfoMiddleware();
      }
    });
  };

  const onSkipForm = () => {
    skipFavouriteProduct().then((res) => {
      if (res) {
        getUserInfoMiddleware();
      }
    });
  };

  return (
    <Row>
      <Col span={12}>
        <div className={styles.content}>
          <div className={styles.title}>
            <MainTitle level={3} textAlign="center">
              FOR NEW USER
            </MainTitle>
            <div className={styles.text}>
              <BodyText level={5} fontFamily="Roboto">
                Click{' '}
              </BodyText>
              <LikeIcon className={styles.icon} />
              <BodyText level={5} fontFamily="Roboto">
                icon to add the product to
              </BodyText>
              <MainTitle level={3} customClass={styles.textItem}>
                My Favourites
              </MainTitle>
            </div>
          </div>
          <div className={styles.form}>
            <MainTitle level={3} textAlign="center">
              FOR EXISTING USER WHO JOINED A NEW OFFICE
            </MainTitle>
            <BodyText level={5} fontFamily="Roboto" customClass={styles.formText}>
              Submit your personal email & mobile to reload the <span>My Favourites </span>
              preference
            </BodyText>

            <CustomInput
              placeholder="type personal email"
              borderBottomColor="mono-medium"
              containerClass={styles.input}
              onChange={(e) => handleOnChangeValueForm('personal_email', e.target.value)}
              name=" personal_email"
              value={valueForm.personal_email}
              message={emailMessageError(valueForm.personal_email, MESSAGE_ERROR.EMAIL_UNVALID)}
              messageType={emailMessageErrorType(valueForm.personal_email, 'error', 'normal')}
            />
            <PhoneInput
              codePlaceholder="00"
              phonePlaceholder="mobile number"
              containerClass={styles.phoneInput}
              onChange={(value) =>
                handleOnChangeValueForm('phone_code', value.zoneCode, 'mobile', value.phoneNumber)
              }
              value={{
                zoneCode: valueForm.phone_code,
                phoneNumber: valueForm.mobile,
              }}
            />

            <div className={styles.action}>
              <CustomButton size="small" properties="rounded" onClick={onSubmitForm}>
                Submit
              </CustomButton>
              <CustomButton
                size="small"
                properties="rounded"
                buttonClass={styles.skipButton}
                onClick={onSkipForm}>
                Skip
              </CustomButton>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default FavouriteForm;
