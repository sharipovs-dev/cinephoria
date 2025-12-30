import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
export default function LoginPage() {
  useEffect(() => {
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  const navigate = useNavigate();
  interface formProps {
    email: string;
    password: string;
  }
  const [form, setForm] = useState<formProps>({
    email: "",
    password: "",
  });
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      alert(error.message);
    } else {
      console.log("Logged in:", data.user);
      navigate("/");
    }
  }
  return (
    <section className="login-container">
      <form
        action=""
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <section className="login-wrapper">
          <h1 style={{ textAlign: "center", width: "100%", padding: "1rem" }}>
            Login
          </h1>
          <label className="login-labels" htmlFor="userEmail">
            Email:
          </label>
          <input
            value={form.email}
            onChange={(e) => {
              setForm((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            className="login-inputs"
            id="userEmail"
            type="email"
            required
          />
          <label className="login-labels" htmlFor="userPassword">
            Password
          </label>
          <input
            id="userPassword"
            value={form.password}
            onChange={(e) => {
              setForm((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
            className="login-inputs"
            type="password"
            required
          />
          <button type="submit" className="submit-button">
            Login
          </button>
          <p style={{ textAlign: "center", width: "100%" }}>or</p>
          <NavLink className="login" to={"/signup"}>
            Sign Up
          </NavLink>
        </section>
      </form>
    </section>
  );
}
