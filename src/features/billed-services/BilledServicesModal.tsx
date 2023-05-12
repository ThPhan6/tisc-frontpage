import { FC } from 'react';

import Popover from '@/components/Modal/Popover';
import { BodyText, Title } from '@/components/Typography';

const BilledServicesInfo: FC<{}> = () => {
  return (
    <Popover
      title="BILLED SERVICES"
      visible
      noFooter
      extraTopAction={
        <div className="infoModalContent">
          <div className="text">
            <BodyText level={6} fontFamily="Roboto">
              Regarding the billing services, we partner with a third-party payment gateway company
              to process the payment. Please beware there is a seven (7) days grace period, after
              which 36.5% of interest will apply to the overdue payment. The final payable amount
              also incurs any transaction service fee by others.
              <span className="customText text-uppercase"> All fees are in US Dollars.</span>
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="textContent">
              Below are three steps to accomplish the task.
            </BodyText>
          </div>

          <div className="text">
            <Title level={9} customClass="title">
              01 - Review
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              Click the billing item to review in details.
            </BodyText>
          </div>
          <div className="text">
            <Title level={9} customClass="title">
              02 - Payment
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              Click the <span className="customText uppercase">PAY</span> button to launch the
              payment window, then select the preferred payment method and follow the instructions.
            </BodyText>
          </div>
          <div className="text">
            <Title level={9} customClass="title">
              03 - Confirmation
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              Successful payment will send out the confirmation email to you.
            </BodyText>
          </div>
        </div>
      }
    />
  );
};

export default BilledServicesInfo;
