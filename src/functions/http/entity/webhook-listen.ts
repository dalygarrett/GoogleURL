import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import axios from "axios";

const webhookListen = async (
  request: SitesHttpRequest
): Promise<SitesHttpResponse> => {
  const { body, method } = request;

  if (method !== "POST") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  const webhookPayload = JSON.parse(body);

  const { meta, primaryProfile, eventType } = webhookPayload;

  if (eventType === "ENTITY_CREATED" && primaryProfile.meta.entityType === "wp_post") {
    // Extract necessary data from webhook payload
    const entityIds = [primaryProfile.c_socialPostingEntityID];
    const text = primaryProfile.wp_postExcerpt.markdown;
    const photoUrls = primaryProfile.photoGallery.map((photo) => photo.image.sourceUrl);

    // Make API call to Yext
    const apiKey = process.env.YEXT_API_KEY; // Ensure that you have set this environment variable
    const apiUrl = `https://api.yextapis.com/v2/accounts/me/posts?api_key=${apiKey}&v=20240127`;

    try {
      const apiResponse = await axios.post(apiUrl, {
        entityIds,
        publisher: "FIRSTPARTY",
        text,
        photoUrls,
      });

      console.log("API Response:", apiResponse.data);

      return { body: "Success", headers: {}, statusCode: 200 };
    } catch (error) {
      console.error("API Error:", error.message);

      return { body: "Internal Server Error", headers: {}, statusCode: 500 };
    }
  }

  return { body: "Not applicable", headers: {}, statusCode: 200 };
};

export default webhookListen;

