import { GraphQLClient } from "graphql-request";
import { CONSTANTS } from "@/constants/constants";

export const graphqlClient = new GraphQLClient(CONSTANTS.GRAPHQL_ENDPOINT, {
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  // Enable caching with Next.js fetch
  fetch: fetch,
});