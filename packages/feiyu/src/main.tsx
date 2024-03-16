import './index.css';
import './styles/scrollbar.css';

import ReactDOM from 'react-dom/client';

import { App } from './pages/app';
import { LRouter } from './services/routes';

ReactDOM.createRoot(document.getElementById('app') as any).render(
  <LRouter>
    <App />
  </LRouter>,
);
