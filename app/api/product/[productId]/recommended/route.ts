import { getRecommendedProducts } from "@/utils/recommender_utils";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const { searchParams } = new URL(request.url)
  const count = searchParams.get('count') || '4';
  const products = await getRecommendedProducts(productId, Number(count));
  return Response.json(products);
}