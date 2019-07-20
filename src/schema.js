const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        username: String
        firstname: String
        lastname: String
        roomno: String
    }

    type Society {
        name: String
        members: [User]
    }

    type Query {
        user(id: ID!): User
        society(id: ID!): Society
    }
`;

module.exports = typeDefs;
