import { FC, Fragment, useEffect, useState } from 'react';

import { ReactComponent as AccessableMinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';

import { showImageUrl } from '@/helper/utils';
import { getPermission, updatePermission } from '@/services/permission.api';

import { AccessLevelModalItemProps, AccessLevelModalProps } from '@/components/TISCModal/types';

import TISCModal from '@/components/TISCModal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AccessLevelModal.less';

interface BrandAccessLevelModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const BrandAccessLevelModal: FC<BrandAccessLevelModalProps> = ({ visible, setVisible }) => {
  const [data, setData] = useState<AccessLevelModalProps[]>([]);

  // load permission data
  useEffect(() => {
    getPermission().then(setData);
  }, []);

  const handleClickAccessable = (accessItem: AccessLevelModalItemProps) => {
    accessItem.accessable = accessItem.accessable === true ? false : true;
    /// overwrite data
    setData([...data]);
    /// update to server
    updatePermission(accessItem.id).then((isSuccess) => {
      if (!isSuccess) {
        /// revert changes
        accessItem.accessable = accessItem.accessable === true ? false : true;
        setData([...data]);
      }
    });
  };

  const renderPermission: any = (menu: AccessLevelModalProps, type: string) => {
    return (
      <Fragment key={menu.name}>
        <tr className={styles.menu}>
          <td className={`${styles.menu_item} ${type === 'sub-item' ? styles.sub_menu : ''}`}>
            <img src={showImageUrl(menu.logo!)} className={styles.menu_item__logo} />
            <BodyText fontFamily="Roboto" level={6} customClass={styles.menu_item__name}>
              {menu.name}
            </BodyText>
          </td>

          {/* render icon */}
          {menu.items.map((item, key) => (
            <Fragment key={key}>
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
              <td
                key={`fData_${item.id}`}
                style={{ textAlign: 'center', display: menu.subs ? 'none' : '' }}>
                <AccessableTickIcon className={styles.menu_accessable_null} />
              </td>
              {/* --------- */}
            </Fragment>
          ))}
        </tr>
        {/* render subs */}
        {menu.subs?.map((sub) => renderPermission(sub, 'sub-item'))}
      </Fragment>
    );
  };

  return (
    <TISCModal title="BRAND ACCESS LEVEL" visible={visible} setVisible={setVisible}>
      <table className={styles.table} style={{ width: '100%' }}>
        {/* header */}
        <thead className={styles.header}>
          <tr className={styles.header_content}>
            {/* 1st column */}
            <th></th>

            {/* another */}
            <th>
              <MainTitle textAlign="center" level={4}>
                Brand Admin
              </MainTitle>
            </th>
            {/* future data header, can delete */}
            <th className={styles.furture_data_header}>
              <MainTitle textAlign="center" level={4}>
                Brand Lead
              </MainTitle>
            </th>
            {/* ---------- */}
            <th>
              <MainTitle textAlign="center" level={4}>
                Brand Team
              </MainTitle>
            </th>
          </tr>
        </thead>

        {/* body */}
        <tbody className={styles.body}>
          <>
            {/* main content */}
            {data.map((menu) => renderPermission(menu, ''))}
            <tr>
              <td></td>
              <td></td>
              <td style={{ color: '#bfbfbf', textAlign: 'center', fontSize: 12 }}>(future)</td>
              <td></td>
            </tr>
            {/* ------- */}
          </>
        </tbody>
      </table>
    </TISCModal>
  );
};

export default BrandAccessLevelModal;
