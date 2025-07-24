import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import apiClient from "../api/apiClient";
import Alert from "./Alert";

interface Iteration {
  iteration_number: number;
  chosen_arguments: string[];
  mScore: number;
  timestamp: string;
}

interface UserIterations {
  domain_name: string;
  username: string;
  iterations: Iteration[];
}

const Users = () => {
  const [data, setData] = useState<UserIterations[]>([]);
  const [alertError, setAlertError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get("/get-data-iterations/")
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error("Error fetching iterations:", error);
        setAlertError("Failed to load iteration data.");
      });
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Users History</h2>

      {alertError && (
        <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
      )}

      {data.length === 0 && !alertError && (
        <p className="text-muted">No user iteration data available.</p>
      )}

      {data.map((userData) => (
        <Card
          key={userData.username}
          className="box-with-border card-view mb-4"
        >
          <Card.Body>
            <Card.Title>
              <div>{userData.username}</div>
              <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                Domain: <strong>{userData.domain_name}</strong>
              </div>
            </Card.Title>

            {userData.iterations.length === 0 ? (
              <p className="text-muted fst-italic">No iterations yet.</p>
            ) : (
              <ul className="ps-3 mb-0">
                {userData.iterations.map((iter, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>Iteration {iter.iteration_number}:</strong>{" "}
                        {iter.chosen_arguments.join(", ")}
                        <br />
                        <small className="text-muted">
                          {new Date(iter.timestamp).toLocaleString("sl-SI")}
                        </small>
                      </div>
                      <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        {(iter.mScore / 100).toFixed(3)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Users;
