# Swagger API Documentation

This backend includes comprehensive API documentation using Swagger/OpenAPI.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/api/docs
```

## Features

### Authentication
The API uses JWT Bearer authentication. To test protected endpoints:

1. Use the `/auth/login` or `/auth/register` endpoint to get an access token
2. Click the "Authorize" button at the top right of the Swagger UI
3. Enter your token in the format: `Bearer your-access-token-here`
4. Click "Authorize" and close the dialog
5. All subsequent requests will include the authentication header

### Available API Tags

- **health** - Health check endpoint
- **auth** - Authentication endpoints (register, login, logout, refresh, password reset)
- **users** - User management endpoints (coming soon)
- **pets** - Pet management endpoints (coming soon)
- **services** - Service provider endpoints (coming soon)
- **bookings** - Booking management endpoints (coming soon)
- **notifications** - Notification endpoints (coming soon)
- **s3** - File upload endpoints (coming soon)

## Current Endpoints

### Authentication (`/auth`)

#### POST `/auth/register`
Register a new user account.
- **Rate limit**: 3 requests per minute
- **Request body**: RegisterDto
- **Responses**: 201 (success), 400 (validation error), 429 (too many requests)

#### POST `/auth/login`
Login with email and password.
- **Rate limit**: 5 requests per minute
- **Request body**: LoginDto
- **Responses**: 200 (success), 401 (invalid credentials), 429 (too many requests)

#### POST `/auth/refresh`
Refresh access token using refresh token.
- **Request body**: RefreshTokenDto
- **Responses**: 200 (success), 401 (invalid token)

#### POST `/auth/logout`
Logout current user (requires authentication).
- **Authentication**: Required (Bearer token)
- **Responses**: 200 (success), 401 (unauthorized)

#### POST `/auth/forgot-password`
Request password reset email.
- **Rate limit**: 3 requests per 5 minutes
- **Request body**: ForgotPasswordDto
- **Responses**: 200 (success), 404 (user not found), 429 (too many requests)

#### POST `/auth/reset-password`
Reset password using token from email.
- **Rate limit**: 3 requests per minute
- **Request body**: ResetPasswordDto
- **Responses**: 200 (success), 400 (invalid token), 429 (too many requests)

#### GET `/auth/me`
Get current user profile (requires authentication).
- **Authentication**: Required (Bearer token)
- **Responses**: 200 (success), 401 (unauthorized)

### Health Check

#### GET `/`
Health check endpoint to verify the API is running.
- **Responses**: 200 (success)

## Customizations

The Swagger UI includes several customizations:

- **Persistent Authorization**: Your JWT token is saved in the browser
- **Alphabetical Sorting**: Tags and operations are sorted alphabetically
- **Custom Styling**: Clean interface with hidden top bar
- **Rate Limiting Information**: Each endpoint shows its rate limits

## Configuration

Swagger configuration is defined in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Guaumiau API')
  .setDescription('API documentation for Guaumiau - Pet Care Services Platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

## Adding Documentation to New Endpoints

When creating new endpoints, use these decorators:

### Controller Level
```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('your-tag')
@Controller('your-path')
export class YourController { }
```

### Endpoint Level
```typescript
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Get()
@ApiOperation({ summary: 'Description of endpoint' })
@ApiResponse({ status: 200, description: 'Success response' })
@ApiResponse({ status: 404, description: 'Not found' })
@ApiBearerAuth('JWT-auth') // For protected endpoints
async yourMethod() { }
```

### DTO Level
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class YourDto {
  @ApiProperty({
    description: 'Field description',
    example: 'Example value',
  })
  field: string;

  @ApiPropertyOptional({
    description: 'Optional field',
  })
  optionalField?: string;
}
```

## Production Considerations

- The Swagger UI is available in all environments
- For production, consider:
  - Disabling Swagger or protecting it with authentication
  - Setting `NODE_ENV=production` to enable CSP headers
  - Using environment variables to control Swagger availability

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
