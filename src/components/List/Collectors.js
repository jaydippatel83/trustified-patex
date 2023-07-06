import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { useParams, useLocation } from "react-router-dom";
import TableRowComponent from "./TableRow";

function Collectors(props) {
  const params = useParams();
  const { state } = useLocation();
  const chain = state?.chain;
  const collectionContract = state?.collectionContract
  const fireDataContext = React.useContext(firebaseDataContext);
  const { claim, getClaimers, type } = fireDataContext;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [collectors, setCollectors] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [columns, setColumns] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getClaimers(params.token, chain, collectionContract);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  useEffect(() => {
    setCollectors(claim);
  }, [claim]);

  useEffect(() => {
    if (type === "badge") {
      setColumns([
        {
          id: "tokenContract",
          label: "Token Contract",
        },
        {
          id: "ipfsurl",
          label: "Badge",
        },
        {
          id: "claimed",
          label: "Claimed",
        },
        {
          id: "claimerAddress",
          label: "Claimer",
        },
        { id: "tokenId", label: "TokenId" },
        { id: "type", label: "Type" },
      ]);
    } else {
      setColumns([
        {
          id: "name",
          label: "Name",
        },
        {
          id: "tokenContract",
          label: "Token Contract",
        },
        {
          id: "ipfsurl",
          label: "Certificate",
        },
        {
          id: "claimed",
          label: "Claimed",
        },
        {
          id: "claimerAddress",
          label: "Claimer",
        },
        { id: "tokenId", label: "TokenId" },
        { id: "type", label: "Type" },
      ]);
    }
  }, [type]);

  return (
    <div className="footer-position">
      {/* <div className="container">
        <div className="row"> */}
      <div className="col-6 mt-4 mb-5">
        <h2 className="block-title__title">
          <span>Claimers</span>
        </h2>
      </div>
      <div className="col-lg-12 mb-5">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                {collectors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        {columns.map((column) => {
                         
                          const value = row[column.id];
                          return (
                            <TableRowComponent
                              key={column.id}
                              event={params.token}
                              id={column.id}
                              value={value}
                              url={row.ipfsurl}
                              index={index}
                              type={type}
                              token={row.claimToken}
                              status={row.claimed}
                            />
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={claim.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {/* </div>
      </div> */}
    </div>
  );
}

export default Collectors;
