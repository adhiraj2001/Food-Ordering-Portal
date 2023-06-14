import { useState, useEffect } from "react";
import axios from "axios";
import ls from "local-storage";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { fontWeight } from "@mui/system";

const Products_List = (props) => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);

    const [vendors, setVendors] = useState([]);
     
    // const [sortName, setSortName] = useState(true);
    const [sortPrice, setSortPrice] = useState(true);
    const [sortQuantity, setSortQuantity] = useState(true);

    const [searchText, setSearchText] = useState("");

    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(1000);

    const [vendorShop, setVendorShop] = useState("");

    const [rowQuantity, setRowQuantity] = useState({});

    useEffect(() => {
        axios
            .get("/api/products")
            .then((res) => {
                    console.log(res.data);
                    setProducts(res.data);
                    setSortedProducts(res.data);
                    setSearchText("");
                })
            .catch((err) => {
                console.log(err);
            });
        
        // rowQuantity.length = products.length;
        // rowQuantity.fill(1);
        
        axios
            .get("/api/vendors")
            .then((res) => {
                    console.log(res.data); 
                    setVendors(res.data);
                })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // const sortChange = () => {
    //     let productsTemp = products;
    //     const flag = sortName;
        
    //     productsTemp.sort((a, b) => {
    //         if (a.date != undefined && b.date != undefined) {
    //             return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
    //         }
    //         else {
    //             return 1;
    //         }
    //     });
      
    //     setSortedProducts(productsTemp);
    //     setSortName(!sortName);
    // };

    const sortChange1 = () => {
        let productsTemp = products;
        const flag = sortPrice;
        
        productsTemp.sort((a, b) => {
            if (a.price != undefined && b.price != undefined) {
                return (1 - flag * 2) * (a.price - b.price);
            }
            else {
                return 1;
            }
        });
        
        setSortedProducts(productsTemp);
        setSortPrice(!sortPrice);
    };

    const sortChange2 = () => {
        let productsTemp = products;
        const flag = sortQuantity;
        
        productsTemp.sort((a, b) => {
            if (a.quantity != undefined && b.quantity != undefined) {
                return (1 - flag * 2) * (a.quantity - b.quantity);
            } else {
                return 1;
            }
        });
        
        setSortedProducts(productsTemp);
        setSortQuantity(!sortQuantity);
    };
    

    const onChangeSearchText = (event) => {
        console.log(event.target.value);
        setSearchText(event.target.value);
    };

    const onChangeMin = (event) => {
        console.log(event.target.value);

        if (event.target.value.length === 0) {
            setMinVal(0);
        }
        else {
            setMinVal(event.target.value);
        }
            
        console.log(`max_val: ${maxVal}`);
    };

    const onChangeMax = (event) => {
        console.log(event.target.value);

        if (event.target.value.length === 0) {
            setMaxVal(1000);
        }
        else {
            setMaxVal(event.target.value);
        }
            
        console.log(`max_val: ${maxVal}`);
    };

    const onChangeVendor = (event) => {
        console.log(event.target.value);
        setVendorShop(event.target.value);
    };

    const onChangeQuantity = args => e => {
        console.log(args);
        // console.log(e.target.value);
        
        rowQuantity[args] = e.target.value;
        console.log(rowQuantity);
    }

    const onOrder = args => event => {
        event.preventDefault();

        const newPrice = sortedProducts[args].price * parseInt(rowQuantity[args]);
        const newOrder = {
            name: sortedProducts[args].name,
            price: newPrice,
            quantity: parseInt(rowQuantity[args]),
            type: sortedProducts[args].type,
            vendor_email: sortedProducts[args].vendor_email,
            buyer_email: ls.get("email"),
            shop: sortedProducts[args].shop
        };

        if (newOrder.quantity > sortedProducts.quantity || newOrder.quantity <= 0) {
			alert(`Sorry ${newOrder.order_quantity} quantity is not available.`);
			window.location.reload();
			return;
		}

        if (newPrice > ls.get("money")) {
            alert(`Sorry you don't have enough money for price:[${newPrice}]`);
            window.location.reload();
            return;
        }

        axios
            .post("/api/orders/add", newOrder)
            .then((res) => {
                console.log(res.data);

                const remQuantity = sortedProducts[args].quantity - newOrder.quantity;
                const updateProduct = {
                    _id: sortedProducts[args]._id,
                    name:  sortedProducts[args].name,
                    shop: sortedProducts[args].shop,
                    vendor_email: sortedProducts[args].vendor_email,
                    type: sortedProducts[args].type,
                    price: sortedProducts[args].price,
                    quantity: remQuantity,
                    status: sortedProducts.status
                };
                
                axios
                    .post("/api/products/update", updateProduct)
                    .then((res) => {
                        // console.log("WORKING");
                        console.log(res.data);
                        sortedProducts[args].quantity = remQuantity;
                    })
                    .catch((err) => {
                        console.log(err);

                        console.log(err.response.data);
                        alert(err.response.data[Object.keys(err.response.data)[0]]);

                        window.location.reload();
                        return;
                    });

                const remMoney = ls.get("money") - newPrice;
                const updateUser = {
                    name: ls.get("name"),
                    email: ls.get("email"),      // <-- id not _id
                    password: ls.get("password"),
                    contact_no: ls.get("contact_no"),
                    age: ls.get("age"),
                    batch: ls.get("batch"),
                    money: remMoney
                }

                axios
                    .post("/api/buyers/update", updateUser)
                    .then((res) => {
                        console.log(res.data);
                        ls.set("money", remMoney);
                    })
                    .catch((err) => {
                        console.log(err);

                        console.log(err.response.data);
                        alert(err.response.data[Object.keys(err.response.data)[0]]);
                
                        window.location.reload();
                        return;
                    });

                alert(`Item ${newOrder.name} Order placed successfully!`);
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
        <div>
        <Grid container>
            <Grid item xs={12} md={3} lg={3}>
            <List component="nav" aria-label="mailbox folders">
                <ListItem button>
                <h2>Wallet : <span> {ls.get('money')} units </span> </h2>
                </ListItem>
                <ListItem text>
                <h1>Filters</h1>
                </ListItem>
            </List>
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
            <List component="nav" aria-label="mailbox folders">
                <TextField
                    id="standard-basic"
                    label="Search"
                    fullWidth={true}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                            
                    onChange={onChangeSearchText}
                />
            </List>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12} md={3} lg={3}>
            <List component="nav" aria-label="mailbox folders">
                <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        Price
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        id="standard-basic"
                        label="Enter Min"
                        type="number"
                        fullWidth={true}
                        placeholder={minVal}
                        onChange={onChangeMin}
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        id="standard-basic"
                        label="Enter Max"
                        type="number"
                        width={100}
                        placeholder={maxVal}
                        onChange={onChangeMax}
                    />
                    </Grid>
                </Grid>
                </ListItem>
                <Divider />
                <ListItem divider>
                <Autocomplete
                    id="combo-box-demo"
                    options={vendors}
                    getOptionLabel={(option) => option.shop}
                    fullWidth
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Selected Shop"
                        variant="outlined"
                        onChange={onChangeVendor}
                    />
                    )}
                />
                </ListItem>
            </List>
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"> 
                            Sr No.
                        </TableCell> 
                        {/* <TableCell align="center">
                            {" "}
                            <Button onClick={sortChange}>
                                {sortName ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </Button>
                            Date
                        </TableCell> */}
                        <TableCell align="center">
                            Name
                        </TableCell>
                        <TableCell align="center">
                            Type
                        </TableCell>
                        <TableCell align="center">
                            {" "}
                            <Button onClick={sortChange1}>
                                {sortPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </Button>
                            Price
                        </TableCell>
                        <TableCell align="center">
                            {" "}
                            <Button onClick={sortChange2}>
                                {sortQuantity ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </Button>
                            Quantity
                        </TableCell>
                        <TableCell align="center">
                            Shop Name
                        </TableCell>
                        <TableCell align="center">
                            Vendor Email
                        </TableCell>
                        <TableCell align="center">
                            Quantity Selected
                        </TableCell>
                        <TableCell align="center">
                            Submit Order
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProducts.map((product, ind) => {
                        if (product.name.toLowerCase().includes(searchText.toLowerCase()) && product.price >= minVal && product.price <= maxVal &&
                            product.shop.toLowerCase().includes(vendorShop.toLowerCase())) {

                            return (
                            <TableRow key={ind}>
                                <TableCell align="center">{ind}</TableCell>
                                {/* <TableCell align="center">{product.date}</TableCell> */}
                                <TableCell align="center">{product.name}</TableCell>
                                <TableCell align="center">{product.type}</TableCell>
                                <TableCell align="center">{product.price}</TableCell>
                                <TableCell align="center">{product.quantity}</TableCell>
                                <TableCell align="center">{product.shop}</TableCell>
                                <TableCell align="center">{product.vendor_email}</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        id="standard-basic"
                                        label="Quantity"
                                        type="number"
                                        min={1}
                                        max={product.quantity}
                                        placeholder={1}
                                        onChange={onChangeQuantity(ind)}
                                        sx={{ width: 150 }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" onClick={onOrder(ind)}> Order </Button>
                                </TableCell>
                            </TableRow>
                            );
                        }
                    })}
                </TableBody>
                </Table>
            </Paper>
            </Grid>
        </Grid>
        </div>
    );
};

export default Products_List;
