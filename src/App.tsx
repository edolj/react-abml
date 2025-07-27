import { Routes, Route } from "react-router-dom";
import "./App.css";

import SelectExampleView from "./components/SelectExampleView";
import ArgumentView from "./components/ArgumentView";
import RegistrationForm from "./components/RegistrationForm";
import PrivateRoute from "./context/PrivateRoute";
import DomainView from "./components/DomainView";
import EditDomainView from "./components/EditDomainView";
import Header from "./components/Header";
import Users from "./components/Users";
import HomePage from "./components/HomePage";
import RootRedirect from "./context/RootRedirect";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/selectDomain"
          element={
            <PrivateRoute>
              <DomainView />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-domain/:id"
          element={
            <PrivateRoute>
              <EditDomainView />
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
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
