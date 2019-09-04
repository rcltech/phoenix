const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        username: String
        email: String! 
        image_url: String!
        phone: String!
        first_name: String!
        last_name: String!
        room_no: String!
    }

    type Washer {
        id: ID!
        status: String!
        time_elapsed: String!
        time_remaining: String!
    }

    type Society {
        id: ID! 
        name: String!
        members: [User]
    }
    
    type Query {
        user(username: String!): User
        society(name: String!): Society
        washer(id: ID!): Washer
    }

    type Mutation {
        createUser(  id: ID
            username: String!
            email: String!
            image_url: String!
            phone: String!
            first_name: String!
            last_name: String!
            room_no: String!): User
        createSociety(name: String, members: [String]): Society
    }
`;


export default typeDefs;
