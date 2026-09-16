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
        setErrorMsg(err.response?.data?.error || "Nalaganje ni uspelo")
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
          err.response?.data?.error || "Brisanje domene ni uspelo."
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
            <p className="domain-eyebrow">NOVA SEJA</p>
            <h1>Začnite novo sejo</h1>
          </div>
        </div>

        {/* Main domain card */}
        <Card className="domain-main-card">
          <Card.Body>

            <div className="domain-card-header">
              <div>
                <h2>Razpoložljive domene</h2>
                <p>
                  Izberite domeno za začetek učne seje.
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
                            {domain.attributes.length} značilk
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
                                <span>Uredi</span>
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
                      <span>Dodaj domeno</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                className="domain-start-button"
                onClick={() => handleStartFlow("new")}
                disabled={!selectedDomain}
              >
                <span>Začni</span>
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
            Naloži novo domeno
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
                placeholder="Vnesite ime domene"
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
            Prekliči
          </Button>

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Naloži"
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
            Potrditev brisanja
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          Ali ste prepričani, da želite izbrisati to domeno?
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            variant="secondary"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >
            Prekliči
          </Button>

          <Button
            variant="danger"
            onClick={confirmDeleteDomain}
          >
            Potrdi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DomainView;