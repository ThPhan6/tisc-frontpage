import { ReactNode, useState } from 'react';

import { Collapse, Modal, Radio, type RadioChangeEvent } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/Modal/styles/LocationOffice.less';
import { BodyText, RobotoBodyText } from '@/components/Typography';

const { Panel } = Collapse;

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  email: string;
  phone: string;
}

interface Country {
  id: string;
  name: string;
  locations: Location[];
}

interface LocationOfficeProps {
  title: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  countries: Country[];
}

const LocationOffice = ({ title, countries, onSave, isOpen, onClose }: LocationOfficeProps) => {
  const [selectedValue, setSelectedvalue] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string[]>([countries[0]?.id]);

  const handleRadioChange = (event: RadioChangeEvent) =>
    selectedValue === event.target.value
      ? setSelectedvalue(null)
      : setSelectedvalue(event.target.value);

  const expandIcon = (panelProps: any) => {
    const isActive = panelProps.isActive ?? false;
    return isActive ? <DropupIcon /> : <DropdownIcon />;
  };

  const handlePanelChange = (key: string | string[]) =>
    setActivePanel(Array.isArray(key) ? key.slice(-1) : [key]);

  return (
    <Modal
      title={
        <BodyText level={3} customClass={styles.location_office_title}>
          {title}
        </BodyText>
      }
      footer={<CustomSaveButton contentButton="Done" />}
      open={isOpen}
      onCancel={onClose}
      onOk={onSave}
      className={styles.location_office}
    >
      <Collapse
        defaultActiveKey={[countries[0].name]}
        expandIconPosition="end"
        expandIcon={expandIcon}
        activeKey={activePanel}
        onChange={handlePanelChange}
      >
        {countries.map((country) => (
          <Panel
            header={
              <RobotoBodyText customClass={styles.location_office_country_name}>
                {country.name}{' '}
                <span className={styles.location_office_country_length}>
                  ({country.locations.length})
                </span>
              </RobotoBodyText>
            }
            key={country.id}
          >
            {country.locations.map((location) => (
              <div className={styles.location_office_location_wrapper} key={location.id}>
                <section>
                  <article className="d-flex items-center mb-8-px">
                    <RobotoBodyText customClass={styles.location_office_location_name} level={6}>
                      {location.name}
                    </RobotoBodyText>
                    <RobotoBodyText level={6}>({location.type})</RobotoBodyText>
                  </article>
                  <RobotoBodyText customClass="mb-8-px" level={6}>
                    {location.address}
                  </RobotoBodyText>
                  <div className="d-flex items-center">
                    <BodyText customClass="mr-16 d-flex items-center" level={4}>
                      Email:{' '}
                      <RobotoBodyText customClass="ml-16" level={6}>
                        {location.email}
                      </RobotoBodyText>
                    </BodyText>
                    <BodyText customClass="mr-16 d-flex items-center" level={4}>
                      Phone:{' '}
                      <RobotoBodyText customClass="ml-16" level={6}>
                        {location.phone}
                      </RobotoBodyText>
                    </BodyText>
                  </div>
                </section>
                <Radio
                  value={location.id}
                  checked={selectedValue === location.id}
                  onChange={handleRadioChange}
                />
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
    </Modal>
  );
};

export default LocationOffice;
