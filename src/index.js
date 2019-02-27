const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

// all fields for type have resolver
// Every GraphQL resolver function actually receives four input arguments: 
// 1. parent/root: from previous level of query
// 2. args: arugments passed from query
// 3. context
// 4. info
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (parent, args, context, info) => {
      return context.prisma.links()
    },
    link: (parent, args, context, info) => {
      const links = context.prisma.links()
      return links.find(link => link.id === args.id)
    }
  },
  Mutation: {
    post: (parent, args, context, info) => {
      // create new link object
      return context.prisma.createLink({
        description: args.description,
        url: args.url
      })
    },
    updateLink: (parent, args, context, info) => {
      const links = context.prisma.links()
      // TODO. Not working
      const index = context.prisma.findIndex(link => link.id === args.id)
      if (args.description) links[index].description = args.description
      if (args.url) links[index].url = args.url
      return links[index]
    },
    deleteLink: (parent, args) => {
      const links = context.prisma.links()
      // TODO. Not working
      const index = context.prisma.findIndex(link => link.id === args.id)
      if (index > -1) {
        const removedLink = links[index]
        links.splice(index, 1)
        return removedLink
      }
    }
  },
  // Link resolvers not needed because GraphQL infers from type
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))