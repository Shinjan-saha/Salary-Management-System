package routes

import (
	"github.com/gin-gonic/gin"
	"salary-management/controllers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/employee", controllers.AddEmployee)
	r.GET("/employees", controllers.GetEmployees)
	r.POST("/employee/pay", controllers.MakePayment)

	return r
}
