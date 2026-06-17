import { getOpenApiSpec } from "$lib/server/openapi";
import { json } from "@sveltejs/kit";

// Public endpoint: the OpenAPI spec is intentionally accessible without auth.
export function GET() {
  const spec = getOpenApiSpec();
  return json(spec);
}
