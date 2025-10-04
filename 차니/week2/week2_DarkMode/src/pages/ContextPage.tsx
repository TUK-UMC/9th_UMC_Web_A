import Navbar from "../components/Navbar";
import ThemeContent from "../components/ThemeContent";
import { ThemeProvider } from "../context/ThemeProvider";

export default function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  );
}
