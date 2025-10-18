import Joi from "joi";
import { useFormik } from "formik";
import Input from "./input";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [isRegistered, setIsRegistered] = useState(false);
  const { createUser, user, login } = useAuth();
  const [success, setSuccess] = useState(false);
  const { getFieldProps, handleSubmit, handleReset, touched, errors, isValid } =
    useFormik({
      validateOnMount: true,
      initialValues: {
        name: {
          firstName: "",
          lastName: "",
        },
        phone: "",
        email: "",
        password: "",
        city: "",
        isAdmin: false,
      },
      validate: (values) => {
        const userSchema = Joi.object({
          name: Joi.object({
            firstName: Joi.string().min(2).max(256).required(),
            lastName: Joi.string().min(2).max(256).required(),
          }).required(),
          email: Joi.string().min(2).max(256).required().email({ tlds: false }),
          password: Joi.string()
            .pattern(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{7,}$/
            )
            .required(),
          phone: Joi.string().min(7).max(10).required(),
          city: Joi.string().min(2).max(256).required(),
          isAdmin: Joi.boolean(),
        });
        const { error } = userSchema.validate(values, { abortEarly: false });
        if (!error) {
          return null;
        }
        const errors = {};
        for (const detail of error.details) {
          let current = errors;
          for (let i = 0; i < detail.path.length; i++) {
            const key = detail.path[i];
            if (!current[key]) current[key] = {};
            if (i + 1 === detail.path.length) current[key] = detail.message;
            else current = current[key];
          }
        }
        return errors;
      },

      onSubmit: async (values) => {
        try {
          await createUser({
            ...values,
          });
          console.log(values.name.firstName);
          await login({ email: values.email, password: values.password });
          setSuccess(true);
          setTimeout(() => {
            navigate("/events");
          }, 1500);
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
      <h1 className="h4 text-center mb-3">הרשמה לאתר</h1>
      {success && (
        <div className="alert alert-info" role="alert">
          User successfully created
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="mb-3">
          <Input
            {...getFieldProps("name.firstName")}
            error={touched?.name?.firstName ? errors?.name?.firstName : ""}
            type="text"
            label="First name"
            placeholder="first name"
            required
          />
        </div>

        <div className="mb-3">
          <Input
            {...getFieldProps("name.lastName")}
            error={touched?.name?.lastName ? errors?.name?.lastName : ""}
            type="text"
            label="Last name"
            placeholder="last name"
            required
          />
        </div>
        <div className="mb-3">
          <Input
            {...getFieldProps("email")}
            error={
              isRegistered
                ? "email already exist"
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
            error={touched.password ? errors.password : ""}
            type="text"
            label="password"
            placeholder="password"
            required
          />
        </div>
        <div className="mb-3">
          <Input
            {...getFieldProps("phone")}
            error={touched.phone ? errors.phone : ""}
            type="text"
            label="phone"
            placeholder="phone"
            required
          />
        </div>
        <div className="mb-3">
          <Input
            {...getFieldProps("city")}
            error={touched.city ? errors.city : ""}
            type="text"
            label="city"
            placeholder="city"
            required
          />
        </div>
        <div className="form-check mb-3">
          <Input
            {...getFieldProps("isAdmin")}
            className="form-check-input"
            type="checkbox"
            label="isAdmin"
            name="isAdmin"
          />
        </div>
        <button
          className="btn w-100"
          type="submit"
          disabled={!isValid}
          style={{
            backgroundColor: "#A0522D",
            color: "white",
            fontSize: "bold",
          }}
        >
          הרשמה
        </button>
      </form>
    </div>
  );
}

export default Register;
