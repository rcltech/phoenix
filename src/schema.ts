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

    type Query {
        user(username: String!): User
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
        deleteUser(username: String!): User
    }
`;


export default typeDefs;
