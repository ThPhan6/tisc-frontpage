import DynamicFormInput from '../EntryForm/DynamicFormInput';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductCatelogue } from '@/reducers/product';

const DownloadAddContent = () => {
  const product = useAppSelector((state) => state.product);
  const { catelogue } = product;
  const dispatch = useDispatch();

  return (
    <DynamicFormInput
      data={catelogue.contents.map((item) => {
        return {
          title: item.title,
          value: item.url,
        };
      })}
      setData={(data) => {
        dispatch(
          setProductCatelogue({
            ...catelogue,
            contents: data.map((item, index) => {
              return {
                ...catelogue.contents[index],
                title: item.title,
                url: item.value,
              };
            }),
          }),
        );
      }}
      titlePlaceholder="type catelogue name here"
      valuePlaceholder="paste file URL link here"
    />
  );
};

export default DownloadAddContent;
