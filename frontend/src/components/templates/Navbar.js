import React from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { listSubheaderClasses } from "@mui/material";

import ls from "local-storage";

const Navbar = () => {
  const navigate = useNavigate();
  
  const Logout = e => {
    e.preventDefault();

    ls.set("login", "false");
    ls.set("user_type", "");
    ls.set("username", "");

    ls.set("name", "");
    ls.set("email", "");
    ls.set("password", "");
    ls.set("contact_no", 0);
    ls.set("age", 0);
    ls.set("batch", "");

    ls.set("manager", "");
    ls.set("shop", "");
    ls.set("op_time", "");
    ls.set("ed_time", "");
    
		window.location = "/";
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Canteen Portal
          </Typography>

          {//! TODO: https://github.com/KanishAnand/Bulk-Purchase-WebApp/blob/2f49585bd820c2ee111e9f1d2302bc11524cd833/frontend/src/components/layout/Navbar.js#L107 
          }

          {/* {ls.get("login") === "true" && ls.get("user_type") === "buyer" ? (

          ) : null} */}

          <Box sx={{ flexGrow: 1 }} />

          {ls.get("login") === "true" ? null : (
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          )}

          {ls.get("login") === "true" ? null : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}

          {/* <Button color="inherit" onClick={() => navigate("/users")}>
            Users
          </Button> */}

          {ls.get("login") === "true" && ls.get("user_type") === "buyer" ? (
            <Button color="inherit" onClick={() => navigate("/products_list")}>
              Products List
            </Button>
          ) : null}

          {ls.get("login") === "true" && ls.get("user_type") === "buyer" ? (
            <Button color="inherit" onClick={() => navigate("/buyer_orders")}>
              Orders
            </Button>
          ) : null}

          {ls.get("login") === "true" && ls.get("user_type") === "vendor" ? (
            <Button color="inherit" onClick={() => navigate("/add_product")}>
              Add Product
            </Button>
          ) : null}

          {ls.get("login") === "true" && ls.get("user_type") === "vendor" ? (
            <Button color="inherit" onClick={() => navigate("/vendor_products")}>
              Products
            </Button>
          ) : null}

          {ls.get("login") === "true" && ls.get("user_type") === "vendor" ? (
            <Button color="inherit" onClick={() => navigate("/vendor_orders")}>
              Orders
            </Button>
          ) : null}

          {ls.get("login") === "true" ? (
            <Button color="inherit" onClick={() => navigate("/profile")}>
              My Profile
            </Button>
          ) : null}

          {ls.get("login") === "true" ? (
            <Button color="inherit" onClick={Logout}>
              Logout
            </Button>
          ) : null}

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
