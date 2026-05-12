import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis} from "recharts"
import { ResponsiveContainer, CartesianGrid} from "recharts"
import { Bar, BarChart, LabelList, Tooltip} from "recharts"
import UserTableWithPagination, { User } from "./UserTableWithPagination";
import Divider from "@mui/material/Divider";
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
  const [viewMode, setViewMode] = useState<"statistics" | "user">("statistics");

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

  const renderUserCard = (userData: UserIterations) => {
    const chartData = userData.iterations.map((iter) => ({
      iteration: iter.iteration_number + 1,
      mScore: Number((iter.mScore / 100).toFixed(2)),
    }));

    return (
      <Card key={userData.username} className="box-with-border card-view mb-4">
        <Card.Body>
          <Card.Title>
            <div>{userData.username}</div>
            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
              Domain: <strong>{userData.domain_name}</strong>
            </div>
          </Card.Title>

          {userData.iterations.length > 0 && (
            <div style={{ width: "100%", height: 250, marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="iteration"/>
                  <YAxis domain={[0, 1]} label={{ value: "m-score", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mScore" stroke="#607ad1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

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
  };

  const renderStatisticsCard = (domainData: UserIterations[]) => {
    const domainName = domainData[0]?.domain_name ?? "Unknown";

    // statistics
    const totalUsers = new Set(
      domainData.map((d) => d.username)
    ).size;

    const totalIterations = domainData.reduce(
      (sum, d) => sum + d.iterations.length,
      0
    );

    // score intervals
    const ranges = [
      { label: "<50",    min: 0,  max: 50 },
      { label: "50-59",  min: 50, max: 60 },
      { label: "60-69",  min: 60, max: 70 },
      { label: "70-79",  min: 70, max: 80 },
      { label: "80-89",  min: 80, max: 90 },
      { label: "90-100", min: 90, max: 101 },
    ];

    // chart data
    const chartData = ranges.map((range) => {
      let count = 0;

      domainData.forEach((user) => {
        user.iterations.forEach((iter) => {
          if (
            iter.mScore >= range.min &&
            iter.mScore < range.max
          ) {
            count++;
          }
        });
      });

      return {
        range: range.label,
        count,
      };
    });

    return (
      <Card
        key={domainName}
        className="box-with-border card-view mb-4"
      >
        <Card.Body>
          <Card.Title style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1rem" }}>
            {domainName}
          </Card.Title>

          <div style={{ borderRadius: "12px", display: "flex", gap: "2rem", marginBottom: "1rem", marginTop: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#607ad1" }} >
                {totalUsers}
              </div>

              <div className="text-muted">
                Total Users
              </div>
            </div>

            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#607ad1" }} >
                {totalIterations}
              </div>

              <div className="text-muted">
                Total Iterations
              </div>
            </div>
          </div>

          <div style={{ height: 300, marginTop: "1rem"}}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#607ad1" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      {isSuperuser && (
        <>
          <Container>
            <UserTableWithPagination users={users} onUserClick={(user) => {
              setSelectedUser(user);
              setViewMode("user");
            }} />
          </Container>

          <Container>
            <Divider sx={{ borderColor: "black" }} />
          </Container>

          <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <h3>{viewMode === "statistics" ? "General Statistics" : "User History"}</h3>
              {viewMode === "user" && (
                <PrimaryButton
                  onClick={() => {
                    setSelectedUser(null);
                    setViewMode("statistics");
                  }}
                >
                  Show Statistics
                </PrimaryButton>
              )}
            </Box>
          </Container>
        </>
      )}

      <Container key={selectedUser ? selectedUser.username : "all"}>
        {alertError && (
          <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
        )}

        {viewMode === "statistics" ? (
          <Row>
            {Object.values(
              data.reduce((acc, curr) => {
                if (!acc[curr.domain_name]) {
                  acc[curr.domain_name] = [];
                }

                acc[curr.domain_name].push(curr);

                return acc;
              }, {} as Record<string, UserIterations[]>)
            ).map((domainData) => (
              <Col md={6} key={domainData[0]?.domain_name}>
                {renderStatisticsCard(domainData)}
              </Col>
            ))}
          </Row>
        ) : (
          filteredData.map(renderUserCard)
        )}
      </Container>
    </>
  );
};

export default Users;
