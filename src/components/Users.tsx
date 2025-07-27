import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import Divider from "@mui/material/Divider";
import UserTableWithPagination, { User } from "./UserTableWithPagination";
import PrimaryButton from "./PrimaryButton";
import Box from "@mui/material/Box";
import apiClient from "../api/apiClient";
import Alert from "./Alert";

interface Iteration {
  selectedExampleId: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<UserIterations[]>([]);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    apiClient
      .get<User[]>("/users/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    apiClient
      .get("/get-data-iterations/")
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error("Error fetching iterations:", error);
        setAlertError("Failed to load iteration data.");
      });
  }, []);

  const renderUserCard = (userData: UserIterations) => (
    <Card key={userData.username} className="box-with-border card-view mb-4">
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
                      Example: {iter.selectedExampleId}
                    </small>
                    <br />
                    <small className="text-muted">
                      {new Date(iter.timestamp).toLocaleString("sl-SI")}
                    </small>
                  </div>
                  <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    {(iter.mScore / 100).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Container>
        <UserTableWithPagination users={users} onUserClick={setSelectedUser} />
      </Container>

      <Container>
        <Divider sx={{ borderColor: "black" }} />
      </Container>

      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h3>User History</h3>
          <PrimaryButton onClick={() => setSelectedUser(null)}>
            Show All Users
          </PrimaryButton>
        </Box>
      </Container>

      <Container key={selectedUser ? selectedUser.username : "all"}>
        {alertError && (
          <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
        )}

        {selectedUser
          ? data
              .filter((d) => d.username === selectedUser.username)
              .map(renderUserCard)
          : data.map(renderUserCard)}
      </Container>
    </>
  );
};

export default Users;
