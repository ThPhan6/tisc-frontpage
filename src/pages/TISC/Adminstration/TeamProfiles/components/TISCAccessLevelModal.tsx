// import { dataTISCAccessLevel } from '@/constants/util';
import { FC } from 'react';
import styles from '../styles/TISCAccessLevelModal.less';

interface TISCAccessLevelModalProps {
  isModalOpen?: boolean;
  onClose?: () => void;
}

export const TISCAccessLevelModal: FC<
  TISCAccessLevelModalProps
> = (/* { isModalOpen, onClose } */) => {
  // const [data, setData] = useState(dataTISCAccessLevel);

  return (
    // <CustomModal visible={true} footer={false} title="TISC ACCESS LEVEL" onCancel={onClose}>
    <table className={styles.table} style={{ width: '100%' }}>
      <thead className={styles.table_thead}>
        <tr className={styles.table_thead__header}>
          <th scope="col"></th>
          <th scope="col">TISC Admin</th>
          <th scope="col">TISC Team</th>
          <th scope="col">Consultant Team</th>
        </tr>
      </thead>
      <tbody className={styles.table_thead__body}>
        {/* {data.map((item) => {
          return (
            <tr>
              <th scope="row"></th>
              <td>{item.logo}</td>
              <td>{item.name}</td>
              {item.subs?.map((sub) => {
                return (
                  <tr>
                    <td>{sub.logo}</td>
                    <td>{sub.name}</td>
                  </tr>
                );
              })}
            </tr>
          );
        })} */}

        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
      </tbody>
    </table>
    // </CustomModal>
  );
};
