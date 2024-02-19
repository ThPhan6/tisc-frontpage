import { FC, useState } from 'react';

import { NotificationsIcons, ProjectTrackingNotificationType, RequestsIcons } from '../constant';
import { PATH } from '@/constants/path';
import { message } from 'antd';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';
import { getFullName } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { ActionTaskModalParams } from '../../GeneralInquiries/types';
import { ProjectTrackingDetail, RequestAndNotificationDetail } from '@/types/project-tracking.type';

import { ActionTaskTable } from '@/components/ActionTask/table';
import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import CustomButton from '@/components/Button';
import { EmptyOne } from '@/components/Empty';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { TableHeader } from '@/components/Table/TableHeader';

import styles from './DesignFirm.less';
import { ProjectTrackingTabs } from './Detail';
import moment from 'moment';

interface RequestsAndNotificationsProps {
  projectId?: string;
  requestAndNotification: RequestAndNotificationDetail[];
  activeKey: ProjectTrackingTabs;
  setData: (setState: (prevState: ProjectTrackingDetail) => ProjectTrackingDetail) => void;
}
interface RequestAndNotificationListProps extends RequestsAndNotificationsProps {
  setDetailItem: (item: RequestAndNotificationDetail | undefined) => void;
  setIndexItem: (index: number) => void;
}

interface DetaiItemProps extends Partial<RequestAndNotificationListProps> {
  detailItem: RequestAndNotificationDetail;
  indexItem: number;
  handleCloseDetailItem: () => void;
}

const RequestAndNotificationList: FC<RequestAndNotificationListProps> = ({
  requestAndNotification,
  activeKey,
  setData,
  setDetailItem,
  setIndexItem,
}) => {
  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <tbody>
          {requestAndNotification.length > 0 ? (
            requestAndNotification.map((item, index) => (
              <tr
                onClick={() => {
                  setDetailItem(item);
                  setIndexItem(index);
                  setData((prevData) => {
                    const newData = cloneDeep(prevData);

                    if (activeKey === 'request') {
                      newData.isRequestsDetailItemOpen = true;
                      newData.projectRequests[index].newRequest = false;
                    }

                    if (activeKey === 'notification') {
                      newData.isNotificationsDetailItemOpen = true;
                      newData.notifications[index].newNotification = false;
                    }
                    return newData;
                  });
                }}
                key={index}
              >
                <td className={styles.date}>
                  {moment(item.title.created_at).format('YYYY-MM-DD')}
                </td>
                <td className={styles.projectName}>
                  {activeKey === 'request'
                    ? item.title.name
                    : ProjectTrackingNotificationType[item.title.name]}
                  {item.read ? <UnreadIcon /> : ''}
                </td>
                <td className={styles.action}>
                  {activeKey === 'request'
                    ? RequestsIcons[item.status]
                    : NotificationsIcons[item.status]}
                </td>
              </tr>
            ))
          ) : (
            <EmptyOne customClass={styles.empty} />
          )}
        </tbody>
      </table>
    </div>
  );
};

const DetaiItem: FC<DetaiItemProps> = ({
  detailItem,
  activeKey,
  setData,
  indexItem,
  handleCloseDetailItem,
}) => {
  return (
    <div style={{ overflow: 'auto' }} className={`mainContent ${styles.detailContent}`}>
      <TableHeader
        title={
          <>
            <span style={{ marginRight: '12px' }}>
              {moment(detailItem.title.created_at).format('YYYY-MM-DD')}{' '}
            </span>
            <span>
              {activeKey === 'request'
                ? detailItem.title.name
                : ProjectTrackingNotificationType[detailItem.title.name]}
            </span>
          </>
        }
        rightAction={<CloseIcon style={{ cursor: 'pointer' }} onClick={handleCloseDetailItem} />}
        customClass={styles.customHeader}
      />
      <BrandProductBasicHeader
        image={detailItem.product.images[0]}
        text_1={detailItem.product.collection_name}
        text_2={detailItem.product.description}
        text_3={
          <a
            href={`${window.location.origin}/brand/product/${detailItem.product.id}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#000' }}
          >
            {window.location.origin}/brand/product/{detailItem.product.id}
          </a>
        }
        customClass={styles.brandProduct}
      />
      <TextForm boxShadow label={activeKey === 'request' ? 'Requester' : 'Modifier'}>
        {getFullName(detailItem.designer)}
      </TextForm>

      <TextForm boxShadow label="Position/Role">
        {detailItem.designer.position}
      </TextForm>
      <TextForm boxShadow label="Work Email">
        {detailItem.designer.email}
      </TextForm>
      <FormGroup
        label="Work Phone"
        layout="vertical"
        labelColor="mono-color-dark"
        formClass={activeKey === 'request' ? '' : styles.marginBottomNone}
      >
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
      {activeKey === 'request' ? (
        <>
          <TextForm boxShadow label="Title">
            {detailItem.request?.title}
          </TextForm>
          <FormGroup
            label="Message"
            layout="vertical"
            labelColor="mono-color-dark"
            formClass={styles.marginBottomNone}
          >
            <CustomTextArea
              value={detailItem.request?.message}
              className={styles.customTextArea}
              readOnly
            />
          </FormGroup>
        </>
      ) : null}

      <ActionTaskTable
        model_id={detailItem.id}
        model_name={activeKey as ActionTaskModalParams['model_name']}
        setData={setData}
        indexItem={indexItem}
      />
    </div>
  );
};

export const RequestsAndNotifications: FC<RequestsAndNotificationsProps> = ({
  requestAndNotification,
  activeKey,
  setData,
  projectId,
}) => {
  const [detailItem, setDetailItem] = useState<RequestAndNotificationDetail>();
  const [indexItem, setIndexItem] = useState<number>(0);

  const handleCloseDetailItem = () => {
    setDetailItem(undefined);
    setData((prevData) => {
      const newData = cloneDeep(prevData);

      if (activeKey === 'request') {
        newData.isRequestsDetailItemOpen = false;
      }

      if (activeKey === 'notification') {
        newData.isNotificationsDetailItemOpen = false;
      }

      return newData;
    });
  };

  const handleShowProjectProduct = () => {
    // if (!projectId) {
    //   message.error('Project not found');
    //   return;
    // }

    pushTo(
      PATH.designerUpdateProject.replace(
        ':id',
        '38ba3ca1-db51-47c4-8b9f-ef2a1b7aafae',
        /* projectId */
      ),
    );
  };

  return (
    <>
      {detailItem === undefined ? (
        <RequestAndNotificationList
          requestAndNotification={requestAndNotification}
          activeKey={activeKey}
          setData={setData}
          setDetailItem={setDetailItem}
          setIndexItem={setIndexItem}
        />
      ) : (
        <>
          <DetaiItem
            detailItem={detailItem}
            indexItem={indexItem}
            activeKey={activeKey}
            setData={setData}
            handleCloseDetailItem={handleCloseDetailItem}
          />
          <div className={`footer-button ${styles.cancelButton}`}>
            {activeKey === 'request' ? (
              <CustomButton
                size="small"
                variant="primary"
                properties="rounded"
                onClick={handleShowProjectProduct}
                style={{ padding: '0px 16px' }}
              >
                Request Detail
              </CustomButton>
            ) : null}

            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              onClick={handleCloseDetailItem}
            >
              Done
            </CustomButton>
          </div>
        </>
      )}
    </>
  );
};
