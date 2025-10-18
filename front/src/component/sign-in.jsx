import Input from "./input";
import { useFormik } from "formik";
import Joi from "joi";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
function Signin() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const { user, login } = useAuth();
  const [success, setSuccess] = useState(false);
  const { getFieldProps, handleSubmit, handleReset, touched, errors, isValid } =
    useFormik({
      validateOnMount: true,
      initialValues: { email: "", password: "" },
      validate: (values) => {
        const userSchema = Joi.object({
          email: Joi.string().min(2).max(256).required().email({ tlds: false }),
          password: Joi.string()
            .pattern(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{7,}$/
            )
            .required(),
        });
        const { error } = userSchema.validate(values, { abortEarly: false });
        if (!error) {
          return null;
        }
        const errors = {};
        for (const detail of error.details) {
          errors[detail.path[0]] = detail.message;
        }
        return errors;
      },
      onSubmit: async (values) => {
        try {
          await login(values);
          navigate("/events");
        } catch (err) {
          if (err.response?.status === 400) {
            setIsRegistered(true);
          }
        }
      },
    });
  return (
    <div
      className="card register-card p-4"
      style={{ maxWidth: "420px", margin: "20px auto" }}
    >
      <h1 className="h4 text-center mb-3">התחברות</h1>
      {success && (
        <div className="alert alert-info" role="alert">
          User successfully logged in
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="mb-3">
          <Input
            {...getFieldProps("email")}
            error={
              isRegistered
                ? "Please enter a valid email"
                : touched.email
                ? errors.email
                : ""
            }
            type="email"
            label="email"
            placeholder="email"
            required
          />
        </div>

        <div className="mb-3">
          <Input
            {...getFieldProps("password")}
            error={
              isRegistered
                ? "Please enter a valid password"
                : touched.password
                ? errors.password
                : ""
            }
            type="password"
            label="password"
            placeholder="password"
            required
          />
        </div>

        <button
          className="btn w-100"
          disabled={!isValid}
          type="submit"
          style={{
            backgroundColor: "#A0522D",
            color: "white",
            fontSize: "bold",
          }}
        >
          כניסה
        </button>
      </form>
    </div>
  );
}

export default Signin;
