# Mastra Project Ruleset

This document outlines the core principles, standards, and guidelines for development within the Mastra project. It serves as the primary reference for all team members to ensure consistency, quality, and efficiency throughout the development lifecycle.

## Table of Contents

1. [Project Principles](#project-principles)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Version Control](#version-control)
5. [Code Review Process](#code-review-process)
6. [Documentation](#documentation)
7. [Dependency Management](#dependency-management)
8. [Security Guidelines](#security-guidelines)
9. [Testing Requirements](#testing-requirements)
10. [Deployment Process](#deployment-process)
11. [Performance Standards](#performance-standards)
12. [Accessibility Requirements](#accessibility-requirements)

## Project Principles

### Core Values

- **Quality First**: Prioritize code quality and robustness over speed of delivery.
- **User-Centric**: Design and develop with the end user's experience as the primary consideration.
- **Maintainability**: Write code that is easy to understand, modify, and extend.
- **Collaboration**: Foster open communication and knowledge sharing among team members.

### Development Philosophy

- **Iterative Development**: Build incrementally with regular feedback cycles.
- **Fail Fast**: Identify and address issues early in the development process.
- **Continuous Improvement**: Regularly reflect on and refine development practices.
- **Technical Debt Awareness**: Acknowledge technical debt when it's created and allocate time to address it.

## Development Workflow

### Environment Setup

- All developers should use the standardized development environment as specified in the project documentation.
- Local development should mirror the production environment as closely as possible.
- Use the Mastra CLI for project scaffolding and component generation.

### Feature Development Process

1. **Planning**: Clearly define requirements and acceptance criteria before starting development.
2. **Implementation**: Develop according to the established coding standards and patterns.
3. **Testing**: Write and run tests to verify functionality.
4. **Review**: Submit code for peer review and address feedback.
5. **Integration**: Merge changes into the main branch after approval.
6. **Deployment**: Follow the established deployment process.

### Task Management

- Use the project management system to track tasks and progress.
- Keep task status updated to reflect current progress.
- Break down large tasks into smaller, manageable units of work.

## Code Standards

Refer to the [Coding Standards](./coding-standards.md) document for detailed guidelines on code style, formatting, and best practices specific to TypeScript and the Mastra framework.

### General Principles

- Write clean, readable, and self-documenting code.
- Follow the DRY (Don't Repeat Yourself) principle.
- Prioritize simplicity and clarity over cleverness.
- Optimize for readability and maintainability over performance, except in critical paths.

### Language-Specific Standards

- **TypeScript**: Follow the TypeScript best practices as outlined in the coding standards.
- **CSS/SCSS**: Use consistent naming conventions and organization.
- **HTML**: Ensure semantic markup and accessibility compliance.

## Version Control

### Git Workflow

- Use a feature branch workflow:
  - `main` branch contains production-ready code.
  - `develop` branch serves as an integration branch for features.
  - Feature branches are created from `develop` and merged back after completion.
  - Release branches are created from `develop` for final testing before merging to `main`.

### Commit Guidelines

- Write clear, descriptive commit messages that explain the "why" not just the "what".
- Use the following format for commit messages:
  ```
  <type>(<scope>): <subject>

  <body>

  <footer>
  ```
  Where:
  - `type` is one of: feat, fix, docs, style, refactor, test, chore
  - `scope` is the area of the codebase affected
  - `subject` is a short description of the change
  - `body` provides detailed explanation (optional)
  - `footer` references related issues/PRs (optional)

- Keep commits focused on a single logical change.
- Commit frequently to capture incremental progress.

### Branching Strategy

- Branch naming convention: `<type>/<description>` (e.g., `feature/weather-tool`, `fix/api-error-handling`)
- Types include: feature, bugfix, hotfix, refactor, docs, etc.
- Use lowercase and hyphens for the description.

## Code Review Process

### Review Criteria

All code changes must be reviewed against the following criteria:
- Adherence to coding standards and project patterns
- Correctness of implementation
- Test coverage
- Documentation completeness
- Performance considerations
- Security implications

### Review Process

1. Developer submits a pull request with a clear description of changes.
2. At least one team member reviews the code and provides feedback.
3. Developer addresses feedback and requests re-review if necessary.
4. Reviewer approves changes once all issues are resolved.
5. Code is merged by the developer or designated team member.

### Review Etiquette

- Be respectful and constructive in feedback.
- Focus on the code, not the person.
- Provide specific suggestions for improvement.
- Acknowledge good practices and clever solutions.

## Documentation

### Required Documentation

- **README.md**: Project overview, setup instructions, and basic usage examples.
- **API Documentation**: For all public APIs and interfaces.
- **Architecture Documentation**: System design, component relationships, and data flow.
- **User Documentation**: For end-user features and functionality.

### Documentation Standards

- Keep documentation up-to-date with code changes.
- Write in clear, concise language.
- Include examples for complex concepts.
- Use diagrams where appropriate to illustrate relationships and flows.

### Code Documentation

- Use JSDoc comments for functions, classes, and interfaces.
- Document non-obvious behavior and edge cases.
- Explain the "why" behind complex implementations.

## Dependency Management

### Dependency Selection Criteria

- Prefer established, well-maintained libraries.
- Consider license compatibility, security history, and community support.
- Evaluate the impact on bundle size and performance.
- Assess documentation quality and API stability.

### Dependency Management Practices

- Regularly update dependencies to benefit from bug fixes and security patches.
- Lock dependency versions to ensure consistent builds.
- Document the purpose and usage of each major dependency.
- Periodically review and prune unused dependencies.

### Internal Dependencies

- Clearly define and document internal module boundaries.
- Minimize circular dependencies.
- Design for reusability where appropriate.

## Security Guidelines

### General Security Practices

- Follow the principle of least privilege.
- Validate all user inputs.
- Sanitize data before displaying or storing.
- Use parameterized queries for database operations.

### Authentication and Authorization

- Implement proper authentication for all protected resources.
- Use role-based access control for authorization.
- Store credentials securely using environment variables or secure storage.
- Never hardcode sensitive information in source code.

### Data Protection

- Encrypt sensitive data in transit and at rest.
- Implement proper data retention and deletion policies.
- Be mindful of data privacy regulations (GDPR, CCPA, etc.).

## Testing Requirements

### Test Coverage

- Aim for high test coverage, especially for critical paths and complex logic.
- All new features must include appropriate tests.
- Bug fixes should include regression tests.

### Types of Testing

- **Unit Tests**: Test individual functions and components in isolation.
- **Integration Tests**: Test interactions between components.
- **End-to-End Tests**: Test complete user flows.
- **Performance Tests**: Verify system performance under load.

### Testing Best Practices

- Write tests that are independent and repeatable.
- Use descriptive test names that explain the expected behavior.
- Mock external dependencies to ensure test isolation.
- Run tests before committing code.

## Deployment Process

### Environments

- **Development**: For active development and integration testing.
- **Staging**: For pre-release testing and validation.
- **Production**: For end-user access.

### Deployment Steps

1. Build and package the application.
2. Run automated tests.
3. Deploy to the target environment.
4. Verify deployment success.
5. Monitor for issues post-deployment.

### Rollback Procedure

- Have a clear plan for rolling back changes if issues are detected.
- Document the specific steps required for rollback.
- Test rollback procedures periodically.

## Performance Standards

### Performance Goals

- Define specific performance targets for key user interactions.
- Regularly measure and track performance metrics.
- Address performance regressions promptly.

### Performance Best Practices

- Optimize bundle size through code splitting and tree shaking.
- Minimize network requests and payload sizes.
- Implement caching strategies where appropriate.
- Profile and optimize CPU-intensive operations.

### Performance Testing

- Include performance tests in the CI/CD pipeline.
- Benchmark against established baselines.
- Test performance on representative devices and network conditions.

## Accessibility Requirements

### Compliance Standards

- Aim for WCAG 2.1 AA compliance at minimum.
- Regularly audit for accessibility issues.
- Address accessibility bugs with the same priority as functional bugs.

### Accessibility Practices

- Use semantic HTML elements.
- Ensure proper keyboard navigation.
- Provide alternative text for images.
- Maintain sufficient color contrast.
- Test with screen readers and other assistive technologies.

---

This ruleset serves as a living document and should be updated as the project evolves and new best practices emerge. All team members are encouraged to suggest improvements to these guidelines through the established review process.
