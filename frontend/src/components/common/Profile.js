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

class Profile extends Component {

    constructor(props) {
        super(props);
        
		this.state = {
            user_type: "",
            name: "",
            email: "",
            password: "",
            contact_no: 0,
            age: 0,
            money: 0,
            batch: "",
            manager: "",
            shop: "",
            op_time: "",
            ed_time: ""
        };

        this.state.user_type = ls.get("user_type");
        this.state.name = ls.get("name");
        this.state.email = ls.get("email");
        this.state.password = ls.get("password");
        this.state.contact_no = ls.get("contact_no");
        this.state.age = ls.get("age");
        this.state.money = ls.get("money");
        this.state.batch = ls.get("batch");
        this.state.manager = ls.get("manager");
        this.state.shop = ls.get("shop");
        this.state.op_time = ls.get("op_time");
        this.state.ed_time = ls.get("ed_time");


        // ( sync () => {
        //     const userData = {
        //         email: this.state.email
        //     };

        //     if (this.state.user_type === "buyer") {
        //         axios
        //             .post("/api/buyers/find", userData)
        //             .then(res => {
        //                 console.log(res.data);
                    
        //                 this.state.name = res.data.name;
        //                 this.state.email = res.data.email;
        //                 this.state.password = res.data.password;
        //                 this.state.contact_no = res.data.contact_no;
        //                 this.state.age = res.data.age;
        //                 this.state.batch = res.data.batch;

        //             })
        //             .catch(err => {
        //                 console.log(err.response.data);
        //                 alert(err.response.data[Object.keys(err.response.data)[0]]);
        //             });
        //     }
        //     else if (this.state.user_type === "vendor") {
        //         axios
        //             .post("/api/vendors/find", userData)
        //             .then(res => {
        //                 console.log(res.data);

        //                 this.state.manager = res.data.manager;
        //                 this.state.shop = res.data.shop;
        //                 this.state.email = res.data.email;
        //                 this.state.password = res.data.password;
        //                 this.state.contact_no = res.data.contact_no;
        //                 this.state.op_time = res.data.op_time;
        //                 this.state.ed_time = res.data.ed_time;
        //             })
        //             .catch(err => {
        //                 console.log(err.response.data);
        //                 alert(err.response.data[Object.keys(err.response.data)[0]]);
        //             });
        //     }

        // })();
    }

