import { Routes, Route } from "react-router-dom";
import "./App.css";

import SelectExampleView from "./components/SelectExampleView";
import ArgumentView from "./components/ArgumentView";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import PrivateRoute from "./context/PrivateRoute";
import DomainView from "./components/DomainView";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/selectDomain"
          element={
            <PrivateRoute>
              <DomainView />
            </PrivateRoute>
          }
        />
        <Route
          path="/selectExample"
          element={
            <PrivateRoute>
              <SelectExampleView />
            </PrivateRoute>
          }
        />
        <Route
          path="/selectExample/:criticalIndex"
          element={
            <PrivateRoute>
              <ArgumentView />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
