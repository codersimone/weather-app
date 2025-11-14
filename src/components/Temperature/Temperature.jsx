import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 40vw;
  min-height: 20vh;
  padding: 1rem;
  margin: 2rem;
  background-color: #2b2b2b;
  border-radius: 0.5rem;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;

const Text = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: #ffff00;
`;

function Temperature({ value }) {
  return (
    <Container>
      <Title>Температура воздуха сегодня:</Title>
      <Text>{Math.round(value)}°C</Text>
    </Container>
  );
}

export default Temperature;
