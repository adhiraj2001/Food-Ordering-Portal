import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

class Register_init extends Component {

    constructor(props) {
        super(props);
        
		this.state = {
			user_option: "buyer",

            name: "",
            email: "",
            password: "",
            contact_no: 0,
            age: 0,
            batch: "",

            manager: "",
            shop: "",
            op_time: "",
            ed_time: "",
            
            errors: {}
		};
	}

    // state = {
    //     user_option: "buyer",

    //     name: "",
    //     email: "",
    //     password: "",
    //     contact_no: 0,
    //     age: 0,
    //     batch: "",

    //     manager: "",
    //     shop: "",
    //     op_time: "",
    //     ed_time: "",
        
    //     errors: {}
    // }

    onChangeUser_option = e => {
        this.setState({
            user_option: e.target.value
        });
    };

    onChangeName = e => {
        this.setState({
            name: e.target.value
        });
    };

    onChangeEmail = e => {
        this.setState({
            email: e.target.value
        });
    };

    onChangePassword = e => {
        this.setState({
            password: e.target.value
        });
    };

    onChangeContact_no = e => {
        this.setState({
            contact_no: e.target.value
        });
    };

    onChangeAge = e => {
        this.setState({
            age: e.target.value
        });
    };

    onChangeBatch = e => {
        this.setState({
            batch: e.target.value
        });
    };

    onChangeManager = e => {
        this.setState({
            manager: e.target.value
        });
    };

    onChangeShop = e => {
        this.setState({
            shop: e.target.value
        });
    };

    onChangeOp_time = e => {
        this.setState({
            op_time: e.target.value
        });
    };

    onChangeEd_time = e => {
        this.setState({
            ed_time: e.target.value
        });
    };


    // onChange = e => {
    //     e.persist();
	// 	this.setState({ [e.target.id]: e.target.value });
    // };

