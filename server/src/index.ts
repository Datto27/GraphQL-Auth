import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import dotenv from "dotenv"
dotenv.config()
import { userResolvers } from "./schema/user/resolvers";
import { userTypeDefs } from "./schema/user/typedefs";

const PORT = 8080


const GraphQLServer = new ApolloServer({
  resolvers: [userResolvers],
  typeDefs: [userTypeDefs],
});

(async function start () {
  const { url } = await startStandaloneServer(GraphQLServer, {
    listen: { port: 4000 },
  });  
  console.log(url)
})()