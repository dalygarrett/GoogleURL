// webhook-handler.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/webhook-endpoint', (req, res) => {
  const webhookData = req.body;
  // Process the webhook data as needed
  handleWebhook(webhookData);
  res.sendStatus(200);
});

function handleWebhook(webhookData) {
  // Logic to handle the webhook data
  // You can also pass the data to social-widget.js or perform other actions
}

app.listen(port, () => {
  console.log(`Webhook handler is running at http://localhost:${port}`);
});
