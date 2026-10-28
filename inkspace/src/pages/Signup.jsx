import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FormField from "../components/FormField";
import DemoNotice from "../components/DemoNotice";
import { useAuth } from "../context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { user, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    else if (!/\d/.test(form.password)) next.password = "Include at least one number.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) return;

    const result = signup(form);
    if (!result.ok) setSubmitError(result.error);
    // On success, `user` updates and the <Navigate> above redirects.
  };

  return (
    <div className="container page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="muted">Start reading and writing on InkSpace in under a minute.</p>

        {submitError && <div className="alert error" role="alert">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="name" label="Full name" error={errors.name}>
            <input id="name" autoComplete="name" value={form.name} onChange={update("name")} aria-invalid={!!errors.name} />
          </FormField>

          <FormField id="email" label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={update("email")} aria-invalid={!!errors.email} />
          </FormField>

          <FormField id="password" label="Password" error={errors.password} hint="At least 8 characters, including a number.">
            <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={update("password")} aria-invalid={!!errors.password} />
          </FormField>

          <FormField id="confirm" label="Confirm password" error={errors.confirm}>
            <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={update("confirm")} aria-invalid={!!errors.confirm} />
          </FormField>

          <button className="btn btn-primary full" type="submit">Sign up</button>
        </form>

        <p className="muted center-text">
          Already have an account? <Link to="/login" className="text-link">Log in</Link>
        </p>

        <DemoNotice />
      </div>
    </div>
  );
}