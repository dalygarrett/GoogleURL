// Assume this function is triggered when the widget is loaded
async function fetchWebhookData() {
  try {
    const response = await fetch('https://www.test-site.com/webhook-endpoint', {
      method: 'GET',
    });

    if (response.ok) {
      const webhookResponse = await response.json();
      handleWebhookResponse(webhookResponse);
    } else {
      console.error('Failed to fetch webhook data:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching webhook data:', error);
  }
}

// Assume this function is triggered when the webhook response is received
async function handleWebhookResponse(webhookResponse) {
  try {
    const eventData = JSON.parse(webhookResponse);

    if (
      eventData.meta.eventType === "ENTITY_CREATED" &&
      eventData.primaryProfile.meta.entityType === "wp_post"
    ) {
      // Extract relevant data from the webhook response
      const entityIds = eventData.primaryProfile.c_socialPostingEntityID;
      const rawText = eventData.primaryProfile.wp_postExcerpt.markdown;

      // Remove Markdown notation using regex
      const text = rawText.replace(/<\/?[^>]+(>|$)/g, "");

      // Check if the photoGallery is available
      const photoUrls =
        eventData.primaryProfile.photoGallery &&
        eventData.primaryProfile.photoGallery.map(
          (item) => item.image.sourceUrl
        );

      // Make the API call
      await makeApiCall(entityIds, text, photoUrls);
    }
  } catch (error) {
    console.error("Error handling webhook response:", error);
  }
}

async function makeApiCall(entityIds, text, photoUrls) {
  const apiKey = "[API_KEY]";
  const apiUrl = "https://api.yextapis.com/v2/accounts/me/posts?v=20240127";

  const requestBody = {
    entityIds: [entityIds],
    publisher: "FIRSTPARTY",
    text: text,
    photoUrls: photoUrls || [], // Make photoUrls optional
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("API call successful");
    } else {
      console.error("API call failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error making API call:", error);
  }
}

// Fetch data from the webhook handler when the widget is loaded
fetchWebhookData();
