import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  last_login: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
}

const UserTableWithPagination: React.FC<UserTableProps> = ({
  users,
  onUserClick,
}) => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredUsers = users.filter((user: any) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Search bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearchChange}
        />
      </Box>

      <TableContainer
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#607ad1",
              "& th": { color: "white", fontWeight: "bold" },
            }}
          >
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Last login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user: any) => (
              <TableRow key={user.id} onClick={() => onUserClick(user)}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleString("sl-SI")
                    : "—"}
                </TableCell>
                <TableCell>
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString("sl-SI")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          ".MuiTablePagination-toolbar": {
            alignItems: "center",
          },
          ".MuiTablePagination-selectLabel": {
            marginTop: "auto",
            marginBottom: "auto",
          },
          ".MuiTablePagination-displayedRows": {
            marginTop: "auto",
            marginBottom: "auto",
          },
        }}
      />
    </Paper>
  );
};

export default UserTableWithPagination;
