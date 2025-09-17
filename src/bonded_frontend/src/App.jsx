// import { bonded_project_backend } from 'declarations/bonded-project-backend';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';

function App() {

  return (
    <Provider store={store}>
      <main>
          <AppRoutes />
      </main>
    </Provider>
  );
}

export default App;
