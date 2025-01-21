import { useState } from "react";
import {
  Button,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaUpload, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const exampleDomains = [
  { id: 1, name: "Bonitete" },
  { id: 2, name: "Domena 2" },
  { id: 3, name: "Domena 3" },
];

const DomainView = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState(exampleDomains); // Simulate fetching domains
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setDomains([
        ...domains,
        { id: domains.length + 1, name: `Domena ${domains.length + 1}` },
      ]);
      setLoading(false);
    }, 1000); // Simulating an API call delay
  };

  const handleSelectDomain = (domainName: string) => {
    setSelectedDomain(domainName);
  };

  const handleStartFlow = () => {
    if (selectedDomain) {
      navigate("/selectExample", {
        state: { selectedDomain },
      });
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <Container className="my-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Select or Add Domain</h2>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="offset-md-3">
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  {domains.map((domain) => (
                    <ListGroup.Item
                      key={domain.id}
                      action
                      onClick={() => handleSelectDomain(domain.name)}
                      className={
                        selectedDomain === domain.name
                          ? "bg-primary text-white"
                          : ""
                      }
                    >
                      {domain.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="success"
                    onClick={handleStartFlow}
                    disabled={!selectedDomain}
                    className="d-flex align-items-center"
                  >
                    <FaPlay style={{ marginRight: "8px" }} />
                    Start Flow
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    className="d-flex align-items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <FaUpload style={{ marginRight: "8px" }} />
                        Dodaj domeno
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DomainView;
