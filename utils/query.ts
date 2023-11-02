import {
  ASTRA_DB_ID,
  ASTRA_DB_REGION,
  ASTRA_DB_APPLICATION_TOKEN,
  KEYSPACE,
  COLLECTION_NAME,
} from './local_creds';
import { ProductItem } from './product';

const request_url = `https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/${KEYSPACE}/${COLLECTION_NAME}`;

const request_headers = new Headers({ 'Content-Type': 'application/json' });
request_headers.append('x-cassandra-token', ASTRA_DB_APPLICATION_TOKEN!);

const generateRequestPayloadFindById = (productId: string) => {
  const query = { "findOne": { "filter": { "uniq_id": productId } } }
  return query;
}

export const getProduct = async (productId: string) => {
  const response = await fetch(request_url, {
    method: 'POST',
    headers: request_headers,
    body: JSON.stringify(generateRequestPayloadFindById(productId)),
  });
  const data = await response.json();
  return data["data"]["document"] as ProductItem;
}

export const getProductVector = async (productId: string) => {
  const product = await getProduct(productId);
  return product["$vector"];
}

const generateRequestPayloadFindByPagination = (pagingState: string | null) => {
  const query = { "find": {} };
  if (pagingState) {
    query["find"] = { "options": { "pagingState": pagingState } }
  }
  return query;
}

export const getProducts = async (pagingState: string | null) => {
  try {
    const response = await fetch(request_url, {
      method: 'POST',
      headers: request_headers,
      body: JSON.stringify(generateRequestPayloadFindByPagination(pagingState)),
    });
    const data = await response.json();
    return data["data"] as { documents: ProductItem[]; nextPageState: string }
  } catch (err) {
    console.error(err);
  }
}


const generateRequestPayloadVectorSearch = (vector: ProductItem['$vector'], count: number) => {
  const query = { "find": { "sort": { "$vector": vector }, "options": { "limit": count } } }
  return query;
}


export const getSimilarProducts = async (vector: ProductItem['$vector'], count: number) => {
  const response = await fetch(request_url, {
    method: 'POST',
    headers: request_headers,
    body: JSON.stringify(generateRequestPayloadVectorSearch(vector, count)),
  });
  const data = await response.json();
  const productList = data["data"]["documents"] as ProductItem[];
  const providedVectorRemovedProductList = productList.filter(row => JSON.stringify(row['$vector']) !== JSON.stringify(vector)).map(({ $vector, ...row }) => row);
  return providedVectorRemovedProductList;
}