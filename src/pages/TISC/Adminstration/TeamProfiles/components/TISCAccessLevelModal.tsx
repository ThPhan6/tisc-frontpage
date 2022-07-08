import { FC, useEffect, useState } from 'react';
import styles from '../styles/TISCAccessLevelModal.less';
import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';
import { ReactComponent as AccessableMinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { BodyText, MainTitle } from '@/components/Typography';
import classNames from 'classnames';
import ModalTISC from '@/components/ModalTISC';
import { AccessLevelModalItemProps, AccessLevelModalProps } from '@/components/ModalTISC/types';
import { getPermission } from '@/services/permission.api';

const furture__permission_data = [
  {
    logo: 'logo/feedback.svg',
    name: 'Feedback(future)',
    number: 1,
    parent_number: null,
    items: [
      { accessable: null, id: 'b185a556-efb1-4eb0-bb03-25215005clkm', name: 'TISC Admin' },
      { accessable: null, id: '12a4c61b-749b-4014-a125-9951a97e2cdb', name: 'Consultant Team' },
    ],
  },
  {
    logo: 'logo/recommendation.svg',
    name: 'Recommendation(future)',
    number: 1,
    parent_number: null,
    items: [
      { accessable: null, id: 'b185a556-efb1-4eb0-bb03-25215005cacc', name: 'TISC Admin' },
      { accessable: null, id: '12a4c61b-749b-4014-a125-9951a97e2bfr', name: 'Consultant Team' },
    ],
  },
  {
    logo: 'logo/share_via_email.svg',
    name: 'Share via Email(future)',
    number: 1,
    parent_number: null,
    items: [
      { accessable: null, id: 'b185a556-efb1-4eb0-bb03-252150051232', name: 'TISC Admin' },
      { accessable: null, id: '12a4c61b-749b-4014-a125-9951a97e2873', name: 'Consultant Team' },
    ],
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
              <td></td>
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
            <th className={styles.furture_data}>
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
            <div className={styles.furture_data}>
              {furture__permission_data.map((fData) => renderPermission(fData))}
            </div>
          </>
        </tbody>
      </table>
    </ModalTISC>
  );
};

export default TISCAccessLevelModal;
