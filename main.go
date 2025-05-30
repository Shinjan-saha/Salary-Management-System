package mainAdd commentMore actions

import (
	"salary-management/config"
	"salary-management/models"
	"salary-management/routes"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
)


func CORSMiddleware() gin.HandlerFunc {Add commentMore actions
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

	r := gin.Default()
	r.Use(CORSMiddleware())

	routes.SetupRoutes(r)

	r.Run(":8080")
}
