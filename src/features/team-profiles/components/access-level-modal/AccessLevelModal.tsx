import { FC, Fragment, useEffect, useState } from 'react';

import { ReactComponent as AccessableMinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';

import { showImageUrl } from '@/helper/utils';
import { getPermission, updatePermission } from '@/services/permission.api';

import { PermissionData, PermissionItem } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AccessLevelModal.less';

interface AccessLevelModalForm {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  titleColumnData?: { title: string; unuse?: boolean }[];
  headerTitle: string;
  showMyDashboard?: boolean;
}

const AccessLevelModal: FC<AccessLevelModalForm> = ({
  visible,
  setVisible,
  titleColumnData,
  headerTitle,
  showMyDashboard,
  children,
}) => {
  const [data, setData] = useState<PermissionData[]>([]);
  const [unclickableData, setUnclickableData] = useState<string[]>([]);

  // load permission data
  useEffect(() => {
    getPermission()
      .then((res) => {
        if (res) {
          setData(res);
          return res;
        }

        return [] as PermissionData[];
      })
      .then((res) => {
        // set unlickable if Overal Listing of Project has accessable false
        const projectFound = res?.find(
          (projectPermission) =>
            projectPermission.id === 'permission_13' && projectPermission.subs?.length,
        );

        if (projectFound && projectFound.subs?.[0]) {
          projectFound.subs[0].items.forEach((item) => {
            if (item.accessable === false) {
              const newSubs = projectFound.subs?.slice(1);
              const subItemId: string[] = [];

              newSubs?.forEach((sub) => {
                sub.items.forEach((el) => {
                  if (el.accessable === false) {
                    subItemId.push(el.id);
                  }
                });
              });

              setUnclickableData(subItemId);
            }
          });
        }
      });
  }, []);

  const handleClickAccessable = (accessItem: PermissionItem, unClickable: boolean) => () => {
    if (unClickable) {
      return undefined;
    }

    accessItem.accessable = !accessItem.accessable;

    // set unlickable if Overal Listing of Project has accessable false
    const projectFound = data.find(
      (projectPermission) =>
        projectPermission.id === 'permission_13' && projectPermission.subs?.length,
    );

    if (projectFound && projectFound.subs?.[0]) {
      const isOveralListingFalse = projectFound.subs[0].items.some(
        (item) => item.id === accessItem.id && item.accessable === false,
      );

      const subItemId: string[] = [];
      if (isOveralListingFalse) {
        // get the rest of project permission to set its accessable false
        const newSubs = projectFound.subs.slice(1);

        newSubs?.forEach((sub) => {
          const projectSubPermission = sub.items.find((el) => el.name === accessItem.name);

          if (projectSubPermission) {
            projectSubPermission.accessable = false;
            // for update UI
            subItemId.push(projectSubPermission.id);
          }
        });
      }
      setUnclickableData(subItemId);
    }

    /// overwrite data
    setData([...data]);
    /// update to server
    updatePermission(accessItem.id).then((isSuccess) => {
      // if failed to update
      if (!isSuccess) {
        /// revert changes
        accessItem.accessable = !accessItem.accessable;
        setData([...data]);
      }
    });
  };

  const renderPermission: any = (menu: PermissionData, type: string) => {
    return (
      <Fragment key={menu.name}>
        <tr className={styles.menu}>
          <td className={`${styles.menu_item} ${type === 'sub-item' ? styles.sub_menu : ''}`}>
            {menu.logo ? (
              <img src={showImageUrl(menu.logo)} className={styles.menu_item__logo} />
            ) : (
              <span></span>
            )}

            <BodyText fontFamily="Roboto" level={6} customClass={styles.menu_item__name}>
              {menu.name}
            </BodyText>
          </td>
          {/* render icon */}
          {!menu.subs?.length
            ? menu.items.map((item, key) => {
                // check for update UI
                const unClickable = unclickableData?.includes(item.id);
                const adminPermission = item.name.toLocaleLowerCase().indexOf('admin') !== -1;

                return (
                  <Fragment key={key}>
                    <td className={styles.menu_accessable} key={item.id}>
                      {item.accessable === true ? (
                        <AccessableTickIcon
                          className={` ${adminPermission ? 'cursor-disabled' : 'cursor-pointer'}`}
                          onClick={handleClickAccessable(item, adminPermission)}
                        />
                      ) : (
                        <AccessableMinusIcon
                          className={`cursor-pointer ${
                            unClickable ? styles.menu_accessable_null : styles.menu_accessable_true
                          }`}
                          onClick={handleClickAccessable(item, adminPermission)}
                        />
                      )}
                    </td>

                    {/* for future data */}
                    <td
                      key={`fData_${item.id}`}
                      style={{ textAlign: 'center', display: !menu.subs ? 'none' : '' }}>
                      <AccessableTickIcon className={styles.menu_accessable_null} />
                    </td>
                    {/* --------- */}
                  </Fragment>
                );
              })
            : null}
        </tr>

        {/* render subs */}
        {menu.subs?.map((sub) => renderPermission(sub, 'sub-item'))}
      </Fragment>
    );
  };

  return (
    <Popover
      title={headerTitle}
      visible={visible}
      setVisible={(open) => (open ? undefined : setVisible(false))}
      className={styles.accessModal}
      noFooter>
      <table className={styles.table} style={{ width: '100%' }}>
        {/* header */}
        <thead className={styles.header}>
          <tr className={styles.header_content}>
            {/* 1st column */}
            <th></th>

            {/* another */}
            {titleColumnData
              ? titleColumnData.map((title) => (
                  <th className={title.unuse ? styles.furture_data_header : ''}>
                    <MainTitle textAlign="center" level={4}>
                      {title.title}
                    </MainTitle>
                  </th>
                ))
              : null}
          </tr>
        </thead>

        {/* body */}
        <tbody className={styles.body}>
          <>
            {showMyDashboard ? (
              <tr>
                <td>
                  <BodyText fontFamily="Roboto" level={6} customClass={styles.my_dashboard}>
                    MY DASHBOARD (future)
                  </BodyText>
                </td>
                {[1, 2].map((item) => (
                  <td key={`icon_${item}`} style={{ textAlign: 'center' }}>
                    <AccessableTickIcon className={styles.menu_accessable_null} />
                  </td>
                ))}
                <td style={{ textAlign: 'center' }}>
                  <AccessableMinusIcon className={styles.menu_accessable_null} />
                </td>
              </tr>
            ) : null}

            {/* main content */}
            {data.map((menu) => renderPermission(menu, ''))}

            {children}

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
    </Popover>
  );
};

export default AccessLevelModal;
