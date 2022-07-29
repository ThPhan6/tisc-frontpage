import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setProductTip } from '@/reducers/product';
import DynamicFormInput from '../EntryForm/DynamicFormInput';
import styles from './styles/productTip.less';
import { USER_ROLE } from '@/constants/userRoles';
import { BodyText } from '../Typography';

const ProductTip: FC<{ userRole: USER_ROLE }> = ({ userRole }) => {
  const tip = useAppSelector((state) => state.product.tip);
  const dispatch = useDispatch();

  switch (userRole) {
    case USER_ROLE.tisc:
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
    case USER_ROLE.brand || USER_ROLE.design:
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

    default:
      return null;
  }
};

export default ProductTip;
