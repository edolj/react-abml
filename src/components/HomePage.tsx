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
            <h1>Welcome back!</h1>
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
                {learningData ? "CONTINUE LEARNING" : "GET STARTED"}
              </span>

              <h2>
                {learningData
                  ? "Continue where you left off"
                  : "Start your first learning session"}
              </h2>

              <p>
                {learningData
                  ? "Return to your previous learning session and continue working with your selected domain."
                  : "Choose a domain and explore attribute-based machine learning through an interactive learning process."}
              </p>

              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : learningData ? (
                <div className="dashboard-current-domain">
                  <span>Current domain</span>
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
                  Continue Session
                  <span>→</span>
                </button>
              ) : (
                !loading && (
                  <button
                    className="dashboard-primary-button"
                    onClick={handleNewSession}
                  >
                    Start New Session
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
              <h2>Quick access</h2>
              <p>Navigate to the main areas of the tutor.</p>
            </div>
          </div>

          <div className="dashboard-grid">

            <button
              className="dashboard-action-card"
              onClick={handleNewSession}
            >
              <div className="dashboard-icon">＋</div>
              <div>
                <h3>New Session</h3>
                <p>Choose a domain and start a new learning session.</p>
              </div>
              <span className="dashboard-arrow">→</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/history")}
            >
              <div className="dashboard-icon">↗</div>
              <div>
                <h3>History</h3>
                <p>Review your previous learning sessions.</p>
              </div>
              <span className="dashboard-arrow">→</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/instructions")}
            >
              <div className="dashboard-icon">?</div>
              <div>
                <h3>Instructions</h3>
                <p>Learn how the ABML Tutor works.</p>
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