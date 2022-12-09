import { FC, useEffect, useState } from 'react';

import { getBrandPagination } from '@/features/user-group/services/brand.api';
import { getFullName } from '@/helper/utils';

import { setServiceFormData } from '../reducer';
import { RoleIndex } from '../type';
import { RadioValue } from '@/components/CustomRadio/types';
import { BrandListItem } from '@/features/user-group/types';
import { UserType } from '@/pages/LandingPage/types';
import store, { useAppSelector } from '@/reducers';
import { UserDetail } from '@/types/user.type';

import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import { getListOrderBy } from '../api';
import styles from '../index.less';

interface BrandCompanyProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const LabelHeader = (item: UserDetail) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <BodyText level={5} fontFamily="Roboto" style={{ width: '20%', marginRight: '16px' }}>
        {getFullName(item)}
      </BodyText>
      <BodyText level={5} fontFamily="Roboto">
        {item.position}
      </BodyText>
    </div>
  );
};
export const BrandCompanyModal: FC<BrandCompanyProps> = ({ visible, setVisible }) => {
  const serviceFormData = useAppSelector((state) => state.service.service);
  const [listBrand, setListBrand] = useState<BrandListItem[]>([]);
  const [orderBy, setOrderBy] = useState<UserDetail[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<RadioValue>();
  const [selectedOrderBy, setSelectedOrderBy] = useState<RadioValue>();
  const [activeKey, setActiveKey] = useState<string>('');

  useEffect(() => {
    getBrandPagination({ page: 1, pageSize: 99999, sort: 'name', order: 'ASC' }, (res) => {
      setListBrand(res.data);
      const checkedBrand = res.data.find((item) => item.id === serviceFormData.brand_id);
      if (checkedBrand) {
        setSelectedBrand({
          label: checkedBrand.name,
          value: checkedBrand.id,
        });
      }
      setSelectedOrderBy({
        label: '',
        value: '',
      });
    });
  }, [visible === true]);
  useEffect(() => {
    setActiveKey('');
    getListOrderBy(selectedBrand?.value as string, UserType.Brand, RoleIndex.BrandRolesAdmin).then(
      (res) => {
        if (res) {
          setOrderBy(res);
          const checkedOrderBy = res.find((item) => item.id === serviceFormData.ordered_by);
          if (checkedOrderBy) {
            setSelectedOrderBy({
              label: getFullName(checkedOrderBy),
              value: checkedOrderBy.id,
            });
          }
          if (selectedBrand?.value !== serviceFormData.brand_id) {
            setSelectedOrderBy({
              label: '',
              value: '',
            });
          }
        }
      },
    );
  }, [selectedBrand]);
  const onFormSubmit = () => {
    store.dispatch(
      setServiceFormData({
        ...serviceFormData,
        brand_id: String(selectedBrand?.value) ?? '',
        brand_name: String(selectedBrand?.label) ?? '',
        ordered_by: String(selectedOrderBy?.value),
        ordered_by_name: String(selectedOrderBy?.label),
      }),
    );
    setVisible(false);
  };

  return (
    <Popover
      title="SELECT COMPANY"
      visible={visible}
      setVisible={setVisible}
      onFormSubmit={onFormSubmit}>
      <FormGroup
        label={'Brand Company'}
        layout="vertical"
        style={{ marginBottom: '16px' }}
        formClass={selectedBrand?.value ? styles.activeText : ''}>
        <CollapseRadioList
          options={listBrand.map((brand) => {
            return {
              label: brand.name,
              value: brand.id,
            };
          })}
          checked={String(selectedBrand?.value)}
          onChange={setSelectedBrand}
          placeholder={selectedBrand ? selectedBrand.label : 'select brand company'}
          containerClass={styles.customCollapse}
          activeKey={activeKey}
          onCollapseChange={() => setActiveKey('1')}
        />
      </FormGroup>
      <BodyText level={3} customClass={selectedBrand?.value ? styles.fontWeight500 : ''}>
        Order By
      </BodyText>
      <CustomRadio
        options={orderBy.map((item) => {
          return {
            label: LabelHeader(item),
            value: item.id,
          };
        })}
        isRadioList
        value={selectedOrderBy?.value}
        onChange={(data) => {
          const selected = orderBy.find((item) => item.id === data.value);
          if (selected) {
            setSelectedOrderBy({
              label: getFullName(selected),
              value: selected.id,
            });
          }
        }}
        containerClass={styles.customModal}
      />
    </Popover>
  );
};
