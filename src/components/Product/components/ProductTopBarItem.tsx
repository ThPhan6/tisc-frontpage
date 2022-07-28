import { BodyText } from '@/components/Typography';
import { capitalize, truncate } from 'lodash';
import styles from '../styles/top-bar.less';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';

interface ProductTopBarProps {
  topValue?: string | React.ReactNode;
  disabled?: boolean;
  bottomValue?: string | React.ReactNode;
  bottomEnable?: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
}

export const TopBarItem: React.FC<ProductTopBarProps> = (props) => {
  const { topValue, bottomValue, icon, disabled, bottomEnable, customClass, onClick } = props;
  return (
    <div className={`item ${customClass ?? ''}`} onClick={onClick}>
      <BodyText level={5} fontFamily="Roboto" customClass={disabled ? 'disabled ' : ''}>
        {topValue}
      </BodyText>
      <BodyText
        level={6}
        fontFamily="Roboto"
        customClass={`topbar-group-btn ${disabled && !bottomEnable ? 'disabled' : ''}`}
      >
        <span>{bottomValue}</span>
        {icon ? icon : null}
      </BodyText>
    </div>
  );
};

interface FilterItemProps {
  title: string;
  onDelete?: () => void;
}
export const FilterItem: React.FC<FilterItemProps> = ({ title, onDelete }) => {
  return (
    <span className={styles.filterItem}>
      {truncate(capitalize(title), { length: 25 })}
      <DeleteIcon onClick={onDelete} />
    </span>
  );
};
