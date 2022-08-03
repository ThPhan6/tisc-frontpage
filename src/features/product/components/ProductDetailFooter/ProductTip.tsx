import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setProductTip } from '@/features/product/reducers';
import styles from './ProductTip.less';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { BodyText } from '@/components/Typography';
import { useCheckPermission } from '@/helper/hook';

const ProductTip: FC = () => {
  const dispatch = useDispatch();

  const tip = useAppSelector((state) => state.product.tip);
  const isTiscAdmin = useCheckPermission('TISC Admin');

  if (isTiscAdmin) {
    return (
      <DynamicFormInput
        data={tip.contents.map((value) => {
          return {
            title: value.title,
            value: value.content,
          };
        })}
        setData={(data) =>
          dispatch(
            setProductTip({
              ...tip,
              contents: data.map((item, index) => {
                return {
                  ...tip.contents[index],
                  title: item.title,
                  content: item.value,
                };
              }),
            }),
          )
        }
        titlePlaceholder="type title here"
        valuePlaceholder="type content text (max. 100 words)"
        maxValueWords={100}
      />
    );
  }

  return (
    <div className={styles.tipFooter}>
      <table>
        {tip.contents.map((content, index) => {
          return (
            <tr key={content.id || index}>
              <td className={styles.title}>
                <BodyText level={4} customClass={styles.content_title}>
                  {content.title}
                </BodyText>
              </td>
              <td className={styles.url}>
                <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
                  {content.content}
                </BodyText>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ProductTip;
