import { FC } from 'react';

import { RenderEntireProjectLabel } from '@/components/RenderHeaderLabel';
import { RobotoBodyText } from '@/components/Typography';

import { VendorLocation } from '@/features/vendor-location/VendorLocation';

interface VendorTabProps {
  productId: string;
  brandId: string;
}

const VendorTab: FC<VendorTabProps> = ({ productId, brandId }) => {
  return (
    <div>
      <RenderEntireProjectLabel
        title="Contact & Address"
        overLayWidth={'193px'}
        toolTiptitle={
          <RobotoBodyText level={6}>
            Confirm project location-based or your prefered vendor contact/address information.
          </RobotoBodyText>
        }
      />

      <VendorLocation brandId={brandId} productId={productId} />
    </div>
  );
};
export default VendorTab;
