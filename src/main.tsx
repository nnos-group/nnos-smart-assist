import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSecurityProtection } from "./lib/securityProtection";

// Inicializa a proteção de segurança (F12, atalhos de depuração e contextmenu)
initSecurityProtection();

createRoot(document.getElementById("root")!).render(<App />);
