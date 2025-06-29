import { AuthProvider } from "./contexts/AuthContext";
import Router from "./components/Router";

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;