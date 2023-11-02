import { OpenAI } from 'langchain/llms/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { OPENAI_API_KEY } from './local_creds';
import { getProduct, getProductVector, getSimilarProducts } from './query';
import { ProductItem } from './product';

const llm = new OpenAI({ openAIApiKey: OPENAI_API_KEY });
const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

export const getPossibleRecommendedProducts = async (productId: string, count: number) => {
  const productVetor = await getProductVector(productId);
  const similarProducts = await getSimilarProducts(productVetor, count);
  return similarProducts
};

// strip_blank_fields function
const stripBlankFields = (row: Partial<ProductItem>) => {
  return Object.fromEntries(
      Object.entries(row).filter(([key, value]) => value !== "")
  );
};

// strip_for_query function
const stripForQuery = (row: Partial<ProductItem>) => {
  const selectedKeys = ["product_name", "brand_name", "category", "selling_price", "about_product", "selling_price", "product_specification", "technical_details", "shipping_weight"];
  return Object.fromEntries(
      Object.entries(row).filter(([key]) => selectedKeys.includes(key))
  );
};


const buildFullPrompt = async (productId: string, count: number) => {
  const longProductList = await getPossibleRecommendedProducts(productId, 8);
  const strippedProductList = longProductList.map((row) => stripBlankFields(stripForQuery(row)));
  const stringProductList = strippedProductList.map((product, ind) => "PRODUCT NUMBER " + ind + ": " + JSON.stringify(product));

  const product = await getProduct(productId);
  // prompt that is sent to openai using the response from the vector database
  const promptBoilerplate = `Of the following products, all preceded with PRODUCT NUMBER, select the ${count} products most recommended to shoppers who bought the product preceded by ORIGINAL PRODUCT below. Return the product_id corresponding to those products.`;
  const originalProductSection = "ORIGINAL PRODUCT: " + JSON.stringify(stripBlankFields(stripForQuery(product)));
  const comparableProductsSection = stringProductList.join("\n");
  const finalAnswerBoilerplate = "Final Answer: "
  return {
    fullPrompt: promptBoilerplate + "\n" + originalProductSection + "\n" + comparableProductsSection + "\n" + finalAnswerBoilerplate,
    products: longProductList,
  }
}


export const getRecommendedProducts = async (productId: string, count: number) => {
  const {fullPrompt, products} = await buildFullPrompt(productId, count)
  const result = await llm.predict(fullPrompt);

  const indexList = result.split(",").map(index => parseInt(index, 10));
  const prodList = indexList.map(index => products[index]);
  return prodList
}


export const getSearchResults = async (keyword: string, count: number) => {
  const embedding = await embeddings.embedQuery(keyword);
  const relevantProducts = getSimilarProducts(embedding, count)
  return relevantProducts
}

