import { FC, useEffect, useState } from 'react';
import styles from '../styles/TISCAccessLevelModal.less';
import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';
import { ReactComponent as AccessableMinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { BodyText, MainTitle } from '@/components/Typography';
import classNames from 'classnames';
import ModalTISC from '@/components/ModalTISC';
import { AccessLevelModalItemProps, AccessLevelModalProps } from '@/components/ModalTISC/types';
import { getPermission } from '@/services/permission.api';

// for future data
import { ReactComponent as FeebBackIcon } from '@/assets/icons/feedback.svg';
import { ReactComponent as RecommendationIcon } from '@/assets/icons/recommendation.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/share-via-email.svg';

const furturePermissionData = [
  {
    logo: <FeebBackIcon className={styles.menu_item__logo} />,
    name: 'Feedback(future)',
  },
  {
    logo: <RecommendationIcon className={styles.menu_item__logo} />,
    name: 'Recommendation(future)',
  },
  {
    logo: <ShareViaEmailIcon className={styles.menu_item__logo} />,
    name: 'Share via Email(future)',
  },
];

interface TISCAccessLevelModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const TISCAccessLevelModal: FC<TISCAccessLevelModalProps> = ({ visible, setVisible }) => {
  const [data, setData] = useState<AccessLevelModalProps[]>([]);

  // load permission data
  useEffect(() => {
    getPermission().then((permissionData) => {
      if (permissionData) {
        setData(permissionData);
      }
    });
  }, []);

  const handleClickAccessable = (accessItem: AccessLevelModalItemProps) => {
    accessItem.accessable = accessItem.accessable === true ? false : true;

    /// overwrite data
    setData([...data]);
  };

  const renderPermission: any = (menu: AccessLevelModalProps) => {
    return (
      <>
        <tr className={styles.menu} key={menu.name}>
          <td className={classNames(styles.menu_item, !menu.subs && styles.sub_menu)}>
            <img src={menu.logo} className={styles.menu_item__logo} />
            <BodyText fontFamily="Roboto" level={6} customClass={styles.menu_item__name}>
              {menu.name}
            </BodyText>
          </td>

          {/* render icon */}
          {menu.items.map((item) => (
            <>
              <td className={styles.menu_accessable} key={item.id}>
                {item.accessable === true ? (
                  <AccessableTickIcon
                    className={styles.menu_accessable_true}
                    onClick={() => handleClickAccessable(item)}
                  />
                ) : (
                  item.accessable !== null && (
                    <AccessableMinusIcon
                      className={styles.menu_accessable_false}
                      onClick={() => handleClickAccessable(item)}
                    />
                  )
                )}
              </td>

              {/* for future data */}
              <td style={{ textAlign: 'center', display: menu.subs ? 'none' : '' }}>
                <AccessableTickIcon className={styles.menu_accessable_null} />
              </td>
            </>
          ))}
        </tr>
        {/* render subs */}
        {menu.subs?.map((sub) => renderPermission(sub))}
      </>
    );
  };

  return (
    <ModalTISC title="TISC ACCESS LEVEL" visible={visible} setVisible={setVisible}>
      <table className={styles.table} style={{ width: '100%' }}>
        {/* header */}
        <thead className={styles.header}>
          <tr className={styles.header_content}>
            {/* 1st column */}
            <th></th>

            {/* another */}
            <th>
              <MainTitle level={4}>TISC Admin</MainTitle>
            </th>
            {/* future data header, can delete */}
            <th className={styles.furture_data_header}>
              <MainTitle level={4}>TISC Team</MainTitle>
            </th>
            <th>
              <MainTitle level={4}>Consultant Team</MainTitle>
            </th>
          </tr>
        </thead>

        {/* body */}
        <tbody className={styles.body}>
          <>
            {data.map((menu) => renderPermission(menu))}

            {/* future data, can delete */}
            {furturePermissionData.map((fData) => (
              <tr style={{ position: 'relative', top: '4px' }}>
                <td className={styles.furture_data_name}>
                  {fData.logo}
                  <BodyText fontFamily="Roboto" level={6}>
                    {fData.name}
                  </BodyText>
                </td>
                {[1, 2, 3].map(() => (
                  <td style={{ textAlign: 'center' }}>
                    <AccessableTickIcon className={styles.menu_accessable_null} />
                  </td>
                ))}
              </tr>
            ))}
          </>
        </tbody>
      </table>
    </ModalTISC>
  );
};

export default TISCAccessLevelModal;
