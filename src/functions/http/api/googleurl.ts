import { SitesHttpResponse, SitesHttpRequest } from "@yext/pages/*";

const handleGoogleUrlWebhook = async (request: SitesHttpRequest): Promise<SitesHttpResponse> => {
  const { body, method } = request;

  if (method !== "POST") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  const webhookPayload = JSON.parse(body);

  if (webhookPayload.meta.eventType === "LISTING_UPDATED" && 
      webhookPayload.listing.status === "LIVE" && 
      webhookPayload.listing.publisherId === "GOOGLEMYBUSINESS") {
    
    const entityId = webhookPayload.listing.locationId;
    const listingUrl = webhookPayload.listing.listingUrl;

    const apiUrl = `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${API_KEY}&v=20240206`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "c_gbplistingurl": listingUrl
        }),
      });

      if (response.ok) {
        return { body: "Success", headers: {}, statusCode: 200 };
      } else {
        const responseData = await response.json();
        console.error("Error updating entity with Google listing URL:", responseData);
        return { body: "Error updating entity with Google listing URL", headers: {}, statusCode: 500 };
      }
    } catch (error) {
      console.error("Error making API call to update entity with Google listing URL:", error);
      return { body: "Error making API call to update entity with Google listing URL", headers: {}, statusCode: 500 };
    }
  }

  return { body: "Not a relevant event or conditions not met", headers: {}, statusCode: 200 };
};

export default handleGoogleUrlWebhook;
