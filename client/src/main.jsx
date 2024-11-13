import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from "@/components/ui/sonner";
import { store } from '../redux/store.js';
import { Provider } from "react-redux";
import { SocketContextProvider } from '../context/SocketContext.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  
    <Provider store={store}>
      <SocketContextProvider>
        <App />
        <Toaster closeButton position="top-center"  />
      </SocketContextProvider>
    </Provider>

);