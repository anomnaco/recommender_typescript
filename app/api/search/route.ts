import { getSearchResults } from "@/utils/recommender_utils";

export async function POST(request: Request) {
  const body = await request.json();
  const keyword = body.query;
  const products = await getSearchResults(keyword, 20);
  return Response.json(products)
}