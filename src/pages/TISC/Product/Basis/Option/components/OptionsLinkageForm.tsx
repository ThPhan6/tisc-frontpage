import { EntryFormWrapper } from '@/components/EntryForm';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const OptionsLinkageForm = () => {
  return (
    <div>
      <TableHeader title={`Ngoc`} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        title="DATASET LINKAGE"
        // handleSubmit={onHandleSubmit}
        // handleCancel={history.goBack}
        // handleDelete={getDeleteFuntional}
        // submitButtonStatus={submitButtonStatus.value}
        // entryFormTypeOnMobile={idBasis ? 'edit' : 'create'}
        lg={24}
        span={24}
      >
        {/* <FormOptionContext.Provider value={{ mode, setMode }}>
              {type === 'options' ? (
                <FormOptionNameInput
                  placeholder="type group name"
                  title={getEntryFormTitle(type)}
                  onChangeInput={handleChangeGroupName}
                  handleOnClickAddIcon={handleOnClickAddIcon}
                  inputValue={data.name}
                />
              ) : (
                <FormNameInput
                  placeholder="type group name"
                  title={getEntryFormTitle(type)}
                  onChangeInput={handleChangeGroupName}
                  handleOnClickAddIcon={handleOnClickAddIcon}
                  inputValue={data.name}
                />
              )}
              {data.subs.map(renderEntryFormItem)}
            </FormOptionContext.Provider> */}
      </EntryFormWrapper>
    </div>
  );
};
export default OptionsLinkageForm;
