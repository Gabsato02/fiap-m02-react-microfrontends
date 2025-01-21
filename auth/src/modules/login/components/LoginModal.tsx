import React from "react";
import { useForm } from "react-hook-form";
import { navigateToUrl } from "single-spa";
import loginImage from "../assets/login-desktop.svg";
import loginImageMobile from "../assets/login-mobile.svg";
import { login } from "../services";
import { Button } from "../../../components";
import { UserAuth } from "../../../types";
import { closeModal } from "../../../utils";
import { AUTH_TOKEN } from "../../../vars";

export default function LoginModal() {
  const [loading, setLoading] = React.useState(false);
  const [hasError, setError] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const handleLogin = async (payload: UserAuth) => {
    setLoading(true);

    try {
      const data = await login(payload);

      if (data.token) {
        localStorage.setItem(AUTH_TOKEN, data.token);
      }

      closeModal("loginModal");
      navigateToUrl("/dashboard");
    } catch (err) {
      console.error("Error logging in user", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex={-1}
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <img
              src={loginImage}
              className="img-fluid mx-auto d-none d-md-block"
              alt="Login desktop"
            />
            <img
              src={loginImageMobile}
              className="d-block mx-auto d-md-none img-fluid"
              alt="Login mobile"
            />
            <form
              className="mt-3"
              noValidate
              onSubmit={handleSubmit(handleLogin)}
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Digite seu e-mail"
                  required
                  {...register("email", { required: true })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-control ${hasError ? "is-invalid" : ""}`}
                    id="password"
                    placeholder="Digite sua senha"
                    required
                    {...register("password", { required: true })}
                  />
                  {hasError && (
                    <div className="invalid-feedback">
                      Credenciais inválidas
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 text-end">
                <a
                  href="/recuperar-senha"
                  className="text-decoration-none text-danger"
                >
                  <small>Esqueci minha senha</small>
                </a>
              </div>
              <Button
                label="Acessar"
                type="submit"
                variant="success"
                className="w-100"
                disabled={!isValid}
                isLoading={loading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
