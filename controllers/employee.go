package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"salary-management/config"
	"salary-management/models"
	"salary-management/utils"
)

func AddEmployee(c *gin.Context) {
	var emp models.Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&emp)
	c.JSON(http.StatusOK, emp)
}

func GetEmployees(c *gin.Context) {
	var employees []models.Employee
	config.DB.Find(&employees)
	c.JSON(http.StatusOK, employees)
}

func MakePayment(c *gin.Context) {
	var input struct {
		ID uint `json:"id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var emp models.Employee
	if err := config.DB.First(&emp, input.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	
	paymentURL, err := utils.CreateRazorpayOrder(emp.Salary, emp.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment failed"})
		return
	}

	emp.PaymentMade = true
	config.DB.Save(&emp)

	c.JSON(http.StatusOK, gin.H{"payment_url": paymentURL})
}


func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")

	var emp models.Employee
	if err := config.DB.First(&emp, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	if err := config.DB.Delete(&emp).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}
