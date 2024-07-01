import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import PrimaryButton from "./components/PrimaryButton";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SelectExampleView from "./components/SelectExampleView";
import ArgumentView from "./components/ArgumentView";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      {location.pathname === "/" && (
        <div className="container">
          <PrimaryButton onClick={() => navigate("/selectExample")}>
            Start session
          </PrimaryButton>
        </div>
      )}
      <Routes>
        <Route path="/selectExample" element={<SelectExampleView />} />
        <Route
          path="/selectExample/:criticalIndex"
          element={<ArgumentView />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
