import { useState } from "react";
import { Modal } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";

type ExpertAttributesModalProps = {
  displayNames?: Record<string, string>;
  descriptions?: Record<string, string>;
};

function ExpertAttributesModal({
  displayNames = {},
  descriptions = {},
}: ExpertAttributesModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <PrimaryButton onClick={handleShow}>
        <FaInfoCircle
          style={{
            marginRight: "8px",
            marginBottom: "2px",
            color: "white",
          }}
        />
        Attributes
      </PrimaryButton>

      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton style={{ backgroundColor: "#f8f8f8" }}>
          <Modal.Title className="text-center w-100">
            Attribute Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f9f9f9", padding: "20px" }}>
          {Object.keys(displayNames).map((key) => (
            <div
              key={key}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h5>{displayNames[key]}</h5>
              <hr />
              <p>{descriptions?.[key] || <em>No description provided.</em>}</p>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ExpertAttributesModal;
