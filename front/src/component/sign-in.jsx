import Input from "./input";
import { useFormik } from "formik";
import Joi from "joi";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
function Signin() {
  return (
    <div
      className="card register-card p-4"
      style={{ maxWidth: "420px", margin: "20px auto" }}
    >
      <h1 className="h4 text-center mb-3">התחברות</h1>

      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            אימייל
          </label>
          <Input
            type="email"
            className="form-control"
            id="email"
            name="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            סיסמה
          </label>
          <Input
            type="password"
            className="form-control"
            id="password"
            name="password"
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          כניסה
        </button>
      </form>
    </div>
  );
}

export default Signin;
