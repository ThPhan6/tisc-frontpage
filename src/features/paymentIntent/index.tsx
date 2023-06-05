import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { getOneService } from '../services/api';
import { ServicesResponse } from '../services/type';
import { formatToMoneyValue } from '../services/util';
import { createPaymentIntent } from './services';
import { useGetParamId } from '@/helper/hook';

import { PAYMENT_INTENT_DEFAULT, PaymentIntentResponse } from './types';

import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import styles from './index.less';
import { createElement, loadAirwallex } from 'airwallex-payment-elements';

enum PaymentItentMethod {
  paymentIntegration = 'dropIn',
  countryCode = 'US',
  buttonType = 'buy',
}

const paymentIntegration = 'dropIn';
const countryCode = 'US';
const buttonType = 'buy';

const applePayRequestOptions = {
  countryCode: countryCode,
  buttonType: buttonType, // Indicate the type of button you want displayed on your payments form. Like 'buy'
  // buttonColor: 'white-with-line', // Indicate the color of the button. Default value is 'black'
};

const googlePayRequestOptions = {
  countryCode: countryCode,
  merchantInfo: {
    merchantName: 'Example Merchant',
    merchantId: '0123456789',
  },
  buttonType: buttonType, // Indicate the type of button you want displayed on your payments form. Like 'buy'
};

interface PaymentIntentProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onPaymentSuccess?: (data: ServicesResponse) => void;
}

export const PaymentIntent: FC<PaymentIntentProps> = ({
  visible,
  setVisible,
  onPaymentSuccess,
}) => {
  const [paymentIntentData, setPaymentIntentData] =
    useState<PaymentIntentResponse>(PAYMENT_INTENT_DEFAULT);

  const billId = useGetParamId();

  // const [elementShow, setElementShow] = useState<boolean>(false); // Example, set element show state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Example: set error state

  let dropIn: any;

  const createNewPayment = async () => {
    const paymentData = await createPaymentIntent(billId);

    if (!paymentData) return;

    setPaymentIntentData(paymentData);

    loadAirwallex({
      env: AIRWALLEX_ENVIRONMENT, // Can choose other production environments, 'staging | 'demo' | 'prod'
      origin: window.location.origin, // Setup your event target to receive the browser events message
    }).then(async () => {
      dropIn = createElement(paymentIntegration, {
        intent_id: paymentData.id,
        client_secret: paymentData.client_secret,
        currency: paymentData.currency,
        applePayRequestOptions: {
          countryCode: 'SG',
        },
      });

      if (!dropIn) {
        setErrorMessage('Cannot create Drop-In integration');
        return;
      }

      dropIn?.mount(paymentIntegration); // This paymentIntegration id MUST MATCH the id on your empty container created in Step 3
    });
  };

  useEffect(() => {
    if (!visible) return;

    createNewPayment();

    // const onReady = () => {
    //   setElementShow(true);
    //   // console.log(`Element is mounted: ${JSON.stringify(event)}`);
    // };

    const onSuccess = () => {
      // payment succeeded, then close popup
      setVisible(false);

      /// update billed data
      setTimeout(() => {
        getOneService(billId).then((res) => {
          if (res) {
            onPaymentSuccess?.(res);
          }
        });
      }, 1000);

      message.success('The payment was successful, no further action required.');
    };

    const onError = (event: any) => {
      const { error } = event.detail;

      setErrorMessage(error);
      // console.error('There was an error', error);
    };

    // window.addEventListener('onReady', onReady);
    window.addEventListener('onSuccess', onSuccess);
    window.addEventListener('onError', onError);

    return () => {
      // window.removeEventListener('onReady', onReady);
      window.removeEventListener('onSuccess', onSuccess);
      window.removeEventListener('onError', onError);

      /// umount payment method when close popover even though it's processing
      /// allow create new payment intent for each click pay
      dropIn?.unmount(paymentIntegration);

      setErrorMessage('');
    };
  }, [visible]);

  return (
    <Popover
      title="Payment Intent"
      className={styles.modalContainer}
      secondaryModal
      noFooter
      maskClosable={false}
      visible={visible}
      setVisible={setVisible}
    >
      <div className="flex-between payment-summary">
        <BodyText fontFamily="Roboto" level={4} style={{ fontWeight: 400 }}>
          Order Summary
        </BodyText>

        <BodyText fontFamily="Roboto" level={4} style={{ fontWeight: 400 }}>
          {paymentIntentData.currency} ${formatToMoneyValue(paymentIntentData.amount)}
        </BodyText>
      </div>

      <div style={{ height: '100%' }}>
        {/* Example below: display response message block */}
        {errorMessage?.length > 0 ? (
          <BodyText fontFamily="Roboto" level={5} color="tertiary-color" id="error">
            {errorMessage}
          </BodyText>
        ) : null}

        {/**
         * STEP #3: Add an empty container for the dropIn element to be placed into
         * - Ensure this is the only element in your document with this id,
         *   otherwise the element may fail to mount.
         */}
        <div
          id={paymentIntegration}
          style={{
            width: '100%',
            margin: '48px auto',
            // display: elementShow ? 'block' : 'none', // Example: only show element when mounted
          }}
        />
      </div>
    </Popover>
  );
};
