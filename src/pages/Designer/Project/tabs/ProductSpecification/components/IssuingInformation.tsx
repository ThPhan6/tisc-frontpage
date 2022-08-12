import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { DatePicker } from 'antd';
import styles from '../styles/index.less';

const data = {
  issuingOffice: 'Office name A',
  issuingFor: '',
  issuingDate: '2020-07-08',
  revision: '',
};
const optionsRadio = [
  {
    label: 'Client Approval',
    value: 'Client Approval',
  },
  {
    label: 'Construction Documents',
    value: 'Construction Documents',
  },
];
const IssuingInformation = () => {
  return (
    <div className={styles.formInformation}>
      <FormGroup label="Issuing Office" required={true} layout="vertical">
        <CollapseRadioList
          options={optionsRadio.map((office) => {
            return {
              label: office.label,
              value: office.value,
            };
          })}
          placeholder={data.issuingOffice}
        />
      </FormGroup>
      <FormGroup label="Issuing For" required={true} layout="vertical">
        <CollapseRadioList
          options={optionsRadio.map((issuingFor) => {
            return {
              label: issuingFor.label,
              value: issuingFor.value,
            };
          })}
          placeholder="select from the list"
          otherInput
        />
      </FormGroup>
      <FormGroup
        label="Issuing Date"
        required={true}
        layout="vertical"
        formClass={styles.customDate}
      >
        <DatePicker />
      </FormGroup>
      <FormGroup label="Revision #" layout="vertical">
        <CustomInput placeholder="e.g. Rev.01" borderBottomColor="mono-medium" />
      </FormGroup>
    </div>
  );
};
export default IssuingInformation;
