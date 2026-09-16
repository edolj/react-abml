import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getObject, LearningObjectResponse } from "../api/apiHomePage";
import "../css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [learningData, setLearningData] =
    useState<LearningObjectResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getObject()
      .then((data) => {
        setLearningData(data);
      })
      .catch((err) => {
        console.error("Error fetching learning object:", err);
        setLearningData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = () => {
    if (learningData?.name) {
      navigate("/selectExample", {
        state: { selectedDomain: learningData.name },
      });
    }
  };

  const handleNewSession = () => {
    navigate("/selectDomain");
  };

  return (
    <div className="dashboard-page">
      <Container fluid className="dashboard-container">

        {/* Welcome */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">ABML TUTOR</p>
            <h1>Dobrodošli!</h1>
            {/* <p>
              Continue your learning journey or start a new ABML session.
            </p> */}
          </div>
        </section>

        {/* Main action */}
        <section className="dashboard-main-card">
          <div className="dashboard-main-content">
            <div>
              <span className="dashboard-card-label">
                {learningData ? "NADALJUJ UČENJE" : "ZAČNI"}
              </span>

              <h2>
                {learningData
                  ? "Nadaljujte, kjer ste končali"
                  : "Začnite svojo prvo učno sejo"}
              </h2>

              <p>
                {learningData
                  ? "Vrnite se k prejšnji učni seji in nadaljujte delo z izbrano domeno."
                  : "Izberite domeno in spoznajte strojno učenje, ki temelji na značilkah, skozi interaktiven učni proces."}
              </p>

              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : learningData ? (
                <div className="dashboard-current-domain">
                  <span>Trenutna domena</span>
                  <strong>{learningData.name}</strong>
                </div>
              ) : null}
            </div>

            <div className="dashboard-main-action">
              {!loading && learningData ? (
                <button
                  className="dashboard-primary-button"
                  onClick={handleContinue}
                >
                  Nadaljuj sejo
                  <span>→</span>
                </button>
              ) : (
                !loading && (
                  <button
                    className="dashboard-primary-button"
                    onClick={handleNewSession}
                  >
                    Začni novo sejo
                    <span>→</span>
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Quick access */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Hitri dostop</h2>
              <p>Dostopajte do glavnih področij tutorja.</p>
            </div>
          </div>

          <div className="dashboard-grid">

            <button
              className="dashboard-action-card"
              onClick={handleNewSession}
            >
              <div className="dashboard-icon">＋</div>
              <div>
                <h3>Nova seja</h3>
                <p>Izberite domeno in začnite novo učno sejo.</p>
              </div>
              <span className="dashboard-arrow">→</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/history")}
            >
              <div className="dashboard-icon">↗</div>
              <div>
                <h3>Zgodovina</h3>
                <p>Preglejte svoje prejšnje učne seje.</p>
              </div>
              <span className="dashboard-arrow">→</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/instructions")}
            >
              <div className="dashboard-icon">?</div>
              <div>
                <h3>Navodila</h3>
                <p>Spoznajte, kako deluje ABML Tutor.</p>
              </div>
              <span className="dashboard-arrow">→</span>
            </button>

          </div>
        </section>

      </Container>
    </div>
  );
};

export default HomePage;