import { FC } from 'react';
import { BodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import BrandContact from './BrandContact';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as CatelogueIcon } from '@/assets/icons/catelogue-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductCatelogue } from '@/reducers/product';
import styles from './styles/vendor.less';

const ProductVendor: FC = () => {
  const product = useAppSelector((state) => state.product);
  const { catelogue, brand } = product;
  const dispatch = useDispatch();

  return (
    <div className={styles.productVendorContainer}>
      <CustomCollapse
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
                {brand?.offical_websites?.map((_website: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <BodyText level={6} fontFamily="Roboto">
                        Global
                      </BodyText>
                    </td>
                    <td>
                      <BodyText level={6} fontFamily="Roboto">
                        www.silestone.com
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
        <DynamicFormInput
          data={catelogue.contents.map((item) => {
            return {
              title: item.title,
              value: item.url,
            };
          })}
          setData={(data) => {
            dispatch(
              setProductCatelogue({
                ...catelogue,
                contents: data.map((item, index) => {
                  return {
                    ...catelogue.contents[index],
                    title: item.title,
                    url: item.value,
                  };
                }),
              }),
            );
          }}
          titlePlaceholder="type catelogue name here"
          valuePlaceholder="paste file URL link here"
        />
      </CustomCollapse>
    </div>
  );
};
export default ProductVendor;
