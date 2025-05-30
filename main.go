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
