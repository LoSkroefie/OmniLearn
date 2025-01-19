# OmniLearn

A next-generation knowledge platform that revolutionizes how we learn, share, and explore information.

## Features

### Knowledge Graph
- Interactive visualization of topics and their relationships
- Dynamic exploration of connected concepts
- Custom path creation and sharing
- Visual learning progress tracking

### AI Integration
- Content generation and verification
- Personalized learning recommendations
- Adaptive difficulty adjustment
- Source validation and summarization

### Collaborative Learning
- Real-time collaborative editing
- Peer review system
- Discussion forums and study groups
- Expert verification process

### Learning Paths
- Structured learning sequences
- Progress tracking and analytics
- Achievement system
- Custom path creation

### User Experience
- Modern, responsive design
- Intuitive navigation
- Accessibility features
- Mobile-friendly interface

## Tech Stack

### Frontend
- React.js for UI components
- Apollo Client for GraphQL integration
- Material-UI for styling
- D3.js for knowledge graph visualization
- React Router for navigation

### Backend
- Node.js with Express
- Apollo Server for GraphQL API
- PostgreSQL for data storage
- Redis for caching
- OpenAI API for AI features

### Infrastructure
- Docker for containerization
- Nginx for reverse proxy
- PM2 for process management
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/omnilearn.git
cd omnilearn
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run migrate:up
npm run seed
```

5. Start development servers:
```bash
# Start backend server
npm run dev

# In another terminal, start frontend server
cd frontend && npm start
```

### Docker Setup

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## Wiki

Visit our [Wiki](./wiki) for:
- [Getting Started Guide](./wiki/Getting-Started.md)
- [Developer Guide](./wiki/Developer-Guide.md)
- [FAQ](./wiki/FAQ.md)

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) before submitting a pull request.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style
- Follow the established coding standards
- Write clear commit messages
- Include tests for new features
- Update documentation as needed

## Support

- [Report bugs](https://github.com/yourusername/omnilearn/issues)
- [Request features](https://github.com/yourusername/omnilearn/issues)
- [Join our Discord](https://discord.gg/omnilearn)
- [Email support](support@omnilearn.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for AI capabilities
- Material-UI for components
- D3.js for visualizations
- All our contributors and supporters
