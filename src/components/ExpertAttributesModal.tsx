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
        <Modal.Header closeButton>
          <Modal.Title>Attribute Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(displayNames).map((key) => (
            <div key={key} className="mb-4">
              <h5>{displayNames[key]}</h5>
              <p>{descriptions?.[key] ?? <em>No description provided.</em>}</p>
              <hr />
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ExpertAttributesModal;
