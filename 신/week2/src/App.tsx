import "./App.css";
import { ThemeProvider } from "./context/ThemeProvider";
import AppContent from "./components/AppContent";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
