import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductCatelogue } from '@/features/product/reducers';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';

export const CatelogueDownload = () => {
  const catelogue = useAppSelector((state) => state.product.catelogue);
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
