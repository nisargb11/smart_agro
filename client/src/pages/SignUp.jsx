import {useState,useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
function SignUp()
{
const nav=useNavigate();

const [username,setUsername]=useState("");
const [email,setEmail]=useState("");
const [city,setCity]=useState("");
const [password,setPassword]=useState("");
const [msg,setMsg]=useState("");

const hUsername=(event)=>{setUsername(event.target.value);}
const hEmail=(event)=>{setEmail(event.target.value);}
const hCity=(event)=>{setCity(event.target.value);}
const hPassword=(event)=>{setPassword(event.target.value);}

const save=(event)=>{
event.preventDefault();

if (!username || !email || !city || !password) {
    setMsg("All fields are required");
    return;
  }

  const url = "http://localhost:3000/api/auth/signup";
  const data = { username, email, city, password };

  console.log("Sending signup:", data); 

  axios.post(url, data)
    .then(res => {
      setMsg("Registered Successfully");
      setTimeout(() => nav("/lo"), 2000);
    })
    .catch(err => {
        console.log("ERROR:", err.response || err);
        setMsg(err.response?.data?.error || err.message);
    });
};
return(
<div className="auth-container">
    <div className="auth-card">
<h1 className="auth-title">SignUp page</h1>
<form className="auth-form"  onSubmit={save}>
    <label className="auth-label">Username</label>
<input type="text" className="auth-input" placeholder="Enter Username"
 onChange={hUsername}  value={username}/>
<label className="auth-label">Email</label>
<input type="email" className="auth-input" placeholder="Enter Email"
  onChange={hEmail}  value={email}/><label className="auth-label">Location</label>
<input type="text" className="auth-input" placeholder="Enter Your Location"
  onChange={hCity}  value={city}/>
<label className="auth-label">Password</label>
<input type="password" className="auth-input" placeholder="Enter Password"
  onChange={hPassword}  value={password}/>
<input type="submit" className="auth-button"/>
</form>
<h2 className={`auth-message ${msg.includes("Successfully") ? "success" : "error"}`}>{msg}</h2>
<p className="auth-link">
    Already have an account?<span onClick={()=>nav("/lo")}>Login</span>
</p>
</div>
</div>
);
}
export default SignUp;