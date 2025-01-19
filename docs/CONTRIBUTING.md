# Contributing to OmniLearn

We love your input! We want to make contributing to OmniLearn as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the docs/ folder with any new documentation or changes to existing docs.
3. The PR will be merged once you have the sign-off of two other developers.

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/yourusername/omnilearn/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/omnilearn/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Code Style Guidelines

### JavaScript/TypeScript

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use template literals for string interpolation
- Use arrow functions where appropriate
- Use async/await for asynchronous operations
- Use meaningful variable and function names
- Add comments for complex logic

### React

- Use functional components with hooks
- Use prop-types or TypeScript for type checking
- Keep components small and focused
- Use meaningful component names
- Follow the container/presenter pattern
- Use CSS-in-JS with Material-UI's styling system

### GraphQL

- Use clear and descriptive type names
- Keep queries focused and optimized
- Use fragments for reusable fields
- Document all types and fields
- Follow naming conventions for queries and mutations

## Testing Guidelines

1. Write unit tests for all new code
2. Ensure all tests pass before submitting PR
3. Include integration tests for complex features
4. Test edge cases and error conditions
5. Use meaningful test descriptions

## Documentation Guidelines

1. Update relevant documentation for all changes
2. Use clear and concise language
3. Include code examples where appropriate
4. Keep documentation up-to-date with code
5. Follow markdown best practices

## Setting Up Development Environment

1. Clone the repository
```bash
git clone https://github.com/yourusername/omnilearn.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

## Database Migrations

1. Create new migration
```bash
npm run migrate:create
```

2. Run migrations
```bash
npm run migrate:up
```

3. Rollback migrations
```bash
npm run migrate:down
```

## Commit Message Guidelines

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
