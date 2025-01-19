const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    points: Int!
    badges: [Badge]!
    createdAt: String!
    updatedAt: String!
    role: UserRole!
  }

  type Badge {
    id: ID!
    name: String!
    description: String!
    imageUrl: String
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    summary: String
    tags: [String]!
    author: User!
    contributors: [User]!
    version: Int!
    createdAt: String!
    updatedAt: String!
    sources: [Source]!
    verificationStatus: VerificationStatus!
  }

  type Source {
    id: ID!
    url: String!
    title: String
    author: String
    publishedDate: String
    verificationHash: String!
  }

  type LearningPath {
    id: ID!
    title: String!
    description: String!
    steps: [LearningStep]!
    difficulty: Difficulty!
    estimatedHours: Int!
    creator: User!
  }

  type LearningStep {
    id: ID!
    title: String!
    content: String!
    order: Int!
    completionCriteria: String
    resources: [Resource]!
  }

  type Resource {
    id: ID!
    title: String!
    type: ResourceType!
    url: String!
    description: String
  }

  type KnowledgeGraph {
    nodes: [Node]!
    edges: [Edge]!
  }

  type Node {
    id: ID!
    label: String!
    type: NodeType!
    weight: Float!
  }

  type Edge {
    source: ID!
    target: ID!
    weight: Float!
    type: EdgeType!
  }

  enum UserRole {
    USER
    EDITOR
    ADMIN
    EXPERT
  }

  enum VerificationStatus {
    PENDING
    VERIFIED
    DISPUTED
    REJECTED
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  enum ResourceType {
    ARTICLE
    VIDEO
    AUDIO
    EXERCISE
    QUIZ
    EXTERNAL_LINK
  }

  enum NodeType {
    CONCEPT
    TOPIC
    SKILL
    RESOURCE
  }

  enum EdgeType {
    REQUIRES
    RELATES_TO
    LEADS_TO
    PART_OF
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(limit: Int, offset: Int): [User]!
    leaderboard(limit: Int): [User]!

    # Article queries
    article(id: ID!): Article
    articles(
      limit: Int
      offset: Int
      tag: String
      searchTerm: String
    ): [Article]!
    relatedArticles(articleId: ID!, limit: Int): [Article]!

    # Learning path queries
    learningPath(id: ID!): LearningPath
    learningPaths(
      difficulty: Difficulty
      searchTerm: String
      limit: Int
      offset: Int
    ): [LearningPath]!
    recommendedPaths: [LearningPath]!

    # Knowledge graph queries
    knowledgeGraph(rootTopic: String!, depth: Int): KnowledgeGraph!
    searchNodes(term: String!): [Node]!
  }

  type Mutation {
    # User mutations
    register(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(
      username: String
      email: String
      password: String
    ): User!
    awardPoints(userId: ID!, points: Int!): User!
    awardBadge(userId: ID!, badgeId: ID!): User!

    # Article mutations
    createArticle(
      title: String!
      content: String!
      tags: [String]!
      sources: [SourceInput]!
    ): Article!
    updateArticle(
      id: ID!
      title: String
      content: String
      tags: [String]
      sources: [SourceInput]
    ): Article!
    deleteArticle(id: ID!): Boolean!
    verifyArticle(id: ID!, status: VerificationStatus!): Article!

    # Learning path mutations
    createLearningPath(
      title: String!
      description: String!
      difficulty: Difficulty!
      steps: [LearningStepInput]!
    ): LearningPath!
    updateLearningPath(
      id: ID!
      title: String
      description: String
      difficulty: Difficulty
      steps: [LearningStepInput]
    ): LearningPath!
    deleteLearningPath(id: ID!): Boolean!
  }

  input SourceInput {
    url: String!
    title: String
    author: String
    publishedDate: String
  }

  input LearningStepInput {
    title: String!
    content: String!
    order: Int!
    completionCriteria: String
    resources: [ResourceInput]!
  }

  input ResourceInput {
    title: String!
    type: ResourceType!
    url: String!
    description: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;
