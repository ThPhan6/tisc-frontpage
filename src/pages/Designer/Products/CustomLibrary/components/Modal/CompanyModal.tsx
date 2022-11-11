import { FC } from 'react';

import { RadioValue } from '@/components/CustomRadio/types';

import GroupRadioList from '@/components/CustomRadio/RadioList';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

export const CompanyModal: FC<{
  companyId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: RadioValue;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Popover
      title="SELECT COLLECTION"
      visible={visible}
      setVisible={setVisible}
      chosenValue={
        // collection
        // ? {
        //     value: collection.id,
        //     label: collection.name,
        //   }
        // :
        undefined
      }
      setChosenValue={() => {}}>
      <div className={styles.boxShadowBottom}>
        <MainTitle level={3}>Create new company</MainTitle>
        <div className="flex-between">
          <CustomInput
            className="extra-input"
            placeholder="type new company name"
            // value={newCollection}
            // onChange={(e) => setNewCollection(e.target.value)}
          />
          <CustomPlusButton
            size={18}
            label="Add"
            // onClick={disabled.value ? undefined : handleCreateCollection}
          />
        </div>
      </div>

      <GroupRadioList
        // selected={currentValue}
        // chosenItem={chosenValue}
        // onChange={setCurrentValue}
        data={[
          {
            heading: 'Assign bellow company',
            options: [{ id: '1', name: 'Design Office Name(default)' }].map((item) => {
              return {
                value: item.id,
                label: (
                  <div className={styles.actionBtn}>
                    <RobotoBodyText level={6}>{item.name}</RobotoBodyText>
                    <ActionMenu
                      containerClass={styles.menuAction}
                      actionItems={[
                        {
                          type: 'updated',
                          label: 'Edit',
                          onClick: () => {},
                        },
                        {
                          type: 'deleted',
                          onClick: () => {},
                        },
                      ]}
                    />
                  </div>
                ),
              };
            }),
          },
        ]}
      />
    </Popover>
  );
};
