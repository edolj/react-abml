import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import SelectExampleView from "./components/SelectExampleView";
import ArgumentView from "./components/ArgumentView";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/selectExample" element={<SelectExampleView />} />
        <Route
          path="/selectExample/:criticalIndex"
          element={<ArgumentView />}
        />
      </Routes>
    </>
  );
}

export default App;
