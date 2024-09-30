export async function onRequest({ request, env }) {
  try {
    const code = new URL(request.url).searchParams.get("code");

    if (!code) {
      const params = new URLSearchParams({
        client_id: env.CLIENT_ID,
        scope: env.SCOPE,
        redirect_uri: env.REDIRECT_URI,
      });

      return Response.redirect(`${env.AUTHORIZE_URL}?${params}`, 301);
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      redirect_uri: env.REDIRECT_URI,
      code,
    });

    const response = await fetch(`${env.TOKEN_URL}?${params}`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    });

    const data = await response.json();

    return new Response(
      `<script>parent.postMessage({ type: 'auth', data: ${JSON.stringify(data)} }, '*'); close();</script>`,
      {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      },
    );
  } catch (error) {
    return new Response(String(error));
  }
}
