const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook-endpoint', async (req, res) => {
  const webhookResponse = req.body;

  // Extract relevant data
  const entityIds = webhookResponse.primaryProfile.c_socialPostingEntityID;
  const text = webhookResponse.primaryProfile.wp_postExcerpt.markdown;
  const photoUrls =
    webhookResponse.primaryProfile.photoGallery &&
    webhookResponse.primaryProfile.photoGallery.map((item) => item.image.sourceUrl);

  // Pass the data to social-widget.js
  console.log('Received webhook data:', { entityIds, text, photoUrls });

  // Additional processing if needed

  res.status(200).send('Webhook received successfully');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
