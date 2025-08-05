import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Domain } from "./DomainView";
import apiClient from "../api/apiClient";

const EditDomainView = () => {
  const location = useLocation();
  const [domain] = useState<Domain>(location.state?.domain);

  const [expertAttrs, setExpertAttrs] = useState<string[]>(
    location.state?.domain.expert_attributes || []
  );
  const [displayNames, setDisplayNames] = useState<Record<string, string>>(
    location.state?.domain.display_names || {}
  );
  const [attrDescriptions, setAttrDesc] = useState<Record<string, string>>(
    location.state?.domain.attr_descriptions || {}
  );
  const [attrTooltips, setAttrTooltips] = useState<Record<string, string>>(
    location.state?.domain.attr_tooltips || {}
  );

  const handleCheckboxToggle = (attr: string) => {
    setExpertAttrs((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleNameChange = (attr: string, value: string) => {
    setDisplayNames((prev) => ({ ...prev, [attr]: value }));
  };

  const handleDescriptionChange = (attr: string, value: string) => {
    setAttrDesc((prev) => ({ ...prev, [attr]: value }));
  };

  const handleTooltipChange = (attr: string, value: string) => {
    setAttrTooltips((prev) => ({ ...prev, [attr]: value }));
  };

  const handleSave = () => {
    apiClient
      .put(`/domains/${domain.id}/update/`, {
        expert_attributes: expertAttrs,
        display_names: displayNames,
        attr_descriptions: attrDescriptions,
        attr_tooltips: attrTooltips,
      })
      .then(() => {
        toast.success("Changes saved successfully!");
      })
      .catch((err) => {
        toast.error(
          "Failed to save: " + (err.response?.data?.error || "Unknown error.")
        );
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Container className="my-4">
        <Card className="box-with-border card-view">
          <Card.Header>
            <h4 className="mb-0 text-center">Edit domain {domain.name}</h4>
          </Card.Header>
          <Card.Body>
            {domain.attributes.map((attr) => (
              <div
                key={attr}
                className="pb-3 mb-3"
                style={{ borderBottom: "1px solid #dee2e6" }}
              >
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <Form.Check
                      type="checkbox"
                      checked={expertAttrs.includes(attr)}
                      onChange={() => handleCheckboxToggle(attr)}
                      className="me-4"
                    />
                    <Form.Text className="mb-1">
                      <b>{attr}</b>
                    </Form.Text>
                    <Form.Control
                      type="input"
                      placeholder="Enter display name"
                      value={displayNames[attr]}
                      onChange={(e) => handleNameChange(attr, e.target.value)}
                      className="ms-auto"
                      style={{ width: "70%" }}
                    />
                  </div>

                  <div className="ms-auto mb-1" style={{ width: "70%" }}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Add description"
                      value={attrDescriptions[attr] || ""}
                      onChange={(e) =>
                        handleDescriptionChange(attr, e.target.value)
                      }
                    />
                  </div>
                  <div className="ms-auto" style={{ width: "70%" }}>
                    <Form.Control
                      as="input"
                      placeholder="(Optional) Tooltip description"
                      value={attrTooltips[attr] || ""}
                      onChange={(e) =>
                        handleTooltipChange(attr, e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
              </div>
            ))}
            <div className="text-center mt-4">
              <Button variant="success" onClick={handleSave}>
                Save
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default EditDomainView;
