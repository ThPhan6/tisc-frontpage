import { useLandingPageStyles } from './hook';

import { useAppSelector } from '@/reducers';
import { modalThemeSelector } from '@/reducers/modal';

import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AboutModal.less';

export const AboutModal = () => {
  const { darkTheme, themeStyle } = useAppSelector(modalThemeSelector);
  const popupStylesProps = useLandingPageStyles(darkTheme);

  return (
    <CustomModal {...popupStylesProps} className={styles.modalContainer}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <div className={styles.vision}>
            <BodyText level={5} customClass={styles[`body${themeStyle}`]} fontFamily="Roboto">
              Our Vision
            </BodyText>
            <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
              Creating sustainable living space with ease.
            </MainTitle>
          </div>
          <div className={styles.mission}>
            <BodyText level={5} customClass={styles[`body${themeStyle}`]} fontFamily="Roboto">
              Our Mission
            </BodyText>
            <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
              To accelerate the digital transformation of our built environment eco-system globally.
            </MainTitle>
          </div>
          <div className={styles.mission}>
            <BodyText level={5} customClass={styles[`body${themeStyle}`]} fontFamily="Roboto">
              Our Environmental, Social and Governance (ESG) Commitments
            </BodyText>
            <MainTitle level={2} customClass={styles[`body${themeStyle}`]}>
              We aim to advance green transformation through educating industry stakeholders,
              partnership with environmentally conscious companies, promote eco-friendly products
              while allowing easy selections by design professions.
            </MainTitle>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
