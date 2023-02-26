import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex } from '@core-ui/index';

const Container = styled(Flex)`
  justify-content: center;
`;

const NoticeText = styled(Text)`
  line-height: 2;
  text-align: center;
  ${(props) =>
    css({
      color: props.theme.colors.red,
      fontSize: '19px',
      fontWeight: 600,
      p: 2,
    })}
`;

interface Props {
  children: any;
}

const Notice: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <NoticeText>{children}</NoticeText>
    </Container>
  );
};

export default Notice;
