"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import EmployeeDashboard from "@/components/EmployeeDashboard";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);

  
  useEffect(() => {
    const saved = sessionStorage.getItem("loggedIn");
    if (saved === "true") setLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    sessionStorage.setItem("loggedIn", "true"); 
  };

  return (
    <>
      {!loggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EmployeeDashboard />
      )}
    </>
  );
}
