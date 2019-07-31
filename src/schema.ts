const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        username: String
        email: String
        imageUrl: String
        phone: String
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
    
    type Mutation {
        addUser(newUser: NewUser ): User
    }
    
    input NewUser {
        username: String
        email: String
        imageUrl: String
        phone: String
        firstname: String
        lastname: String
        roomno: String
    }
`;

export default typeDefs;
