import { FC, useState } from 'react';

import { RequestsIcons } from '../constant';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { DEFAULT_REQUESTS, Requests } from '@/types/project-tracking.type';

import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import TextForm from '@/components/Form/TextForm';
import { TableHeader } from '@/components/Table/TableHeader';

// import { TableTask } from '@/components/TableTask';
import styles from './DesignFirm.less';
import moment from 'moment';

interface BrandRequestsProps {
  requests: Requests[];
}
export const BrandRequests: FC<BrandRequestsProps> = ({ requests }) => {
  const [showDetail, setShowDetail] = useState(true);
  const [detailItem, setDetailItem] = useState<Requests>(DEFAULT_REQUESTS);

  const showDetailRequest = (request: Requests) => {
    setShowDetail(false);
    setDetailItem(request);
  };

  return (
    <div className={styles.content}>
      {showDetail ? (
        // <>
        //   {requests.map((request) => (
        //     <div className={styles.requests}>
        //       <div className={styles.item}>
        //         <BodyText level={5} fontFamily="Roboto" style={{ marginRight: '12px' }}>
        //           {moment(request.created_at).format('YYYY-MM-DD')}
        //         </BodyText>
        //         <BodyText level={5} fontFamily="Roboto">
        //           {request.requestFor} {request.newRequest ? <UnreadIcon /> : ''}
        //         </BodyText>
        //       </div>

        //       <span>{RequestsIcons[request.status]}</span>
        //     </div>
        //   ))}
        // </>
        <table className={styles.table}>
          <tbody>
            {requests.map((request) => (
              <tr onClick={() => showDetailRequest(request)}>
                <td className={styles.date}>{moment(request.created_at).format('YYYY-MM-DD')}</td>
                <td className={styles.projectName}>
                  {request.requestFor} {request.newRequest ? <UnreadIcon /> : ''}
                </td>
                <td className={styles.action}>{RequestsIcons[request.status]}</td>
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
                  {moment(detailItem.created_at).format('YYYY-MM-DD')}{' '}
                </span>
                <span>{detailItem.requestFor}</span>
              </>
            }
            rightAction={
              <CloseIcon style={{ cursor: 'pointer' }} onClick={() => setShowDetail(true)} />
            }
            customClass={styles.customHeader}
          />
          <BrandProductBasicHeader
            image={detailItem.product.images[0]}
            text_1={detailItem.product.collection_name}
            text_2={detailItem.product.description}
            text_3={'htttp:///'}
            customClass={styles.brandProduct}
          />
          <TextForm boxShadow label="Title">
            {detailItem.title}
          </TextForm>

          <FormGroup label="Message" layout="vertical" labelColor="mono-color-dark">
            <CustomTextArea value={detailItem.message} className={styles.customTextArea} readOnly />
          </FormGroup>
          {/* <TableTask /> */}
        </>
      )}
    </div>
  );
};
