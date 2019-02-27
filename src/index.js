const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// all fields for type have resolver
// Every GraphQL resolver function actually receives four input arguments: 
// 1. parent/root: from previous level of query
// 2. args: arugments passed from query
// 3. context
// 4. info
const resolvers = {
  Query,
  Mutation,
  User,
  Link
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => { 
    return {
      ...request,
      prisma 
    }
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))