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

import { Typography } from "@mui/material";
import Button from "@mui/material/Button";


const Buyer_Orders = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios
            .post("/api/orders/view_buyer", { buyer_email: ls.get("email") })
            .then((res) => {
                console.log(res.data);
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        
        console.log(orders);
    }, []);

    //! ^ RELOAD THIS PAGE ON STATE VARIABLE STATUS ^ !//

    const onOrder1 = args => event => {
        const updateOrder = {
            _id: orders[args]._id,
            name: orders[args].name,
            price: orders[args].price,
            quantity: orders[args].quantity,
            type: orders[args].type,
            vendor_email: orders[args].vendor_email,
            buyer_email: orders[args].buyer_email,
            shop: orders[args].shop,
            status: "Completed"
        }

        axios
            .post("/api/orders/update", updateOrder)
            .then((res) => {
                console.log(res.data);
                orders[args].status = updateOrder.status;

                alert(`Item ${orders[args].name} Order placed successfully!`);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);

                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);

                window.location.reload();
            });
    }

    const onOrder2 = args => event => {
        const updateOrder = {
            _id: orders[args]._id,
            name: orders[args].name,
            price: orders[args].price,
            quantity: orders[args].quantity,
            type: orders[args].type,
            vendor_email: orders[args].vendor_email,
            buyer_email: orders[args].buyer_email,
            shop: orders[args].shop,
            status: "Rejected"
        }

        axios
            .post("/api/orders/update", updateOrder)
            .then((res) => {
                console.log(res.data);
                orders[args].status = updateOrder.status;

                alert(`Item ${orders[args].name} Order placed successfully!`);
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
            <TableCell align="center"> Shop </TableCell>
            <TableCell align="center"> Status </TableCell>
            <TableCell align="center"> Options </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row, ind) => (
            <TableRow
                key={ind}
              >
                <TableCell align="center">{ind + 1}</TableCell>  
                <TableCell align="center"> {row.name} </TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">{row.shop}</TableCell>
                <TableCell align="center">
                      <Typography
                          style={{
                             backgroundColor:
                                  (row.status === "Placed" && "grey") ||
                                  (row.status === "Accepted" && "green") ||
                                  (row.status === "Cooking" && "yellow") ||
                                  (row.status === "Ready for Pickup" && "blue") ||
                                  (row.status === "Completed" && "green") ||
                                    (row.status === "Rejected" && "red"),
                              color: "white",
                              padding: "5px",
                              borderRadius: "5px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              margin: "5px"
                          }}
                      >
                          { row.status }
                    </Typography>
                </TableCell>
                <TableCell align="center">
                      <Button variant="contained" onClick={onOrder1(ind)} disabled={row.status !== "Ready for Pickup"} sx={{ ml: 2 }} > Pick Up </Button>
                      <Button variant="contained" onClick={onOrder2(ind)} disabled={row.status === "Completed" || row.status === "Rejected"} sx={{ ml: 2 }} > Cancel </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Buyer_Orders;