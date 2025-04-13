import { useState, useEffect } from "react";
import { Button, ListGroup, Container, Modal } from "react-bootstrap";
import { Row, Col, Card, Spinner, Form } from "react-bootstrap";
import { FaUpload, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Domain = {
  id: number;
  name: string;
};

const DomainView = () => {
  const navigate = useNavigate();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch domains
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/domains/")
      .then((res) => setDomains(res.data))
      .catch((err) => console.error(err));
  }, []);

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

  const handleUpload = () => {
    if (!file || !domainName) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", domainName);
    formData.append("file", file);

    axios
      .post("http://localhost:8000/api/upload-domain/", formData)
      .then((res) => {
        setDomains((prev) => [...prev, res.data]);
        setShowUploadModal(false);
        setDomainName("");
        setFile(null);
      })
      .catch((err) => alert(err.response?.data?.error || "Upload failed"))
      .finally(() => setLoading(false));
  };

  const handleDeleteDomain = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this domain?")) return;

    axios
      .delete(`http://localhost:8000/api/domains/${id}/`)
      .then(() => {
        setDomains((prev) => prev.filter((domain) => domain.id !== id));
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Failed to delete domain.");
      });
  };

  return (
    <>
      <Container className="my-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Select Domain</h2>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="offset-md-3">
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  {domains.map((domain: any) => (
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
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{domain.name}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDomain(domain.id);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="d-flex justify-content-between mt-5">
                  <Button
                    variant="success"
                    onClick={handleStartFlow}
                    disabled={!selectedDomain}
                    className="d-flex align-items-center"
                  >
                    <FaPlay style={{ marginRight: "8px" }} />
                    Start
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                    className="d-flex align-items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <FaUpload style={{ marginRight: "8px" }} />
                        Add Domain
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Domain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDomainName" className="mb-3">
              <Form.Label>Domain Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter domain name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                accept=".tab"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files ? target.files[0] : null);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DomainView;
