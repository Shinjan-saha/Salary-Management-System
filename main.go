package main

import (
	"salary-management/config"
	"salary-management/models"
	"salary-management/routes"
)


func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") 
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}

func main() {

if os.Getenv("DATABASE_URL") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found (this is okay in production)")
		}
	}

	config.ConnectDB()
    config.DB.AutoMigrate(&models.Employee{})

	r.Use(CORSMiddleware())


	r := routes.SetupRouter()
	r.Run(":8080")
}
