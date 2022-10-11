export interface AccessLevelModalItemProps {
  id: string;
  name: string;
  accessable: boolean | null;
}

export interface AccessLevelModalProps {
  logo?: string;
  name: string;
  items: AccessLevelModalItemProps[];
  number: number;
  parent_number: number | null;
  subs?: AccessLevelModalProps[];
}

export interface ModalVisible {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
