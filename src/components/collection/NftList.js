import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow"; 
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { useNavigate } from "react-router-dom"; 

const columns = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "type", label: "Type" },

  // {
  //   id: "issueDate",
  //   label: "Issue Date",
  // },
  // {
  //   id: "expireDate",
  //   label: "Expire Date",
  // },
];

export default function NftList() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); 

  const fireDataContext = React.useContext(firebaseDataContext);
  const { rowsCollection } = fireDataContext;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigateTo = (id) => {
    navigate(`/dashboard/collector/${id}`);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "20px" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsCollection
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => navigateTo(row.eventId)}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    {/* <TableCell>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateClaimersExcellSheet(row.eventId, row.name, item.chain);
                        }}
                      >
                        Download
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={rowsCollection.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
