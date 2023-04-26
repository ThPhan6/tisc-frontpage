import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { Detail } from '@/features/services/components/Detail';

import store from '@/reducers';
import { openModal } from '@/reducers/modal';

import { TableHeader } from '@/components/Table/TableHeader';

const BilledServicesDetail = () => {
  return (
    <div>
      <TableHeader
        customClass="customHeaderTitle"
        title="BILLED SERVICES"
        rightAction={
          <InfoIcon
            onClick={() =>
              store.dispatch(openModal({ type: 'Billed Services', title: 'BILLED SERVICES' }))
            }
          />
        }
      />
      <Detail type="brand" />
    </div>
  );
};

export default BilledServicesDetail;
