/* Liveness probe for Docker / Dokploy health checks. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", uptime: Math.round(process.uptime()) });
}
