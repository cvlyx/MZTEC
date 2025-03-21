const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const BASE_URL = "https://api-m.sandbox.paypal.com"; // Use "https://api-m.paypal.com" for production

// Create PayPal Order
app.post("/create-payment", async (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    try {
        const response = await axios.post(
            `${BASE_URL}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [{ amount: { currency_code: "USD", value: amount } }]
            },
            {
                auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Capture PayPal Payment
app.post("/capture-payment/:orderID", async (req, res) => {
    const { orderID } = req.params;
    try {
        const response = await axios.post(
            `${BASE_URL}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
