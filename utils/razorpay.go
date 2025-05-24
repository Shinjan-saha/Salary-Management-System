package utils

import (
	"github.com/razorpay/razorpay-go"
)

var razorpayClient = razorpay.NewClient("YOUR_KEY_ID", "YOUR_SECRET")

func CreateRazorpayOrder(amount float64, email string) (string, error) {
	data := map[string]interface{}{
		"amount":          int(amount * 100), 
		"currency":        "INR",
		"receipt":         "receipt#1",
		"payment_capture": 1,
		"notes": map[string]interface{}{
			"email": email,
		},
	}

	headers := map[string]string{} 

	body, err := razorpayClient.Order.Create(data, headers)
	if err != nil {
		return "", err
	}

	orderID := body["id"].(string)
	return "https://checkout.razorpay.com/v1/checkout.js?order_id=" + orderID, nil
}
