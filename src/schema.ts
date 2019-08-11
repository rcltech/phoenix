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

    type Washer {
        id: Int
        status: String
        timeElapsed: String
        timeRemaining: String
    }

    type Society {
        name: String
        members: [User]
    }
    type SportsTeam {
      name: String
      captain: String
      members: [User]
      events: [String]
      contact: String
    }

    type Query {
        user(id: ID!): User
        society(id: ID!): Society
        washer(id: ID!): Washer
        sportsTeam(id: ID!): SportsTeam
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
