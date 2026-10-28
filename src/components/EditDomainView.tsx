import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { Domain } from "./DomainView";
import apiClient from "../api/apiClient";
import "../css/EditDomainPage.css";

const EditDomainView = () => {
  const location = useLocation();
  const [domain] = useState<Domain>(location.state?.domain);
  const [activeTab, setActiveTab] = useState<"izbira" | "opisi">("izbira");

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

  const toggleAttr = (attr: string) => {
    setExpertAttrs((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
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
        toast.success("Spremembe so bile shranjene.");
      })
      .catch((err) => {
        toast.error(
          "Shranjevanje ni uspelo: " +
            (err.response?.data?.error || "Neznana napaka.")
        );
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="edit-domain-page">
        <Container fluid className="edit-domain-container">

          <div className="edit-domain-header">
            <p className="edit-domain-eyebrow">UREDI DOMENO</p>
            <h1>{domain.name}</h1>
          </div>

          <div className="edit-domain-card">

            {/* Tabs */}
            <div className="edit-domain-tabs">
              <button
                className={`edit-domain-tab ${activeTab === "izbira" ? "active" : ""}`}
                onClick={() => setActiveTab("izbira")}
              >
                1 · Ekspertni atributi
              </button>
              <button
                className={`edit-domain-tab ${activeTab === "opisi" ? "active" : ""}`}
                onClick={() => setActiveTab("opisi")}
              >
                2 · Opisi
              </button>
            </div>

            {/* Tab 1 — choose expert attributes */}
            {activeTab === "izbira" && (
              <div className="edit-domain-tab-content">
                <p className="edit-domain-hint">
                  Izberite atribute, ki se prikažejo v zavihku Ekspert med učno sejo.
                </p>
                <div className="edit-attr-list">
                  {domain.attributes.map((attr) => {
                    const selected = expertAttrs.includes(attr);
                    return (
                      <div
                        key={attr}
                        className={`edit-attr-row ${selected ? "selected" : ""}`}
                        onClick={() => toggleAttr(attr)}
                      >
                        <div className={`edit-attr-checkbox ${selected ? "checked" : ""}`}>
                          {selected && <FaCheck size={9} color="white" />}
                        </div>
                        <span className="edit-attr-name">{attr}</span>
                        {selected && (
                          <span className="edit-attr-badge">ekspertni</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2 — descriptions for selected attributes */}
            {activeTab === "opisi" && (
              <div className="edit-domain-tab-content">
                <p className="edit-domain-hint">
                  Prikazno ime se pokaže v tabeli namesto tehničnega identifikatorja. Opis in namig sta neobvezna.
                </p>
                <div className="edit-desc-list">
                    {[...domain.attributes]
                      .sort((a, b) => {
                        if (expertAttrs.includes(a) && !expertAttrs.includes(b)) return -1;
                        if (!expertAttrs.includes(a) && expertAttrs.includes(b)) return 1;
                        return 0;
                      })
                      .map((attr) => (
                      <div key={attr} className="edit-desc-card">
                        <div className="edit-desc-card-header">
                          <span>{attr}</span>
                          {expertAttrs.includes(attr) && (
                            <span className="edit-attr-badge">ekspertni</span>
                          )}
                        </div>
                        <div className="edit-desc-fields">
                          <div className="edit-field">
                            <label>Prikazno ime</label>
                            <input
                              type="text"
                              placeholder={attr}
                              value={displayNames[attr] || ""}
                              onChange={(e) =>
                                setDisplayNames((prev) => ({
                                  ...prev,
                                  [attr]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="edit-desc-fields" style={{ marginTop: 8 }}>
                          <div className="edit-field">
                            <label>Opis</label>
                            <textarea
                              placeholder="Kratka razlaga za učenca…"
                              value={attrDescriptions[attr] || ""}
                              onChange={(e) =>
                                setAttrDesc((prev) => ({
                                  ...prev,
                                  [attr]: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="edit-field">
                            <label>Namig</label>
                            <textarea
                              placeholder="Neobvezno…"
                              value={attrTooltips[attr] || ""}
                              onChange={(e) =>
                                setAttrTooltips((prev) => ({
                                  ...prev,
                                  [attr]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            )}

            {/* Footer */}
            <div className="edit-domain-footer">
              <button className="edit-save-button" onClick={handleSave}>
                Shrani
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default EditDomainView;
