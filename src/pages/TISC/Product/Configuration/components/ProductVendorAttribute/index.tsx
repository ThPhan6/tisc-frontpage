import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductCatelogue } from '@/reducers/product';
import ProductVendor from '@/components/Product/ProductVendor/index';

const TISCProductVendor = () => {
  const product = useAppSelector((state) => state.product);
  const { catelogue } = product;
  const dispatch = useDispatch();

  return (
    <ProductVendor>
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
    </ProductVendor>
  );
};

export default TISCProductVendor;