    onSubmit_buyer = e => {
        e.preventDefault();

        const newBuyer = {
            
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            contact_no: this.state.contact_no,
            age: this.state.age,
            batch: this.state.batch
        };

        console.log(newBuyer);

        axios.post("/api/buyers/register", newBuyer)
            .then(res => {
                alert("Buyer Registered Successfully");
                this.reset_buyer();
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);
            });
    };

    reset_buyer = e => {
        this.setState({
            name: "",
            email: "",
            password: "",
            contact_no: 0,
            age: 0,
            batch: ""
        });
    }

    onSubmit_vendor = e => {
        e.preventDefault();

        const newVendor = {
            manager: this.state.manager,
            shop: this.state.shop,
            email: this.state.email,
            password: this.state.password,
            contact_no: this.state.contact_no,
            op_time: this.state.op_time,
            ed_time: this.state.ed_time
        };

        axios.post("/api/vendors/register", newVendor)
            .then(res => {
                console.log(res.data);
                alert("Vendor Registered Successfully");
                this.reset_vendor();
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);
            });
        
    };

    reset_vendor = e => {
        this.setState({
            manager: "",
            shop: "",
            email: "",
            password: "",
            contact_no: 0,
            op_time: "",
            ed_time: "",
        });
    };

     
    render = () => {

        // const { errors } = this.state;
        // const { user_option } = this.state;
        
        if (this.state.user_option === "buyer") {
            return (
                
                <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                    <Typography component="h1" variant="h3">
                        Sign Up
                    </Typography>

                    <FormControl onSubmit={this.onSubmit_buyer} sx={{ m: 5, minWidth: 120 }}>

                        <div>
                            <InputLabel id="label-user-option"> User </InputLabel>
                            <Select
                                id="user-option"
                                labelId="lable-user-option"
                                value={this.state.user_option}
                                label="user-option"
                                onChange={this.onChangeUser_option}
                                sx={{ mt: 3, minWidth: 30 }}
                                required
                            >
                                
                                {/* <MenuItem value=""> <em> None </em> </MenuItem> */}
                                <MenuItem value={"buyer"}> Buyer </MenuItem>
                                <MenuItem value={"vendor"}> Vendor </MenuItem>
                            </Select>
                        </div>

                        <div>
                            <TextField id="name" label="Name" type="text" variant="outlined" value={this.state.name} onChange={this.onChangeName} sx={{ mt: 3 }} required />
                        </div>
                        
                        <div>
                            <TextField id="email" label="Email" type="email" variant="outlined" value={this.state.email} onChange={this.onChangeEmail} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="password" label="Password" type="password" variant="outlined" value={this.state.password} onChange={this.onChangePassword} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="contact_no" label="Contact No." type="number" variant="outlined" value={this.state.contact_no} onChange={this.onChangeContact_no} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="age" label="Age" type="number" variant="outlined" value={this.state.age} onChange={this.onChangeAge} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="batch" label="Batch" type="text" variant="outlined" value={this.state.batch} onChange={this.onChangeBatch} sx={{ mt: 3 }} required />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.onSubmit_buyer}
                        >
                            Register
                        </Button>

                    </FormControl>
                </Box>

            );
        }
        else if (this.state.user_option === "vendor") {
            return (
                
                <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                    <Typography component="h1" variant="h3">
                        Sign Up
                    </Typography>

                    <FormControl onSubmit={this.onSubmit_vendor} sx={{ m: 5, minWidth: 120 }}>

                        <div>
                            <InputLabel id="label-user-option"> User </InputLabel>
                            <Select
                                id="user-option"
                                labelId="lable-user-option"
                                value={this.state.user_option}
                                label="user-option"
                                onChange={this.onChangeUser_option}
                                sx={{ mt: 3, minWidth: 30 }}
                                required
                            >
                                
                                {/* <MenuItem value=""> <em> None </em> </MenuItem> */}
                                <MenuItem value={"buyer"}> Buyer </MenuItem>
                                <MenuItem value={"vendor"}> Vendor </MenuItem>
                            </Select>
                        </div>

                        <div>
                            <TextField id="manager" label="Manager" type="text" variant="outlined" value={this.state.manager} onChange={this.onChangeManager} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="Shop" label="Shop" type="text" variant="outlined" value={this.state.shop} onChange={this.onChangeShop} sx={{ mt: 3 }} required />
                        </div>
                        
                        <div>
                            <TextField id="email" label="Email" type="email" variant="outlined" value={this.state.email} onChange={this.onChangeEmail} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="password" label="Password" type="password" variant="outlined" value={this.state.password} onChange={this.onChangePassword} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <TextField id="contact_no" label="Contact No." type="number" variant="outlined" value={this.state.contact_no} onChange={this.onChangeContact_no} sx={{ mt: 3 }} required />
                        </div>

                        <div>
                            <Typography component="h3" variant="h6" sx={{ mt: 3 }} >
                                Opening Time:
                            </Typography>

                            <TextField id="op_time" type="time" variant="outlined" value={this.state.op_time} onChange={this.onChangeOp_time} sx={{ mt: 0 }} required />
                        </div>

                        <div>
                            <Typography component="h3" variant="h6" sx={{ mt: 3 }} >
                                Closing Time:
                            </Typography>

                            <TextField id="ed_time" type="time" variant="outlined" value={this.state.ed_time} onChange={this.onChangeEd_time} sx={{ mt: 0 }} required />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.onSubmit_vendor}
                        >
                            Register
                        </Button>

                    </FormControl>
                </Box>

            );
        }

        return (

            <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                <Typography component="h1" variant="h3">
                    Sign Up
                </Typography>
                
                <FormControl noValidate sx={{ m: 5, minWidth: 120 }}>
                    <div>
                        <InputLabel id="label-user-option"> User </InputLabel>
                        <Select
                            id="user-option"
                            labelId="lable-user-option"
                            value={this.state.user_option}
                            label="user-option"
                            onChange={this.onChangeUser_option}
                            sx={{ mt: 3, minWidth: 30 }}
                            required
                        >
                            
                            {/* <MenuItem value=""> <em> None </em> </MenuItem> */}
                            <MenuItem value={"buyer"}> Buyer </MenuItem>
                            <MenuItem value={"vendor"}> Vendor </MenuItem>
                        </Select>
                    </div>
                </FormControl>
            </Box>

        );
    };
}

export default Register_init;


