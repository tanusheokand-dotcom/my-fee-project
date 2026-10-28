import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import FormField from "../components/FormField";
import DemoNotice from "../components/DemoNotice";
import { useAuth } from "../context/AuthContext";
import { DEMO_USER } from "../data/demoUser";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  if (user) return <Navigate to={from} replace />;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) return;

    const result = login(form);
    if (!result.ok) setSubmitError(result.error);
    // On success, `user` updates and the <Navigate> above redirects.
  };

  const fillDemo = () => {
    setForm({ email: DEMO_USER.email, password: DEMO_USER.password });
    setErrors({});
    setSubmitError("");
  };

  return (
    <div className="container page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="muted">Log in to read, write and manage your articles.</p>

        {location.state?.from && (
          <div className="alert info" role="status">Please log in to continue.</div>
        )}
        {submitError && <div className="alert error" role="alert">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              aria-invalid={!!errors.email}
            />
          </FormField>

          <FormField id="password" label="Password" error={errors.password}>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update("password")}
              aria-invalid={!!errors.password}
            />
          </FormField>

          <button className="btn btn-primary full" type="submit">Log in</button>
        </form>

        <button type="button" className="btn btn-ghost full" onClick={fillDemo}>
          Use demo account
        </button>

        <p className="muted center-text">
          New here? <Link to="/signup" className="text-link">Create an account</Link>
        </p>

        <DemoNotice />
      </div>
    </div>
  );
}