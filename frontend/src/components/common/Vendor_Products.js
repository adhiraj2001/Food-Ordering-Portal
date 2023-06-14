import { useState, useEffect } from "react";
import axios from "axios";
import ls from "local-storage";

import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Button from "@mui/material/Button";

const Vendor_Products = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
      axios
          .post("/api/products/view", { vendor_email: ls.get("email") })
          .then((res) => {
              console.log(res.data);
              setProducts(res.data);
          })
          .catch((err) => {
              console.log(err);
          });
  }, []);
  
  const onCancel = args => event => {
      axios
          .post("/api/products/delete", { _id: products[args]._id })
          .then((res) => {
              console.log(res.data);

              alert(`Product ${products[args].name} deleted.`);
              window.location.reload();
          })
          .catch((err) => {
              console.log(err);

              console.log(err.response.data);
              alert(err.response.data[Object.keys(err.response.data)[0]]);

              window.location.reload();
          });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, background: "rgba(0, 0, 0, 0.1)" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"> Sr No.</TableCell>
            <TableCell align="center"> Name </TableCell>
            <TableCell align="center"> Type </TableCell>
            <TableCell align="center"> Price </TableCell>
            <TableCell align="center"> Quantity </TableCell>
            <TableCell align="center"> Options </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row, ind) => (
            <TableRow
                key={ind}
              >
                <TableCell align="center">{ind + 1}</TableCell>  
                <TableCell align="center"> {row.name} </TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">
                      <Button variant="contained" onClick={onCancel(ind)} sx={{ ml: 2 }} > Delete </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Vendor_Products;