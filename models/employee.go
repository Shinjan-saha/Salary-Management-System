package models

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	Name         string  `json:"name"`
	Email        string  `json:"email" gorm:"unique"`
	BankAccount  string  `json:"bank_account"`
	IFSCCode     string  `json:"ifsc_code"`
	Salary       float64 `json:"salary"`
	PaymentMade  bool    `json:"payment_made"`
}