    onChangeUser_type = e => {
        this.setState({
            user_type: e.target.value
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

    onChangeMoney = e => {
        this.setState({
            money: e.target.value
        });
    };

    addMoney = e => {
        this.setState({
            money: this.state.money + 10
        });
    };

    badMoney = e => {
        this.setState({
            money: this.state.money - 10
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
            batch: this.state.batch,
            money: this.state.money
        };

        console.log(newBuyer);

        axios.post("/api/buyers/update", newBuyer)
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

                alert("Buyer Updated Successfully");
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);
            });
    };

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

        axios.post("/api/vendors/update", newVendor)
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
                
                alert("Vendor Updated Successfully");
                window.location.reload();
            })
            .catch(err => {
                console.log(err.response.data);
                alert(err.response.data[Object.keys(err.response.data)[0]]);
            });
        
    };

     
    render = () => {

        // const { errors } = this.state;
        // const { user_type } = this.state;
        
        if (this.state.user_type === "buyer") {
            return (
                
                <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                    <Typography component="h1" variant="h3">
                        Buyer Profile
                    </Typography>

                    <FormControl onSubmit={this.onSubmit_buyer} sx={{ m: 5, minWidth: 120 }}>

                        <div>
                            <TextField id="name" label="Name" type="text" variant="outlined" placeholder={this.state.name} value={this.state.name} onChange={this.onChangeName} sx={{ mt: 3 }} />
                        </div>
                        
                        <div>
                            <TextField id="email" label="Email" type="email" variant="outlined" placeholder={this.state.email} value={this.state.email} onChange={this.onChangeEmail} sx={{ mt: 3 }} disabled />
                        </div>

                        <div>
                            <TextField id="password" label="Password" type="password" variant="outlined" placeholder={this.state.password} value={this.state.password} onChange={this.onChangePassword} sx={{ mt: 3 }} disabled />
                        </div>

                        <div>
                            <TextField id="contact_no" label="Contact No." type="number" variant="outlined" placeholder={this.state.contact_no} value={this.state.contact_no} onChange={this.onChangeContact_no} sx={{ mt: 3 }} />
                        </div>

                        <div>
                            <TextField id="age" label="Age" type="number" variant="outlined" placeholder={this.state.age} value={this.state.age} onChange={this.onChangeAge} sx={{ mt: 3 }} />
                        </div>

                        <div>
                            <TextField id="batch" label="Batch" type="text" variant="outlined" placeholder={this.state.batch} value={this.state.batch} onChange={this.onChangeBatch} sx={{ mt: 3 }} />
                        </div>

                        <div>
                            <TextField id="money" label="Money" type="number" variant="outlined" placeholder={this.state.money} value={this.state.money} onChange={this.onChangeMoney} sx={{ mt: 3, width: "50%" }} disabled />
                            
                            <IconButton aria-label="add-money" onClick={this.addMoney} sx={{ mt: 3, ml: 3 }}>
                                <AddBoxIcon> Filled </AddBoxIcon>
                            </IconButton>
                            
                            <IconButton aria-label="bad-money" onClick={this.badMoney} sx={{ mt: 3, ml: 3 }}>
                                <IndeterminateCheckBoxIcon> Filled </IndeterminateCheckBoxIcon>
                            </IconButton>
                        </div>
                        

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.onSubmit_buyer}
                        >
                            Update
                        </Button>

                    </FormControl>
                </Box>

            );
        }
        else if (this.state.user_type === "vendor") {
            return (
                
                <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                    <Typography component="h1" variant="h3">
                        Vendor Profile
                    </Typography>

                    <FormControl onSubmit={this.onSubmit_vendor} sx={{ m: 5, minWidth: 120 }}>

                        <div>
                            <TextField id="manager" label="Manager" type="text" variant="outlined" placeholder={this.state.manager} value={this.state.manager} onChange={this.onChangeManager} sx={{ mt: 3 }} />
                        </div>

                        <div>
                            <TextField id="Shop" label="Shop" type="text" variant="outlined" placeholder={this.state.shop} value={this.state.shop} onChange={this.onChangeShop} sx={{ mt: 3 }} />
                        </div>
                        
                        <div>
                            <TextField id="email" label="Email" type="email" variant="outlined" placeholder={this.state.email} value={this.state.email} onChange={this.onChangeEmail} sx={{ mt: 3 }} disabled />
                        </div>

                        <div>
                            <TextField id="password" label="Password" type="password" variant="outlined" placeholder={this.state.password} value={this.state.password} onChange={this.onChangePassword} sx={{ mt: 3 }} disabled />
                        </div>

                        <div>
                            <TextField id="contact_no" label="Contact No." type="number" variant="outlined" placeholder={this.state.contact_no}  value={this.state.contact_no} onChange={this.onChangeContact_no} sx={{ mt: 3 }} />
                        </div>

                        <div>
                            <Typography component="h3" variant="h6" sx={{ mt: 3 }} >
                                Opening Time:
                            </Typography>

                            <TextField id="op_time" type="time" variant="outlined" placeholder={ this.state.op_time } value={this.state.op_time} onChange={this.onChangeOp_time} sx={{ mt: 0 }} required />
                        </div>

                        <div>
                            <Typography component="h3" variant="h6" sx={{ mt: 3 }} >
                                Closing Time:
                            </Typography>

                            <TextField id="ed_time" type="time" variant="outlined" placeholer={ this.state.ed_time } value={this.state.ed_time} onChange={this.onChangeEd_time} sx={{ mt: 0 }} required />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.onSubmit_vendor}
                        >
                            Update
                        </Button>

                    </FormControl>
                </Box>

            );
        }

        return (

            <Box container sx={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff9c4' }}>

                <Typography component="h1" variant="h3">
                    Profile
                </Typography>
                
            </Box>

        );
    };
}

export default Profile;


