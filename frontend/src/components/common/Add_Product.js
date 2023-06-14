import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ls from "local-storage";


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

class Add_Product extends Component {
    constructor(props) {

        super(props);

        this.state = {
            name: "",
            shop: "",
            vendor_email: "",
            type: "Veg",
            price: 0,
            quantity: 0
        };

        this.state.shop = ls.get("shop");
        this.state.vendor_email = ls.get('email');
    }

    onChangeName = e => {
        this.setState({
            name: e.target.value
        });
    }

    onChangeType = e => {
        this.setState({
            type: e.target.value
        });
    }

    onChangePrice = e => {
        this.setState({
            price: e.target.value
        });
    }

    onChangeQuantity = e => {
        this.setState({
            quantity: e.target.value
        });
    }

    addPrice = e => {
        this.setState({
            price: this.state.price + 5
        });
    };

    badPrice = e => {
        this.setState({
            price: this.state.price - 5
        });
    };

    addQuantity = e => {
        this.setState({
            quantity: this.state.quantity + 2
        });
    };

    badQuantity = e => {
        this.setState({
            quantity: this.state.quantity - 2
        });
    };

    //* Add Product
    onSubmit = e => {
        e.preventDefault();

        const newProduct = {
            
            name: this.state.name,
            shop: this.state.shop,
            vendor_email: this.state.vendor_email,
            type: this.state.type,
            price: this.state.price,
            quantity: this.state.quantity
        };

        console.log(newProduct);

        axios.post("/api/products/add", newProduct)
            .then(res => {
                console.log(res.data);

                alert("Buyer Updated Successfully");
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);
            });
    };



    render = () => {
        return (
            <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                <Typography component="h3" variant="h3">
                    Add Product
                </Typography>

                <div>
                    <TextField id="name" label="Product Name" type="text" variant="outlined" value={this.state.name} onChange={this.onChangeName} sx={{ mt: 3 }} required />
                </div>

                <FormControl onSubmit={this.onSubmit_buyer} sx={{ m: 5, minWidth: 120 }}>

                    <div>
                        <InputLabel id="label-product-type"> Product Type </InputLabel>
                        <Select
                            id="product-type"
                            labelId="lable-product-type"
                            value={this.state.type}
                            label="Product Type"
                            onChange={this.onChangeType}
                            sx={{ mt: 3, minWidth: 30 }}
                            required
                        >
                        
                            {/* <MenuItem value=""> <em> None </em> </MenuItem> */}
                            <MenuItem value={"Veg"}> Veg </MenuItem>
                            <MenuItem value={"Non-Veg"}> Non-Veg </MenuItem>
                        </Select>
                    </div>

                    <div>
                        <TextField id="price" label="Price" type="number" variant="outlined" value={this.state.price} onChange={this.onChangePrice} sx={{ mt: 3 }} required />

                        <IconButton aria-label="add-money" onClick={this.addPrice} sx={{ mt: 3, ml: 3 }}>
                            <AddBoxIcon> Filled </AddBoxIcon>
                        </IconButton>
                        
                        <IconButton aria-label="bad-money" onClick={this.badPrice} sx={{ mt: 3, ml: 3 }}>
                            <IndeterminateCheckBoxIcon> Filled </IndeterminateCheckBoxIcon>
                        </IconButton>
                    </div>

                    <div>
                        <TextField id="quantity" label="Quantity" type="number" variant="outlined" value={this.state.quantity} onChange={this.onChangeQuantity} sx={{ mt: 3 }} required />

                        <IconButton aria-label="add-money" onClick={this.addQuantity} sx={{ mt: 3, ml: 3 }}>
                            <AddBoxIcon> Filled </AddBoxIcon>
                        </IconButton>
                        
                        <IconButton aria-label="bad-money" onClick={this.badQuantity} sx={{ mt: 3, ml: 3 }}>
                            <IndeterminateCheckBoxIcon> Filled </IndeterminateCheckBoxIcon>
                        </IconButton>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={this.onSubmit}
                    >
                        Add
                    </Button>

                </FormControl>
            </Box>
        );
    }
}

export default Add_Product;