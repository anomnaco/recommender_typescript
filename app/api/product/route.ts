import { getProducts } from "@/utils/query"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pagingState = searchParams.get('pagingState');
  const products = await getProducts(pagingState);
  return Response.json(products);
}