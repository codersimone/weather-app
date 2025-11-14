import Temperature from './components/Temperature/Temperature';
import GlobalStyle from './assets/styles/global/global.jsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Temperature value={25} />
    </>
  );
}

export default App;
