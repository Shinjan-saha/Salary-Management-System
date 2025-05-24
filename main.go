package main

import (
	"salary-management/config"
	"salary-management/models"
	"salary-management/routes"
)

func main() {
	config.ConnectDB()
    config.DB.AutoMigrate(&models.Employee{})

	r := routes.SetupRouter()
	r.Run(":8080")
}
