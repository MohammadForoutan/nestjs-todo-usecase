import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SignUpDto, LoginDto } from './application/dtos';

export class UserDocs {
  static signUp = applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Create a new user account with email and password',
      tags: ['Users'],
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
              role: { type: 'string', example: 'user' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - validation failed',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'array',
            items: { type: 'string' },
            example: ['name should not be empty', 'email must be an email'],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - user already exists',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User with this email already exists',
          },
          error: { type: 'string', example: 'Conflict' },
          statusCode: { type: 'number', example: 409 },
        },
      },
    }),
    ApiBody({
      type: SignUpDto,
      description: 'User registration data',
      examples: {
        example1: {
          summary: 'Basic user registration',
          value: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          },
        },
        example2: {
          summary: 'Admin user registration',
          value: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
          },
        },
      },
    }),
  );

  static login = applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticate user with email and password',
      tags: ['Users'],
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
              role: { type: 'string', example: 'user' },
            },
          },
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid credentials',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid credentials' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
    ApiBody({
      type: LoginDto,
      description: 'User login credentials',
      examples: {
        example1: {
          summary: 'User login',
          value: {
            email: 'john@example.com',
            password: 'password123',
          },
        },
      },
    }),
  );

  static getProfile = applyDecorators(
    ApiOperation({
      summary: 'Get user profile',
      description: 'Retrieve current user profile information',
      tags: ['Users'],
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'User profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
              role: { type: 'string', example: 'user' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid or missing token',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
    ApiBearerAuth('JWT-auth'),
  );
}
