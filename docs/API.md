# OmniLearn API Documentation

## GraphQL API

### Authentication

#### Register User
```graphql
mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

#### Login User
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

### Articles

#### Get Article
```graphql
query Article($id: ID!) {
  article(id: $id) {
    id
    title
    content
    summary
    tags
    createdAt
    updatedAt
    author {
      id
      username
    }
    contributors {
      id
      username
    }
    sources {
      url
      title
      author
      publishedDate
    }
    verificationStatus
  }
}
```

#### Create Article
```graphql
mutation CreateArticle(
  $title: String!
  $content: String!
  $tags: [String]!
  $sources: [SourceInput]!
) {
  createArticle(
    title: $title
    content: $content
    tags: $tags
    sources: $sources
  ) {
    id
    title
    content
  }
}
```

#### Update Article
```graphql
mutation UpdateArticle(
  $id: ID!
  $title: String
  $content: String
  $tags: [String]
  $sources: [SourceInput]
) {
  updateArticle(
    id: $id
    title: $title
    content: $content
    tags: $tags
    sources: $sources
  ) {
    id
    title
    content
  }
}
```

### Learning Paths

#### Get Learning Path
```graphql
query LearningPath($id: ID!) {
  learningPath(id: $id) {
    id
    title
    description
    difficulty
    estimatedHours
    creator {
      id
      username
    }
    steps {
      id
      title
      content
      order
      completionCriteria
      resources {
        id
        title
        type
        url
        description
      }
    }
  }
}
```

#### Create Learning Path
```graphql
mutation CreateLearningPath(
  $title: String!
  $description: String!
  $difficulty: Difficulty!
  $steps: [LearningStepInput]!
) {
  createLearningPath(
    title: $title
    description: $description
    difficulty: $difficulty
    steps: $steps
  ) {
    id
    title
  }
}
```

### Knowledge Graph

#### Get Knowledge Graph
```graphql
query KnowledgeGraph($rootTopic: String!, $depth: Int) {
  knowledgeGraph(rootTopic: $rootTopic, depth: $depth) {
    nodes {
      id
      label
      type
      weight
    }
    edges {
      source
      target
      type
      weight
    }
  }
}
```

### User Profile

#### Get User Profile
```graphql
query UserProfile($id: ID!) {
  user(id: $id) {
    id
    username
    points
    badges {
      id
      name
      description
      imageUrl
    }
    role
  }
}
```

## REST Endpoints

### File Upload
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: File to upload
- type: Type of file (avatar, resource, etc.)
```

### Health Check
```
GET /health
Returns: 
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-01-19T11:02:30+02:00"
}
```

## WebSocket Events

### Real-time Collaboration
```javascript
// Subscribe to article changes
socket.on('article:update', (data) => {
  // Handle real-time article updates
});

// Subscribe to learning progress
socket.on('progress:update', (data) => {
  // Handle learning progress updates
});
```

## Error Handling

### GraphQL Errors
All GraphQL errors follow this format:
```json
{
  "errors": [
    {
      "message": "Error message",
      "path": ["field", "path"],
      "extensions": {
        "code": "ERROR_CODE",
        "classification": "ERROR_TYPE"
      }
    }
  ]
}
```

### Common Error Codes
- `UNAUTHENTICATED`: User is not logged in
- `FORBIDDEN`: User lacks required permissions
- `BAD_USER_INPUT`: Invalid input data
- `NOT_FOUND`: Requested resource not found
- `INTERNAL_SERVER_ERROR`: Server-side error

## Rate Limiting

- API calls are limited to 100 requests per minute per IP
- File uploads are limited to 10 per minute per user
- WebSocket connections are limited to 5 per user

## Authentication

All authenticated requests must include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
