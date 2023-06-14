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

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_option: "buyer",
            email: "",
            password: "",

            errors: {}
        };
    }

    onChangeUser_option = e => {
        this.setState({
            user_option: e.target.value
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

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password,
        };

        if (this.state.user_option === "buyer") {

            axios
                .post("http://localhost:4000/buyers/login", userData)
                .then(res => {
                    console.log(res.data);

                    ls.set("login", "true");
                    ls.set("user_type", "buyer");
                    ls.set("username", res.data.name);
                    

                    ls.set("name", res.data.name);
                    ls.set("email", res.data.email);
                    ls.set("password", res.data.password);
                    ls.set("contact_no", res.data.contact_no);
                    ls.set("age", res.data.age);
                    ls.set("batch", res.data.batch);
                    ls.set("money", res.data.money);

                    alert("Buyer Logged In Successfully");
                    
                    this.reset_user();
                    window.location = "/";
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err.response.data);
                    alert(err.response.data[Object.keys(err.response.data)[0]]);
                });
            
        }
        else {

            axios
                .post("/api/vendors/login", userData)
                .then(res => {
                    console.log(res.data);

                    ls.set("login", "true");
                    ls.set("user_type", "vendor");
                    ls.set("username", res.data.manager);

                    ls.set("manager", res.data.manager);
                    ls.set("shop", res.data.shop);
                    ls.set("email", res.data.email);
                    ls.set("password", res.data.password);
                    ls.set("contact_no", res.data.contact_no);
                    ls.set("op_time", res.data.op_time);
                    ls.set("ed_time", res.data.ed_time);

                    alert("Vendor Logged In Successfully");
                    
                    this.reset_user();
                    window.location = "/";
                })
                .catch(err => {
                    console.log(err.response.data);
                    alert(err.response.data[Object.keys(err.response.data)[0]]);
                });
            
        }
    };

    reset_user = e => {
        this.setState({
            email: "",
            password: ""
        });
    };
    
    render() {

        const errors = this.state.errors;

        return (

            <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                <Typography component="h1" variant="h3">
                    Sign In
                </Typography>

                <FormControl onSubmit={this.onSubmit} sx={{ m: 5, minWidth: 120 }}>

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
                        <TextField id="email" label="Email" type="email" variant="outlined" value={this.state.email} onChange={this.onChangeEmail} sx={{ mt: 3 }} required />
                    </div>

                    <div>
                        <TextField id="password" label="Password" type="password" variant="outlined" value={this.state.password} onChange={this.onChangePassword} sx={{ mt: 3 }} required />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={this.onSubmit}
                    >
                        Login
                    </Button>

                </FormControl>
            </Box>
        );
    }
}

export default Login;


