import { LangProvider } from "./context/LanguageContext";
import { Diva } from "./components";

export default function App() {
  return (
    <LangProvider>
      <Diva />
    </LangProvider>
  );
}
