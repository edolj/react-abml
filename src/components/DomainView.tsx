import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ListGroup, Container } from "react-bootstrap";
import { Card, Spinner, Form, Modal } from "react-bootstrap";
import { FaUpload, FaTimes, FaEdit, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import Alert from "./Alert";

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
        setDomains(res.data);
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
      .catch((err) => setErrorMsg(err.response?.data?.error || "Upload failed"))
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
        setErrorMsg(err.response?.data?.error || "Failed to delete domain.");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setDomainToDelete(null);
      });
  };

  return (
    <>
      {errorMsg && <Alert onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}

      <Container className="my-4">
        <Card className="box-with-border card-view">
          <Card.Header style={{ backgroundColor: "transparent" }}>
            <h3 className="mb-1 text-center">Select Domain</h3>
          </Card.Header>
          <Card.Body>
            <div className="scrollable">
              <ListGroup>
                {domains.map((domain: any) => (
                  <ListGroup.Item
                    key={domain.id}
                    as="div"
                    onClick={() => handleSelectDomain(domain)}
                    className={`d-flex justify-content-between align-items-center ${
                      domain.id === selectedDomain?.id ? "selected-item" : ""
                    }`}
                  >
                    <span>{domain.name}</span>
                    {isSuperuser && (
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDomain(domain);
                          }}
                        >
                          <FaEdit className="me-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDomain(domain.id);
                          }}
                        >
                          <FaTimes size={14} />
                        </Button>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <div className="d-flex mt-5">
              {isSuperuser && (
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
              )}
              <div className="ms-auto">
                <Button
                  variant="success"
                  onClick={() => handleStartFlow("new")}
                  disabled={!selectedDomain}
                  style={{ width: "120px" }}
                >
                  Start
                  <FaArrowRight
                    style={{ marginLeft: "8px", marginBottom: "2px" }}
                  />
                </Button>
              </div>
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
