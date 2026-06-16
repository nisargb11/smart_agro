import {useState,useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
function Login()
{
const nav=useNavigate();

const [username,setUsername]=useState("");
const [password,setPassword]=useState("");
const [msg,setMsg]=useState("");
const [msgType,setMsgType]=useState("")

const hUsername=(event)=>{setUsername(event.target.value);}
const hPassword=(event)=>{setPassword(event.target.value);}

const save=(event)=>{
event.preventDefault();

const url="http://localhost:3000/api/auth/login";
const data={username,password};
axios.post(url, data)
  .then(res => {
    setMsg(res.data.message);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      setTimeout(() => nav("/index"), 1500);
    }
  })
  .catch(err => {
    if (err.response) {
      setMsg("Error: " + err.response.data.message);
    } else {
      setMsg("Issue: " + err.message);
    }
  });
}
return(
<div className="auth-container">
    <div className="auth-card">
<h1 className="auth-title">Login page</h1>
<form className="auth-form" onSubmit={save}>
<label className="auth-label">Username</label>
<input type="text" className="auth-input" placeholder="Enter Username"  onChange={hUsername}  value={username}/>
<label className="auth-label">Passwords</label>
<input type="password" className="auth-input" placeholder="Enter Password"
 onChange={hPassword}  value={password}/>
<input type="submit" className="auth-button"/>
</form>
<h2 className={`auth-message ${msgType}`}>{msg}</h2>
<p className="auth-link">
          Don’t have an account?{" "}
          <span onClick={() => nav("/su")}>Sign Up</span>
        </p>
</div>
</div>
);
}
export default Login;