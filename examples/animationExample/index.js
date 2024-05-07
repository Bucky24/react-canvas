import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnimationProvider } from '@bucky24/react-canvas';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AnimationProvider>
        <App/>
    </AnimationProvider>
);
