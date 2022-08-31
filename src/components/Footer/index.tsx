import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'TISC',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'TISC',
          title: 'TISC',
          href: '/welcome',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
