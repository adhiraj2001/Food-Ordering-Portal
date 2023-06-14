import React, { useState, useEffect } from "react";
import ls from "local-storage";


const Home = (props) => {
  const [name, setName] = useState("");
  const [user_type, setUser_type] = useState("");

  useEffect(() => {
    
    setName(ls.get("username"));
    setUser_type(ls.get("user_type"));

  }, []);

  if(ls.get("login") === "true") {
    return <div style={{ textAlign: "center" }}> <h2> Welcome {user_type} - {name} </h2> </div>;
  }
  else {
    return <div style={{ textAlign: "center" }}> <h2> Please Login or Register New Account </h2> </div>;
  }
};

export default Home;
