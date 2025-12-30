import { NavLink, useNavigate } from "react-router-dom";
import "./Signup.css"
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage(){
  useEffect(() => {
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  const navigate = useNavigate();
    interface formProps{
        username:string;
        email:string;
        password:string;
    }
    const [form,setForm] = useState<formProps>({
        username:'',
        email:'',
        password:''
    });
    const [confirmPassword,setConfirmPassword]= useState<string>('')
    async function handleForm(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        if(form.password !== confirmPassword){
            alert("Passwords Don't Match. Try Again ! ")
            return;
        }
          const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        username: form.username, 
      },
    },
  });

  if (error) {
    alert(error.message);
  } else {
    console.log("Signed up:", data.user);
    alert("Signup successful! Please check your email to confirm.");
    navigate("/");
  }

    }
    return (
        <section className="signup-container">
        <form action="" onSubmit={(e)=>handleForm(e)}>
            <section className="signup-wrapper">
                <h1 style={{textAlign:"center",width:"100%", padding:"1rem"}}>Sign Up</h1>
                <label className="login-labels" htmlFor="username">Username:</label>
                <input
                value={form.username}
                onChange={(e)=>{setForm((prev)=>{return {...prev, username:e.target.value}})}} 
                className="login-inputs" id="username" type="text" required/>
                <label className="login-labels"  htmlFor="userEmail">Email:</label>
                <input
                value={form.email}
                onChange={(e)=>{setForm((prev)=>{return {...prev, email:e.target.value}})}}  
                className="login-inputs" id="userEmail" type="email" required/>
                <label className="login-labels" htmlFor="userPassword">Password</label>
                <input
                value={form.password}
                onChange={(e)=>{setForm((prev)=>{return {...prev, password:e.target.value}})}} 
                className="login-inputs" id="userPassword" type="password" required/>
                <label className="login-labels" htmlFor="confirmUserPassword">Confirm Password</label>
                <input 
                value={confirmPassword}
                onChange={(e)=>{setConfirmPassword(e.target.value)}} 
                className="login-inputs" type="password" required
                id="confirmUserPassword" />
                <button type="submit" className="submit-button">Sign Up</button>
                <p style={{textAlign:"center", width:"100%"}}>or</p>
                <NavLink className="login" to={"/login"}>Login</NavLink>
            </section>
        </form>
        </section >
    );
}