# 📄 Salary Management System – Backend

A backend service built in **Go (Golang)** for managing employee salaries with support for Razorpay payment processing and secure employee banking details.

---

## 🚀 Features

- Add and manage employees
- Save employee bank details (Account No. and IFSC)
- Assign salary and track payment status
- Razorpay order creation for salary disbursement
- SQL database support via GORM
- CORS support for frontend integration

---

## 🛠️ Tech Stack

- **Language**: Golang
- **Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL (via Neon or any SQL)
- **Payment Gateway**: Razorpay
- **Environment Management**: godotenv

---

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shinjan-saha/Salary-Management-System.git
   cd salary-management-system
   ```

2. **Install dependencies**:
   ```bash
   go mod tidy
   ```

3. **Set up `.env` file**:
   Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgres://username:password@your-neon-host/dbname
   ```

4. **Run the application**:
   ```bash
   go run main.go
   ```

   Server runs at: `http://localhost:8080`

---

## 📚 API Documentation

### ➕ Add New Employee

- **Endpoint:** `POST /employee`
- **Request Body:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "bank_account": "1234567890",
    "ifsc_code": "SBIN0000123",
    "salary": 50000
  }
  ```
- **Response:**
  ```json
  {
    "ID": 1,
    "CreatedAt": "2025-05-25T07:23:46.357228675Z",
    "UpdatedAt": "2025-05-25T07:23:46.357228675Z",
    "DeletedAt": null,
    "name": "Alice",
    "email": "alice@example.com",
    "bank_account": "1234567890",
    "ifsc_code": "SBIN0001234",
    "salary": 50000,
    "payment_made": false
  }
  ```

---

### 📄 Get All Employees

- **Endpoint:** `GET /employees`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "bank_account": "1234567890",
      "ifsc_code": "SBIN0000123",
      "salary": 50000,
      "payment_made": false
    }
  ]
  ```

---

### 💰 Create Razorpay Salary Payment Order

- **Endpoint:** `POST /employee/pay`
- **Request Body:**
  ```json
  {
    "employee_id": 1
  }
  ```
- **Response:**
  ```json
  {
    "order_id": "order_xyz123",
    "amount": 50000,
    "currency": "INR"
  }
  ```
---

  ### 📄 DELETE Employees

- **Endpoint:** `DELETE /employee/:id`
- **Response:**
  ```json
  
    {
     "message": "Employee deleted  successfully"
    }
  
  ```

---





---




## Import these JSON File in POSTMAN & Test Them:-

[![Run in Postman](https://run.pstmn.io/button.svg)](./Salary%20Management%20System%20.postman_collection.json)
