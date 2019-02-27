const { GraphQLServer } = require('graphql-yoga')

// In-memory. TODO: store in database.
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length // to generate unique ID

// all fields for type have resolver
// Every GraphQL resolver function actually receives four input arguments: 
// 1. parent/root
// 2. args
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () =>  links
  },
  Mutation: {
    post: (parent, args) => {
      // create new link object
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
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
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))