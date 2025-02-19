import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/users/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 300 },
    { field: "first_name", headerName: "First Name", width: 300 },
    { field: "last_name", headerName: "Last Name", width: 300 },
    { field: "email", headerName: "Email", width: 300 },
  ];

  const rows = users.map((user) => ({
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  }));

  return (
    <div style={{ padding: "40px" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSizeOptions={[5, 10, 15, 20]}
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        onPaginationModelChange={(newPaginationModel) =>
          setPaginationModel(newPaginationModel)
        }
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{ background: "white" }}
      />
    </div>
  );
};

export default Users;
