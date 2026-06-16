import {useState,useRef,useEffect} from "react";
import axios from "axios";
import {ToastContainer,toast} from "react-toastify";

function Enquiry()
{
const rName=useRef();
const rPhone=useRef();
const rQuery=useRef();

const [name,setName]=useState("");
const [phone,setPhone]=useState("");
const [query,setQuery]=useState("");
const [msg,setMsg]=useState("");

const hName=(event)=>{setName(event.target.value);}
const hPhone=(event)=>{setPhone(event.target.value);}
const hQuery=(event)=>{setQuery(event.target.value);}


const save=(event)=>{
event.preventDefault();

if(name==="")
{
toast.error("Name should not be empty",{autoClose:1000});
setMsg("");
rName.current.focus();
return;
}

if(phone==="")
{
toast.error("Phone should not be empty",{autoClose:1000});
setMsg("");
rPhone.current.focus();
return;
}

if(phone.length!==10)
{
toast.error("Invalid Phone number",{autoClose:1000});
setMsg("");
rPhone.current.focus();
return;
}

if(query==="")
{
toast.error("Query should not be empty",{autoClose:1000});
setMsg("");
rQuery.current.focus();
return;
}

let data={name,phone,query};
let url="http://localhost:3000/save";
axios.post(url,data)
.then(res=>{
if(res.status===200)
{
setMsg("We\'ve received your query.We will soon reach out to You");
setName("");
setPhone("");
setQuery("");
rName.current.focus();
setTimeout(()=>{
setMsg("");},3000
);
}
})
.catch(err=>{
setMsg("issue :"+err);
});
}

return(
<>
<h1>Send Your Query</h1>
<br/>
<ToastContainer/>
 <form onSubmit={save}>
 <input type="text" placeholder="Enter Your Name"
 ref={rName}  onChange={hName}  value={name} />
 <br/><br/>
 <input type="number" placeholder="Enter Your Phone"
 ref={rPhone}  onChange={hPhone}  value={phone} />
 <br/><br/>
 <textarea placeholder="Enter Query" rows={4} cols={25}
 ref={rQuery}  onChange={hQuery}  value={query} ></textarea>
 <br/><br/>
 <input type="submit" class="btn"/>
 <br/>
 </form>
<h2>{msg}</h2>
</>
);
}
export default Enquiry;