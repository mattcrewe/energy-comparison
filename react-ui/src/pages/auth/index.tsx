"use client";

import { useContext, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AuthContext } from "@/App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth == true) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  function login(username: string, password: string) {
    const requestBody = JSON.stringify({
      email: username,
      password: password,
    });

    fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.status == 200) {
          setAuth(true);
        }
      })
      .catch((error) => console.error("Error authenticating user:", error));
  }

  function register() {
    const requestBody = JSON.stringify({
      email: email,
      full_name: name,
      password: password,
    });

    fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    }).then((response) => {
      if (response.status == 200) {
        setAuth(true);
      }
    });
  }

  const handleSubmitButton = () => {
    if (isRegister) {
      register();
    } else {
      login(email, password);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Energy Comparison
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isRegister
              ? "Create a new account"
              : "Sign in to your account or create a new one"}
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label>Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className={/@/.test(email) ? "invalid" : ""}
            />
          </div>
          {isRegister && (
            <div className="flex flex-col gap-3">
              <Label>Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Label>Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              min={8}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button
              // type="submit"
              className="w-full"
              onClick={handleSubmitButton}
              disabled={
                isRegister
                  ? email === "" || password === "" || name === ""
                  : email === "" || password === ""
              }
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
