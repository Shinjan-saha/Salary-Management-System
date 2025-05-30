"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Create an axios instance with base URL from env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
   withCredentials: true,
});

type Employee = {
  id: number;
  name: string;
  email: string;
  bank_account: string;
  ifsc_code: string;
  salary: number;
  payment_made: boolean;
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bank_account: "",
    ifsc_code: "",
    salary: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");  // Use api instance here
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = async () => {
    try {
      await api.post("/employee", { ...form, salary: parseInt(form.salary) });
      fetchEmployees();
      setForm({ name: "", email: "", bank_account: "", ifsc_code: "", salary: "" });
    } catch (err) {
      console.error("Failed to add employee", err);
    }
  };

  const paySalary = async (id: number) => {
    try {
      const res = await api.post("/employee/pay", { employee_id: id });
      alert(`Payment initiated. Order ID: ${res.data.order_id}`);
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
            <input
              key={key}
              className="border p-2 rounded"
              type={key === "salary" ? "number" : "text"}
              name={key}
              placeholder={key.replace("_", " ")}
              value={form[key]}
              onChange={handleInput}
            />
          ))}
        </div>
        <Button className="mt-4" onClick={addEmployee}>Add Employee</Button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">All Employees</h2>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Bank</th>
              <th className="border px-2 py-1">IFSC</th>
              <th className="border px-2 py-1">Salary</th>
              <th className="border px-2 py-1">Paid</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="border px-2 py-1">{emp.id}</td>
                <td className="border px-2 py-1">{emp.name}</td>
                <td className="border px-2 py-1">{emp.email}</td>
                <td className="border px-2 py-1">{emp.bank_account}</td>
                <td className="border px-2 py-1">{emp.ifsc_code}</td>
                <td className="border px-2 py-1">₹{emp.salary}</td>
                <td className="border px-2 py-1">{emp.payment_made ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">
                  <Button
                    onClick={() => paySalary(emp.id)}
                    disabled={emp.payment_made}
                  >
                    {emp.payment_made ? "Paid" : "Pay"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
