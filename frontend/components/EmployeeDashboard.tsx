"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, UserPlus, Users, CreditCard } from "lucide-react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

type Employee = {
  id?: number;
  ID?: number;
  name: string;
  email: string;
  bank_account: string;
  ifsc_code: string;
  salary: number;
  payment_made: boolean;
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bank_account: "",
    ifsc_code: "",
    salary: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      const normalizedEmployees = res.data.map((emp: any) => ({
        ...emp,
        id: emp.id || emp.ID,
      }));
      setEmployees(normalizedEmployees);
    } catch (err) {
      alert("Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", bank_account: "", ifsc_code: "", salary: "" });
    setEditingId(null);
  };

  const addEmployee = async () => {
    if (!form.name || !form.email || !form.bank_account || !form.ifsc_code || !form.salary) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/employee", {
        ...form,
        salary: parseInt(form.salary)
      });
      await fetchEmployees();
      resetForm();
      alert("Employee added successfully!");
    } catch {
      alert("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this employee?")) return;
    setLoading(true);
    try {
      await api.delete(`/employee/${id}`);
      await fetchEmployees();
      alert("Employee deleted successfully!");
    } catch {
      alert("Failed to delete employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = (employee: Employee) => {
    const employeeId = employee.id || employee.ID;
    if (!employeeId) return;
    setForm({
      name: employee.name,
      email: employee.email,
      bank_account: employee.bank_account,
      ifsc_code: employee.ifsc_code,
      salary: employee.salary.toString()
    });
    setEditingId(employeeId);
  };

  const updateEmployee = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await api.put(`/employee/${editingId}`, {
        ...form,
        salary: parseInt(form.salary)
      });
      await fetchEmployees();
      resetForm();
      alert("Employee updated successfully!");
    } catch {
      alert("Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paySalary = async (id: number | undefined) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.post("/employee/pay", { employee_id: id });
      alert(`Payment initiated successfully!\nOrder ID: ${res.data.order_id}\nAmount: ₹${res.data.amount}\nCurrency: ${res.data.currency}`);
      await fetchEmployees();
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatFieldName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Employee Management System</h1>
          </div>
          <p className="text-gray-600">Manage employees and process salary payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Employees</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.payment_made).length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-600">
                  {employees.filter(emp => !emp.payment_made).length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Add/Edit Employee Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Employee" : "Add New Employee"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {formatFieldName(key)}
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type={key === "salary" ? "number" : key === "email" ? "email" : "text"}
                  name={key}
                  placeholder={`Enter ${formatFieldName(key).toLowerCase()}`}
                  value={form[key]}
                  onChange={handleInput}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={editingId ? updateEmployee : addEmployee}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Processing..." : editingId ? "Update Employee" : "Add Employee"}
            </Button>
            
            {editingId && (
              <Button 
                onClick={resetForm}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IFSC Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Loading employees...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No employees found. Add your first employee above.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={`emp-${emp.id}-${emp.email}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emp.id || emp.ID || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.bank_account}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.ifsc_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{emp.salary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          emp.payment_made 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {emp.payment_made ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          onClick={() => paySalary(emp.id || emp.ID)}
                          disabled={emp.payment_made || loading}
                          size="sm"
                          className={emp.payment_made ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                        >
                          {emp.payment_made ? "Paid" : "Pay Salary"}
                        </Button>
                        
                        <Button
                          onClick={() => editEmployee(emp)}
                          disabled={loading}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => deleteEmployee(emp.id || emp.ID)}
                          disabled={loading}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
