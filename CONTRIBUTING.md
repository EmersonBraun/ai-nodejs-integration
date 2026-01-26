# Contributing Guidelines

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code Style

This project uses Biome for linting and formatting. Please ensure your code follows the project's style guidelines.

### Running Linters

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Code Style Rules

- Use TypeScript for all new code
- Follow NestJS conventions and patterns
- Use class-validator decorators for DTOs
- Keep functions focused and single-purpose
- Write self-documenting code (no comments unless necessary)
- Use meaningful variable and function names

## Commit Messages

Follow the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(gemini): add streaming support

Add Server-Sent Events support for streaming Gemini responses.

Closes #123
```

```
fix(rag): handle missing collection gracefully

Return proper 404 error when collection doesn't exist instead of 500.
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linters and fix any issues (`npm run lint:fix`)
5. Ensure all tests pass (if applicable)
6. Commit your changes using conventional commit format
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] All linters pass
- [ ] Code is self-documenting (no unnecessary comments)
- [ ] DTOs have proper validation decorators
- [ ] OpenAPI documentation is updated
- [ ] Commit messages follow conventional commits format

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run the development server: `npm run start:dev`
5. Access Swagger docs at `http://localhost:3000/docs`

## Testing

When adding new features:

1. Test the endpoint using Swagger UI
2. Verify request/response validation works correctly
3. Test error cases (missing required fields, invalid values, etc.)
4. Ensure OpenAPI documentation is accurate

## Adding New Features

When adding a new feature module:

1. Create a new module directory under `src/`
2. Follow the existing module structure:
   - `*.module.ts` - Module definition
   - `*.controller.ts` - HTTP endpoints
   - `*.service.ts` - Business logic
   - `dto/` - Data Transfer Objects with validation
3. Register the module in `app.module.ts`
4. Add OpenAPI tags and documentation
5. Update README.md if needed

## DTO Guidelines

- Use class-validator decorators for validation
- Use @ApiProperty() decorators for OpenAPI documentation
- Include examples in @ApiProperty() when helpful
- Keep DTOs focused and single-purpose
- Use enums for fixed sets of values

## Error Handling

- Use NestJS built-in exceptions (BadRequestException, NotFoundException, etc.)
- Provide meaningful error messages
- Include helpful instructions in error responses when applicable
- Log errors appropriately using NestJS Logger

## Documentation

- Keep README.md up to date
- Ensure all endpoints have OpenAPI documentation
- Document any new environment variables in `env.example`
- Update CONTRIBUTING.md if process changes

## Questions?

If you have questions about contributing, please open an issue for discussion.

Thank you for contributing!



