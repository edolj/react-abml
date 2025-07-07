import { useEffect, useState } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getObject, LearningObjectResponse } from "../api/apiHomePage";

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

  const handleStartFlow = (mode: "new" | "continue") => {
    if (mode === "new") {
      navigate("/selectDomain");
      return;
    }

    if (learningData?.name) {
      navigate("/selectExample", {
        state: { selectedDomain: learningData.name },
      });
    }
  };

  return (
    <Container className="my-5">
      <Card className="box-with-border card-view">
        <Card.Body>
          <h2 className="mb-3">Welcome to ABML Tutor</h2>
          <p className="text-muted mb-4">
            This application helps you explore attribute-based machine learning
            by interacting with domain-specific data. You can review attribute
            suggestions, select important features and guide the learning
            process in a structured way.
          </p>

          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Container>
                <div className="d-flex gap-3 align-items-center">
                  {learningData && (
                    <Button
                      variant="success"
                      onClick={() => handleStartFlow("continue")}
                    >
                      Continue session
                    </Button>
                  )}
                  {learningData?.name && (
                    <span className="text-muted">
                      Last domain: <strong>{learningData.name}</strong>
                    </span>
                  )}
                </div>
              </Container>
              {learningData && <Container>OR</Container>}
              <Container>
                <div>
                  <Button
                    variant="success"
                    onClick={() => handleStartFlow("new")}
                  >
                    Start New Session
                  </Button>
                </div>
              </Container>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;
