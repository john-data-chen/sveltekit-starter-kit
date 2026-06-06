import { getOpenApiSpec } from "$lib/server/openapi";
import { json } from "@sveltejs/kit";

import type { RequestEvent } from "./$types";

export function GET(_event: RequestEvent) {
  const spec = getOpenApiSpec();
  return json(spec);
}
