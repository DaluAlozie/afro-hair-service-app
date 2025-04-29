import { fetchProfile, fetchAppointments, computeStats, normaliseFeatures, upsertEmbedding } from "../_utils/recommend.ts";

// --- Edge Function Handler ---
Deno.serve(async (req: Request) => {
  const { headers } = req;
  if (headers.get('API-KEY') !== Deno.env.get("APP_API_KEY")) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const { user_id: userId } = await req.json() as { user_id?: string };
    if (!userId) return new Response("Missing user_id", { status: 400 });

    const profile = await fetchProfile(userId);
    const apps = await fetchAppointments(userId);
    const stats = computeStats(apps);
    const embedding = normaliseFeatures(profile, stats);
    await upsertEmbedding(userId, embedding);

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error("Embedding error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
