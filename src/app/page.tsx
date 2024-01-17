'use client';
import React from 'react';
import App from './components/App';
import { CopilotProvider } from '@copilotkit/react-core';
import { CopilotSidebarUIProvider } from '@copilotkit/react-ui';
import '@copilotkit/react-textarea/styles.css';
import '@copilotkit/react-ui/styles.css';
import styles from './styles/index.module.css';

function HomePage() {
  return (
    <CopilotProvider chatApiEndpoint='/api/copilotkit/openai'>
      <CopilotSidebarUIProvider>
        <div className={`${styles.body}`}>
          <App />
        </div>
      </CopilotSidebarUIProvider>
    </CopilotProvider>
  );
}

export default HomePage;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
