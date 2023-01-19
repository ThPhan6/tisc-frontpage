import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!ENABLE_RECAPTCHA) {
      return '';
    }
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('login');
    return token;
  }, [executeRecaptcha]);

  return {
    handleReCaptchaVerify,
  };
};
