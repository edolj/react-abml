import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
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
  display_names: Record<string, string>;
}

const Users = () => {
  const { isSuperuser, username } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<UserIterations[]>([]);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSuperuser && username) {
      setSelectedUser({ username } as User);
    }
  }, [isSuperuser, username]);

  useEffect(() => {
    if (isSuperuser) {
      apiClient
        .get<User[]>("/users/")
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error fetching users:", error));
    }

    apiClient
      .get("/get-data-iterations/")
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error("Error fetching iterations:", error);
        setAlertError("Failed to load iteration data.");
      });
  }, [isSuperuser]);

  const filteredData = useMemo(() => {
    if (isSuperuser) {
      if (!selectedUser) return data;
      return data.filter((d) => d.username === selectedUser.username);
    }
    // normal user get own results
    if (!selectedUser) return [];
    return data.filter((d) => d.username === selectedUser.username);
  }, [data, isSuperuser, selectedUser]);

  const prettify = (arg: string, displayNames: Record<string, string>) => {
    const opsMap: Record<string, string> = {
      "<=": "is low",
      ">=": "is high",
      "<": "is low",
      ">": "is high",
      "=": "equals",
    };

    const ops = Object.keys(opsMap);

    for (const op of ops) {
      if (arg.endsWith(op)) {
        const key = arg.slice(0, -op.length).trim();
        return `${displayNames[key] ?? key} ${opsMap[op]}`;
      }

      if (arg.includes(op)) {
        const [key, value] = arg.split(op);
        return `${displayNames[key.trim()] ?? key.trim()} ${opsMap[op]} ${value.trim()}`;
      }
    }

    return displayNames[arg] ?? arg;
  };

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
                    <strong>Iteration {iter.iteration_number + 1}:</strong>{" "}
                    {isSuperuser ? iter.chosen_arguments.join(", ") : iter.chosen_arguments.map(arg => prettify(arg, userData.display_names)).join(", ")}
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
      {isSuperuser && (
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
        </>
      )}

      <Container key={selectedUser ? selectedUser.username : "all"}>
        {alertError && (
          <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
        )}

        {filteredData.map(renderUserCard)}
      </Container>
    </>
  );
};

export default Users;
