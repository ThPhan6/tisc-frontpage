import { FC, useState } from 'react';

import { NotificationsIcons, ProjectTrackingNotificationType, RequestsIcons } from '../constant';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { getFullName } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { ProjectTrackingDetail, RequestAndNotificationDetail } from '@/types/project-tracking.type';

import { ActionTaskTable } from '@/components/ActionTask/table';
import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { TableHeader } from '@/components/Table/TableHeader';

import styles from './DesignFirm.less';
import moment from 'moment';

interface RequestsAndNotificationsProps {
  requestAndNotification: RequestAndNotificationDetail[];
  type: 'request' | 'notification';
  setData: (setState: (prevState: ProjectTrackingDetail) => ProjectTrackingDetail) => void;
}
export const RequestsAndNotifications: FC<RequestsAndNotificationsProps> = ({
  requestAndNotification,
  type,
  setData,
}) => {
  const [detailItem, setDetailItem] = useState<RequestAndNotificationDetail>();
  const [indexItem, setIndexItem] = useState<number>(0);
  return (
    <div className={styles.content}>
      {detailItem === undefined ? (
        <table className={styles.table}>
          <tbody>
            {requestAndNotification.map((item, index) => (
              <tr
                onClick={() => {
                  setDetailItem(item);
                  setIndexItem(index);
                  setData((prevData) => {
                    const newData = cloneDeep(prevData);
                    if (type === 'request') {
                      newData.projectRequests[index].newRequest = false;
                    } else {
                      newData.notifications[index].newNotification = false;
                    }
                    return newData;
                  });
                }}
                key={index}>
                <td className={styles.date}>
                  {moment(item.title.created_at).format('YYYY-MM-DD')}
                </td>
                <td className={styles.projectName}>
                  {type === 'request'
                    ? item.title.name
                    : ProjectTrackingNotificationType[item.title.name]}
                  {item.read ? <UnreadIcon /> : ''}
                </td>
                <td className={styles.action}>
                  {type === 'request'
                    ? RequestsIcons[item.status]
                    : NotificationsIcons[item.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <TableHeader
            title={
              <>
                <span style={{ marginRight: '12px' }}>
                  {moment(detailItem.title.created_at).format('YYYY-MM-DD')}{' '}
                </span>
                <span>
                  {type === 'request'
                    ? detailItem.title.name
                    : ProjectTrackingNotificationType[detailItem.title.name]}
                </span>
              </>
            }
            rightAction={
              <CloseIcon
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setDetailItem(undefined);
                }}
              />
            }
            customClass={styles.customHeader}
          />
          <BrandProductBasicHeader
            image={detailItem.product.images[0]}
            text_1={detailItem.product.collection_name}
            text_2={detailItem.product.description}
            text_3={`http://tisc.global/public/product?id=${detailItem.product.id}`}
            customClass={styles.brandProduct}
          />
          <TextForm boxShadow label={type === 'request' ? 'Requester' : 'Modifier'}>
            {getFullName(detailItem.designer)}
          </TextForm>

          <TextForm boxShadow label="Position/Role">
            {detailItem.designer.position}
          </TextForm>
          <TextForm boxShadow label="Work Email">
            {detailItem.designer.email}
          </TextForm>
          <FormGroup label="Work Phone" layout="vertical" labelColor="mono-color-dark">
            <PhoneInput
              codeReadOnly
              phoneNumberReadOnly
              value={{
                zoneCode: detailItem.designer.phone_code,
                phoneNumber: detailItem.designer.phone,
              }}
              containerClass={styles.customPhoneCode}
            />
          </FormGroup>
          {type === 'request' && (
            <>
              <TextForm boxShadow label="Title">
                {detailItem.request?.title}
              </TextForm>
              <FormGroup label="Message" layout="vertical" labelColor="mono-color-dark">
                <CustomTextArea
                  value={detailItem.request?.message}
                  className={styles.customTextArea}
                  readOnly
                />
              </FormGroup>
            </>
          )}

          <ActionTaskTable
            model_id={detailItem.id}
            model_name={type}
            setData={setData}
            indexItem={indexItem}
          />
        </>
      )}
    </div>
  );
};
