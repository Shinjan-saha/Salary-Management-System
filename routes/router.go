// routes/router.go
package routes

import (
	"github.com/gin-gonic/gin"
	"salary-management/controllers"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/", func(c *gin.Context) {
		c.String(200, "✅ Hello! Get ready to manage your salary 💰")
	})

	r.POST("/employee", controllers.AddEmployee)
	r.GET("/employees", controllers.GetEmployees)
	r.POST("/employee/pay", controllers.MakePayment)
	r.DELETE("/employee/:id", controllers.DeleteEmployee)

}
