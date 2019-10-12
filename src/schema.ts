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
    
    input UserRegisterInput {
        username: String
        phone: String!
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
        me : User
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
        login: LoginResponse
        register(
            user : UserRegisterInput!
        ) : User
    }
    
    type LoginResponse {
        token: String
        login_status: Boolean!
        register: Boolean
    }
`;


export default typeDefs;
