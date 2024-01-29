import { SitesHttpResponse, SitesHttpRequest } from "@yext/pages/*";

const handleWebhook = async (request: SitesHttpRequest): Promise<SitesHttpResponse> => {
  const { body, method } = request;

  if (method !== "POST") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  const webhookPayload = JSON.parse(body);

  if (
    webhookPayload.meta.eventType === "ENTITY_CREATED" &&
    webhookPayload.primaryProfile.meta.entityType === "wp_post"
  ) {
    // Extract necessary information from the webhook payload
    const entityIds = [webhookPayload.primaryProfile.c_socialPostingEntityID];
    const text = webhookPayload.primaryProfile.wp_postExcerpt.markdown;
    const photoUrls = webhookPayload.primaryProfile.photoGallery.map(
      (gallery) => gallery.image.sourceUrl
    );

    console.log("Extracted Data:", entityIds, text, photoUrls);

    // Make API call to Yext using fetch
    const apiKey = "a5daebf51345716fdef2d975662e868c"; // Replace with your API key
    const apiUrl = `https://api.yextapis.com/v2/accounts/me/posts?api_key=${apiKey}&v=20240127`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds,
          publisher: "FIRSTPARTY",
          text,
          photoUrls,
        }),
      });

      const responseData = await response.json();

      console.log("Yext API Response:", responseData);

      return { body: "Success", headers: {}, statusCode: 200 };
    } catch (error) {
      console.error("Error making Yext API call:", error);

      return { body: "Error making Yext API call", headers: {}, statusCode: 500 };
    }
  }

  return { body: "Not a relevant event", headers: {}, statusCode: 200 };
};

export default handleWebhook;
