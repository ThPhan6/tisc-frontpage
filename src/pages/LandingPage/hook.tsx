import { useCallback, useState } from 'react';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import store from '@/reducers';
import { updateCaptchaProps } from '@/reducers/landingpage';

export const useReCaptcha = () => {
  const [refreshReCaptcha, setRefreshReCaptcha] = useState<boolean>(false);

  const onVerify = useCallback((value: string) => {
    store.dispatch(
      updateCaptchaProps({
        captcha: value,
        setRefreshReCaptcha: () => setRefreshReCaptcha((refreshCaptcha) => !refreshCaptcha),
      }),
    );
  }, []);

  const renderReCaptcha = (children: any) => (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha} />
      {children}
    </GoogleReCaptchaProvider>
  );

  return {
    renderReCaptcha,
  };
};
