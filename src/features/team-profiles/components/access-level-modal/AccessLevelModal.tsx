import { FC, Fragment, useEffect, useState } from 'react';

import { ReactComponent as AccessableMinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';
import { ReactComponent as FeebBackIcon } from '@/assets/icons/feedback.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as RecommendationIcon } from '@/assets/icons/recommendation.svg';

import { showImageUrl } from '@/helper/utils';
import { getPermission, updatePermission } from '@/services/permission.api';

import { useAppSelector } from '@/reducers';
import { modalPropsSelector } from '@/reducers/modal';
import { PermissionData, PermissionItem } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AccessLevelModal.less';

const TABLE_COL = {
  brand: [{ title: 'Brand Admin' }, { title: ' Brand Lead', unuse: true }, { title: 'Brand Team' }],
  designer: [
    { title: 'Design Admin' },
    { title: ' Design Lead', unuse: true },
    { title: 'Design Team' },
  ],
  tisc: [
    { title: 'TISC Admin' },
    { title: ' TISC Team', unuse: true },
    { title: 'Consultant Team' },
  ],
};

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

const AccessLevelModal: FC = () => {
  const { type } = useAppSelector(modalPropsSelector).accessLevel;

  const [data, setData] = useState<PermissionData[]>([]);

  // load permission data
  useEffect(() => {
    getPermission().then((res) => {
      if (res) {
        setData(res);
        return res;
      }

      return [] as PermissionData[];
    });
  }, []);

  const handleClickAccessable = (accessItem: PermissionItem, unClickable: boolean) => () => {
    if (unClickable) {
      return undefined;
    }

    accessItem.accessable = !accessItem.accessable;

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

  const renderPermission: any = (menu: PermissionData, subType: string) => {
    return (
      <Fragment key={menu.name}>
        <tr className={styles.menu}>
          <td className={`${styles.menu_item} ${subType === 'sub-item' ? styles.sub_menu : ''}`}>
            {menu.logo ? (
              <img
                src={showImageUrl(menu.logo)}
                className={styles.menu_item__logo}
                style={{ marginRight: type === 'tisc' ? 8 : 12 }}
              />
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
                          className={`cursor-pointer`}
                          onClick={handleClickAccessable(item, adminPermission)}
                        />
                      )}
                    </td>

                    {/* for future data */}
                    <td
                      key={`fData_${item.id}`}
                      style={{ textAlign: 'center', display: !menu.subs ? 'none' : '' }}
                    >
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
    <Popover title={`${type} Access level`} visible className={styles.accessModal} noFooter>
      <table className={styles.table} style={{ width: '100%' }}>
        {/* header */}
        <thead className={styles.header}>
          <tr className={styles.header_content}>
            {/* 1st column */}
            <th></th>

            {/* another */}
            {TABLE_COL[type]?.map((title) => (
              <th className={title.unuse ? styles.furture_data_header : ''}>
                <MainTitle textAlign="center" level={4}>
                  {title.title}
                </MainTitle>
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody className={styles.body}>
          <>
            {type === 'tisc' ? (
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

            {type === 'tisc'
              ? furturePermissionData.map((fData, index) => (
                  <tr key={`futureData_${index}`}>
                    <td className={`${styles.furture_data_name} ${styles.menu_item}`}>
                      {fData.logo}
                      <BodyText fontFamily="Roboto" level={6}>
                        {fData.name}
                      </BodyText>
                    </td>
                    {[1, 2, 3].map((_, i) => (
                      <td key={`${index}_${i}`} style={{ textAlign: 'center' }}>
                        <AccessableTickIcon className={styles.menu_accessable_null} />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

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
