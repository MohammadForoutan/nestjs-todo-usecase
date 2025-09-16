# 📋 API Guidelines

## RESTful API Design

### URL Structure

- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural nouns: `/todos` not `/todo`
- Use hierarchical structure: `/users/{id}/todos`

### HTTP Methods

- `GET`: Retrieve resources
- `POST`: Create new resources
- `PUT`: Update entire resources
- `PATCH`: Partial updates
- `DELETE`: Remove resources

### Status Codes

- `200`: OK - Success
- `201`: Created - Resource created
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Access denied
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `500`: Internal Server Error

## Request/Response Format

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

### Response Format

```json
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}
```

### Error Format

```json
{
  "message": "Error description",
  "statusCode": 400,
  "error": "Bad Request"
}
```

## Authentication

### JWT Token

- Include in `Authorization` header
- Format: `Bearer <token>`
- Expires in 24 hours
- Contains: `sub`, `email`, `role`

### Protected Endpoints

- All `/todos/*` endpoints require authentication
- `/users/profile` requires authentication

## Validation

### Input Validation

- Use `class-validator` decorators
- Validate all required fields
- Check data types and formats
- Return detailed error messages

### Example

```typescript
export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

## Pagination

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort direction (asc/desc)

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded
- Headers include rate limit info

## Error Handling

### Global Error Handler

- Catches all unhandled errors
- Logs errors with Winston
- Returns consistent error format
- Masks sensitive information in production

### Custom Exceptions

```typescript
export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
```

## API Documentation

### Swagger UI

- Available at `/api/docs`
- Interactive API testing
- Authentication support
- Request/response examples

### OpenAPI Specification

- Generated automatically
- Available at `/api/docs-json`
- Can be imported into Postman/Insomnia

## Best Practices

1. **Consistent Naming**: Use camelCase for JSON properties
2. **Versioning**: Include API version in URL (`/api/v1/`)
3. **Filtering**: Use query parameters for filtering
4. **Sorting**: Use `sort` and `order` parameters
5. **Search**: Use `q` parameter for text search
6. **Caching**: Use appropriate cache headers
7. **Security**: Validate all inputs, sanitize outputs
8. **Logging**: Log all API requests and responses
