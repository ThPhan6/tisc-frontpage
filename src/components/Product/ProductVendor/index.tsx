import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as CatelogueIcon } from '@/assets/icons/catelogue-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import CustomCollapse from '@/components/Collapse';
import { BodyText } from '@/components/Typography';
import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import BrandContact from './BrandContact';
import styles from './styles/index.less';

const ProductVendor: FC = ({ children }) => {
  const product = useAppSelector((state) => state.product);
  const { brand } = product;

  return (
    <div className={styles.productVendorContainer}>
      <CustomCollapse
        showActiveBoxShadow
        className={styles.vendorSection}
        customHeaderClass={styles.vendorCustomPanelBox}
        header={
          <div className={styles.brandProfileHeader}>
            <BrandIcon />
            <BodyText level={6} fontFamily="Roboto">
              Brand Profile
            </BodyText>
          </div>
        }
      >
        <div className={styles.brandProfileInfo}>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Slogan :
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-text-info">
              {brand?.slogan ?? ''}
            </BodyText>
          </div>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Mission & Vison :
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-text-info">
              {brand?.mission_n_vision ?? ''}
            </BodyText>
          </div>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Official Website :
            </BodyText>
            <table className="brand-websites">
              <tbody>
                {brand?.official_websites?.map((website, index: number) => (
                  <tr key={index}>
                    <td>
                      <BodyText level={6} fontFamily="Roboto">
                        {website.country_name ?? 'N/A'}
                      </BodyText>
                    </td>
                    <td>
                      <BodyText level={6} fontFamily="Roboto">
                        <a href={website.url ?? 'N/A'} target="_blank" rel="noreferrer">
                          {website.url ?? 'N/A'}
                        </a>
                      </BodyText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CustomCollapse>

      <div className={styles.vendorSection}>
        <div className={styles.contactHeadline}>
          <LocationIcon className="contact-icon" />
          <BodyText level={6} fontFamily="Roboto">
            Contact & Address
          </BodyText>
        </div>
        <div className={styles.contactContent}>
          <BrandContact title="Brand Locations" />
          <BrandContact title="Distributor Locations" />
        </div>
      </div>

      <CustomCollapse
        showActiveBoxShadow
        className={`${styles.vendorSection} ${styles.catelogueSection}`}
        customHeaderClass={styles.vendorCustomPanelBox}
        header={
          <div className={styles.brandProfileHeader}>
            <CatelogueIcon />
            <BodyText level={6} fontFamily="Roboto">
              Catelogue & Download
            </BodyText>
          </div>
        }
      >
        {children}
      </CustomCollapse>
    </div>
  );
};
export default ProductVendor;
