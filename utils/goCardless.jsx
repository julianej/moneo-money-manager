const BASE_URL = "https://bankaccountdata.gocardless.com/api/v2";

export async function getGoCardlessAccessToken() {
  const refresh = process.env.GOCARDLESS_REFRESH_TOKEN;

  if (!refresh) {
    throw new Error("Missing GoCardless refresh token.");
  }

  const response = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Could not authenticate with GoCardless."
    );
  }

  return data.access;
}

export async function goCardlessRequest(path, accessToken) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "GoCardless API request failed."
    );
  }

  return data;
}