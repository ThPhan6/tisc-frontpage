import type { ModalProps } from 'antd';

export interface CustomModalProps extends ModalProps {
  containerClass?: string;
  closeIconClass?: string;
  secondaryModal?: boolean;
  darkTheme?: boolean;
  noHeaderBorder?: boolean;
}
