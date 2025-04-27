// Environment variable for Resend API Key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY env var");
}

interface EmailRequest {
  to: string[];
  subject: string;
  title?: string; // optional display name or title
  body: string;   // HTML content
}

Deno.serve(async (request: Request): Promise<Response> => {
  try {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { to, subject, title, body } = await request.json() as EmailRequest;
    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: "Missing to, subject, or body" }), { status: 400 });
    }

    // Construct the From header (use title if provided)
    const from = title
      ? `${title} <onboarding@resend.dev>`
      : `<onboarding@resend.dev>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html: body,
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
})

