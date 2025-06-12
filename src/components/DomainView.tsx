import { useState, useEffect } from "react";
import { Button, ListGroup, Container, Modal } from "react-bootstrap";
import { Row, Col, Card, Spinner, Form } from "react-bootstrap";
import { FaUpload, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Alert from "./Alert";
import axios from "axios";

type Domain = {
  id: number;
  name: string;
  attributes: string[];
  expert_attributes: string[];
};

const DomainView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<number | null>(null);
  const [domainName, setDomainName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [inactiveAttributes, setInactiveAttributes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch domains
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/domains/")
      .then((res) => setDomains(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setInactiveAttributes(domain.expert_attributes || []);
  };

  const handleStartFlow = (mode: string) => {
    localStorage.setItem("mode", mode);

    if (selectedDomain) {
      navigate("/selectExample", {
        state: { selectedDomain: selectedDomain.name },
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
      .catch((err) => setErrorMsg(err.response?.data?.error || "Upload failed"))
      .finally(() => setLoading(false));
  };

  const handleDeleteDomain = (id: number) => {
    setDomainToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteDomain = () => {
    if (domainToDelete === null) return;

    axios
      .delete(`http://localhost:8000/api/domains/${domainToDelete}/`)
      .then(() => {
        setDomains((prev) =>
          prev.filter((domain) => domain.id !== domainToDelete)
        );

        if (selectedDomain?.id === domainToDelete) {
          setSelectedDomain(null);
          setInactiveAttributes([]);
        }
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.error || "Failed to delete domain.");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setDomainToDelete(null);
      });
  };

  const handleSaveInactiveAttributes = () => {
    if (!selectedDomain) return;

    axios
      .put(`http://localhost:8000/api/domains/${selectedDomain.id}/update/`, {
        expert_attributes: inactiveAttributes,
      })
      .then(() => {
        toast.success("Expert attributes saved successfully!");
        // Update domain in local state
        setDomains((prev) =>
          prev.map((d) =>
            d.id === selectedDomain.id
              ? { ...d, expert_attributes: inactiveAttributes }
              : d
          )
        );
        // Also update selectedDomain to keep UI consistent
        setSelectedDomain((prev) =>
          prev ? { ...prev, expert_attributes: inactiveAttributes } : prev
        );
      })
      .catch((err) => {
        setErrorMsg(
          "Failed to save: " + err.response?.data?.error || "Unknown error."
        );
      });
  };

  return (
    <>
      {errorMsg && <Alert onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}

      <ToastContainer position="top-right" autoClose={3000} />
      <Container className="my-4">
        <Row>
          {/* Left Panel: Domain Selection */}
          <Col md={6}>
            <Card className="box-with-border card-view">
              <Card.Header>
                <h4 className="mb-0">Select Domain</h4>
              </Card.Header>
              <Card.Body>
                <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {domains.map((domain: any) => (
                      <ListGroup.Item
                        key={domain.id}
                        action
                        onClick={() => handleSelectDomain(domain)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{domain.name}</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDomain(domain.id);
                            }}
                          >
                            <FaTimes size={14} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

                <div className="d-flex justify-content-center mt-5">
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Add Domain
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Panel: Attribute Selection */}
          <Col md={6}>
            {selectedDomain && (
              <>
                <Card className="box-with-border">
                  <Card.Header>
                    <h4 className="mb-0">Attributes - {selectedDomain.name}</h4>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                      {selectedDomain.attributes?.map((attr: string) => (
                        <Form.Check
                          key={attr}
                          type="checkbox"
                          id={`check-${attr}`}
                          label={attr}
                          checked={inactiveAttributes.includes(attr)}
                          onChange={() => {
                            setInactiveAttributes((prev) =>
                              prev.includes(attr)
                                ? prev.filter((a) => a !== attr)
                                : [...prev, attr]
                            );
                          }}
                        />
                      ))}
                      {selectedDomain.attributes?.length === 0 && (
                        <div className="text-muted">
                          No attributes found for this domain.
                        </div>
                      )}
                    </div>
                  </Card.Body>

                  <div className="d-flex gap-2 justify-content-center mt-2">
                    <Button
                      variant="success"
                      onClick={handleSaveInactiveAttributes}
                      disabled={!selectedDomain}
                    >
                      Save
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleStartFlow("new")}
                      disabled={!selectedDomain}
                    >
                      Start
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Upload New Domain
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDomainName" className="mb-3">
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
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Are you sure you want to delete this domain?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteDomain}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DomainView;
