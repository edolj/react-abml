import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Card, Spinner, Form, Modal } from "react-bootstrap";
import { FaUpload, FaTimes, FaEdit, FaCheck, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import Alert from "./Alert";
import "../css/DomainPage.css";

export type Domain = {
  id: number;
  name: string;
  attributes: string[];
  expert_attributes: string[];
  display_names: Record<string, string>;
};

const DomainView = () => {
  const navigate = useNavigate();
  const { isSuperuser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<number | null>(null);
  const [domainName, setDomainName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch domains
  useEffect(() => {
    apiClient
      .get("/domains/")
      .then((res) => {
        const sortedDomains = res.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setDomains(sortedDomains);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
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

    apiClient
      .post("/upload-domain/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setDomains((prev) => [...prev, res.data]);
        setShowUploadModal(false);
        setDomainName("");
        setFile(null);
      })
      .catch((err) =>
        setErrorMsg(err.response?.data?.error || "Upload failed")
      )
      .finally(() => setLoading(false));
  };

  const handleEditDomain = (domain: Domain) => {
    navigate(`/edit-domain/${domain.id}`, {
      state: { domain },
    });
  };

  const handleDeleteDomain = (id: number) => {
    setDomainToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteDomain = () => {
    if (domainToDelete === null) return;

    apiClient
      .delete(`/domains/${domainToDelete}/`)
      .then(() => {
        setDomains((prev) =>
          prev.filter((domain) => domain.id !== domainToDelete)
        );

        if (selectedDomain?.id === domainToDelete) {
          setSelectedDomain(null);
        }
      })
      .catch((err) => {
        setErrorMsg(
          err.response?.data?.error || "Failed to delete domain."
        );
      })
      .finally(() => {
        setShowDeleteModal(false);
        setDomainToDelete(null);
      });
  };

  return (
    <div className="domain-page">
      {errorMsg && (
        <Alert onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      <Container fluid className="domain-container">

        {/* Page heading */}
        <div className="domain-page-header">
          <div>
            <p className="domain-eyebrow">NEW SESSION</p>
            <h1>Start a new session</h1>
            {/* <p>
              Select a domain to begin your learning session.
            </p> */}
          </div>
        </div>

        {/* Main domain card */}
        <Card className="domain-main-card">
          <Card.Body>

            <div className="domain-card-header">
              <div>
                <h2>Available domains</h2>
                <p>
                  Select a domain to begin your learning session.
                </p>
              </div>

              {selectedDomain && (
                <div className="selected-domain-indicator">
                  <FaCheck />
                  <span>{selectedDomain.name}</span>
                </div>
              )}
            </div>

            <div className="domain-list">
              <Row xs={1} sm={2} lg={3} className="g-3">
                {domains.map((domain: Domain) => {
                  const isSelected =
                    domain.id === selectedDomain?.id;

                  return (
                    <Col key={domain.id}>
                      <Card
                        className={`domain-selection-card ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleSelectDomain(domain)}
                      >
                        {isSelected && (
                          <div className="domain-selected-check">
                            <FaCheck />
                          </div>
                        )}

                        <Card.Body>
                          <div className="domain-card-accent" />

                          <h3>{domain.name}</h3>

                          <div className="domain-attribute-count">
                            {domain.attributes.length} attributes
                          </div>

                          {isSuperuser && (
                            <div className="domain-admin-actions">
                              <Button
                                size="sm"
                                className="domain-edit-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDomain(domain);
                                }}
                              >
                                <FaEdit />
                                <span>Edit</span>
                              </Button>

                              <Button
                                size="sm"
                                className="domain-delete-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDomain(domain.id);
                                }}
                              >
                                <FaTimes />
                              </Button>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Bottom actions */}
            <div className="domain-actions">

              {isSuperuser && (
                <Button
                  className="domain-add-button"
                  onClick={() => setShowUploadModal(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <FaUpload />
                      <span>Add Domain</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                className="domain-start-button"
                onClick={() => handleStartFlow("new")}
                disabled={!selectedDomain}
              >
                <span>Start</span>
                <FaArrowRight />
              </Button>
            </div>

          </Card.Body>
        </Card>
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
            <Form.Group
              controlId="formDomainName"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Enter domain name"
                value={domainName}
                onChange={(e) =>
                  setDomainName(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group
              controlId="formFile"
              className="mb-3"
            >
              <Form.Control
                type="file"
                accept=".tab"
                onChange={(e) => {
                  const target =
                    e.target as HTMLInputElement;

                  setFile(
                    target.files
                      ? target.files[0]
                      : null
                  );
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            variant="secondary"
            onClick={() =>
              setShowUploadModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Upload"
            )}
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
          <Button
            variant="secondary"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmDeleteDomain}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DomainView;