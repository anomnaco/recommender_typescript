import { getProduct } from "@/utils/query"

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const product = await getProduct(productId);
  return Response.json(product);
}