import { useState } from "react";
import { Modal } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";

const derivedAttributes = [
  {
    key: "total.oper.liabilities/assets",
    name: "Total Operating Liabilities / Assets [%]",
    description:
      "Shows the share of business liabilities in total assets. High values may indicate reliance on supplier credit.",
  },
  {
    key: "current.ratio",
    name: "Current Ratio",
    description:
      "Indicates the company's ability to cover short-term obligations. Ideal value ≈ 1.5.",
  },
  {
    key: "lt.sales.growth",
    name: "Long-Term Sales Growth",
    description:
      "Compound annual growth rate (CAGR). Healthy growth is typically above 7%.",
  },
  {
    key: "st.sales.growth",
    name: "Short-Term Sales Growth",
    description:
      "More sensitive to recent changes in revenue. Useful for quick trend detection.",
  },
  {
    key: "lt.ebit.margin.change",
    name: "Long-Term EBIT Margin Change",
    description:
      "Measures profitability trends by comparing EBIT margins over multiple years.",
  },
  {
    key: "net.debt/EBITDA",
    name: "Net Debt / EBITDA",
    description:
      "Estimates how many years of EBITDA are needed to repay debt. >4 is risky.",
  },
  {
    key: "equity.ratio",
    name: "Equity Ratio",
    description:
      "Indicates the share of equity in total financing. <0.3 suggests higher financial risk.",
  },
  {
    key: "TIE",
    name: "Times Interest Earned (TIE)",
    description:
      "How well EBIT covers interest expenses. Acceptable value is >1.2.",
  },
  {
    key: "ROA",
    name: "Return on Assets (ROA)",
    description:
      "How efficiently assets are used to generate earnings. Higher = better.",
  },
  {
    key: "public",
    name: "Public Ownership",
    description:
      "Binary indicator of whether the company is publicly listed or not.",
  },
];

function ExpertAttributesModal() {
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
        />{" "}
        Info
      </PrimaryButton>

      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {derivedAttributes.map((attr) => (
            <div key={attr.key} className="mb-4">
              <h5>{attr.name}</h5>
              <p>{attr.description}</p>
              <hr />
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ExpertAttributesModal;
