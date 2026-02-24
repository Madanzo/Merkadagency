import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import Clarity from '@microsoft/clarity';

// Initialize Microsoft Clarity analytics
Clarity.init("vci3z8gsr9");

// Force unregister any legacy service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (const registration of registrations) {

            registration.unregister();
        }
    });
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </ErrorBoundary>
);
