import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { checkBackend, activateDemo } from './mock/mockApi'

async function init() {
  const backendAvailable = await checkBackend();
  if (!backendAvailable) {
    activateDemo();
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

init();
