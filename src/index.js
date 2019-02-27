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
    feed: () =>  links,
    link: (parent, args) => links.find(link => link.id === args.id)
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
    },
    updateLink: (parent, args) => {
      const index = links.findIndex(link => link.id === args.id)
      if (args.description) links[index].description = args.description
      if (args.url) links[index].url = args.url
      return links[index]
    },
    deleteLink: (parent, args) => {
      const index = links.findIndex(link => link.id === args.id)
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
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))