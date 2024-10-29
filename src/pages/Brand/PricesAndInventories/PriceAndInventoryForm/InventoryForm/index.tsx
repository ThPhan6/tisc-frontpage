import { Table, type TableColumnsType } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import type { ModalType } from '@/reducers/modal';

import InputGroup from '@/components/EntryForm/InputGroup';
import InfoModal from '@/components/Modal/InfoModal';
import LocationOffice from '@/components/Modal/LocationOffice';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

interface InventoryFromProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
}

const InventoryForm = ({ isShowModal, onToggleModal }: InventoryFromProps) => {
  const inventoryColumn: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: 'WareHouse Name',
      dataIndex: 'warehouse_name',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
      title: 'Country',
      dataIndex: 'country',
    },
    {
      title: 'In stock',
      dataIndex: 'in_stock',
      align: 'center',
      render: (_: any, item: any) => (
        <EditableCell
          item={item}
          columnKey="add_to"
          defaultValue="6"
          valueClass="indigo-dark-variant"
          onSave={() => {}}
        />
      ),
    },
    {
      render: () => <TrashIcon className="cursor-pointer" />,
    },
  ];

  const inventoryInfo = {
    title: 'BASE & VOLUME PRICE',
    content: [
      {
        id: 1,
        description: (
          <>
            The Inventory Management allows all stakeholders accurately and quickly monitoring the
            stock and order movement.
          </>
        ),
      },
      {
        id: 2,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Location
          </BodyText>
        ),
        description: (
          <>
            Require pre-entry of the warehouse location under the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Administration/Locations
            </CormorantBodyText>{' '}
            section.
          </>
        ),
      },
      {
        id: 3,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Total Stock
          </BodyText>
        ),
        description: <>Consolidated total number of products in the warehouse.</>,
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Out of Stock
          </BodyText>
        ),
        description: (
          <>Also referred as the stock shortage. The shortage number highlights in red colour.</>
        ),
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            On Order
          </BodyText>
        ),
        description: <>Consolidated total number of orders from the project.</>,
      },
      {
        id: 5,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Backorder
          </BodyText>
        ),
        description: (
          <>
            Consolidated total number of orders that are under manufacturing but have not shipped
            out yet to the warehouse. The number can be manually converted into each warehouse and
            the system will update the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Total Stock
            </CormorantBodyText>{' '}
            accordingly.
          </>
        ),
      },
    ],
  };

  const handleSaveLocationOffice = (value: any) => {};

  return (
    <>
      <article className={styles.category_form_content}>
        <section
          className="d-flex items-center justify-between w-full border-bottom-black-inset"
          style={{ height: 28 }}
        >
          <Title
            customClass={`${styles.category_form_content_title} shadow-none d-flex items-center`}
          >
            INVENTORY MANAGEMENT
            <WarningIcon className="ml-16 cursor-pointer" onClick={onToggleModal('Inventory')} />
          </Title>
          <CustomPlusButton customClass="pb-16" />
        </section>
        <div className="mt-8">
          <InputGroup
            label="Location :"
            fontLevel={3}
            placeholder="select from the list"
            value={''}
            hasBoxShadow
            hasPadding
            rightIcon
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onRightIconClick={onToggleModal('Location')}
          />
        </div>
        <form className="d-flex items-center gap-16">
          <InputGroup
            label="Total Stock :"
            fontLevel={3}
            placeholder="type number"
            value={''}
            hasBoxShadow
            hasPadding
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
          />
          <InputGroup
            label="Out of Stock :"
            fontLevel={3}
            placeholder="type number"
            value={''}
            hasBoxShadow
            hasPadding
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
          />
          <InputGroup
            label="On Order :"
            fontLevel={3}
            placeholder="type number"
            value={''}
            hasBoxShadow
            hasPadding
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
          />
          <InputGroup
            label="Back Order :"
            fontLevel={3}
            placeholder="type number"
            value={''}
            hasBoxShadow
            hasPadding
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
          />
        </form>

        <Table
          dataSource={[
            {
              key: '1',
              id: '1',
              warehouse_name: 'XXXX-Name-A',
              city: 'Singapore',
              country: 'Singapore',
              in_stock: '18',
            },
            {
              key: '2',
              id: '2',
              warehouse_name: 'XXXX-Name-B',
              city: 'Da nang',
              country: 'Vietname',
              in_stock: '12',
            },
          ]}
          columns={inventoryColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
        />
      </article>

      <LocationOffice
        title="SELECT LOCATION"
        isOpen={isShowModal === 'Location'}
        onClose={onToggleModal('none')}
        countries={[
          {
            id: '1',
            name: 'Singapore',
            items: [
              {
                id: '1',
                name: 'TISC Pte, Ltd.',
                type: 'Headquarter',
                address: '1 Coleman Street, #10-06, The Adelphi, CBD Area, 179803',
                email: 'general@brandname.com',
                phone: '+65 6331 2121',
              },
            ],
          },
          {
            id: '2',
            name: 'VietNam',
            items: [
              {
                id: '2',
                name: 'Enable Startup.',
                type: 'Headquarter',
                address: '104 - 106 Nui Thanh',
                email: 'general@brandname.com',
                phone: '+00 000000000',
              },
            ],
          },
        ]}
        onSave={handleSaveLocationOffice}
      />

      <InfoModal
        isOpen={isShowModal === 'Inventory'}
        onCancel={onToggleModal('none')}
        title={inventoryInfo.title}
        content={inventoryInfo.content}
        additionalContentClass={styles.category_form_info_modal}
      />
    </>
  );
};

export default InventoryForm;
