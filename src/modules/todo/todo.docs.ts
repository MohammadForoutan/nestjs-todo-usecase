import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './application/dtos';
import { TodoStatus } from './domain/todo.entity';

export class TodoDocs {
  static create = applyDecorators(
    ApiOperation({
      summary: 'Create a new todo',
      description: 'Create a new todo item for the authenticated user',
      tags: ['Todos'],
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 201,
      description: 'Todo successfully created',
      schema: {
        type: 'object',
        properties: {
          todo: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              title: { type: 'string', example: 'Learn NestJS' },
              description: {
                type: 'string',
                example: 'Complete the NestJS tutorial',
              },
              status: {
                type: 'string',
                example: 'pending',
                enum: Object.values(TodoStatus),
              },
              ownerId: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
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
            example: ['title should not be empty'],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
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
    ApiBody({
      type: CreateTodoDto,
      description: 'Todo creation data',
      examples: {
        example1: {
          summary: 'Basic todo',
          value: {
            title: 'Learn NestJS',
            description: 'Complete the NestJS tutorial',
          },
        },
        example2: {
          summary: 'Simple todo',
          value: {
            title: 'Buy groceries',
          },
        },
      },
    }),
    ApiBearerAuth('JWT-auth'),
  );

  static update = applyDecorators(
    ApiOperation({
      summary: 'Update a todo',
      description: 'Update an existing todo item (only by owner)',
      tags: ['Todos'],
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'Todo ID',
      type: 'string',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Todo successfully updated',
      schema: {
        type: 'object',
        properties: {
          todo: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              title: { type: 'string', example: 'Learn NestJS - Updated' },
              description: {
                type: 'string',
                example: 'Complete the NestJS tutorial and build a project',
              },
              status: {
                type: 'string',
                example: 'in-progress',
                enum: Object.values(TodoStatus),
              },
              ownerId: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
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
            example: ['title should not be empty'],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
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
    ApiResponse({
      status: 403,
      description: 'Forbidden - can only update own todos',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'You can only update your own todos',
          },
          error: { type: 'string', example: 'Forbidden' },
          statusCode: { type: 'number', example: 403 },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Todo not found',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Todo not found' },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
        },
      },
    }),
    ApiBody({
      type: UpdateTodoDto,
      description: 'Todo update data',
      examples: {
        example1: {
          summary: 'Update title and description',
          value: {
            title: 'Learn NestJS - Updated',
            description: 'Complete the NestJS tutorial and build a project',
          },
        },
        example2: {
          summary: 'Update status only',
          value: {
            status: 'in-progress',
          },
        },
        example3: {
          summary: 'Mark as completed',
          value: {
            status: 'done',
          },
        },
      },
    }),
    ApiBearerAuth('JWT-auth'),
  );

  static delete = applyDecorators(
    ApiOperation({
      summary: 'Delete a todo',
      description: 'Delete a todo item (only by owner or admin)',
      tags: ['Todos'],
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'Todo ID',
      type: 'string',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Todo successfully deleted',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
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
    ApiResponse({
      status: 403,
      description: 'Forbidden - can only delete own todos',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'You can only delete your own todos',
          },
          error: { type: 'string', example: 'Forbidden' },
          statusCode: { type: 'number', example: 403 },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Todo not found',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Todo not found' },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
        },
      },
    }),
    ApiBearerAuth('JWT-auth'),
  );

  static list = applyDecorators(
    ApiOperation({
      summary: 'List all todos',
      description:
        'Get all todos for the authenticated user (admin can see all)',
      tags: ['Todos'],
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Todos retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          todos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                title: { type: 'string', example: 'Learn NestJS' },
                description: {
                  type: 'string',
                  example: 'Complete the NestJS tutorial',
                },
                status: {
                  type: 'string',
                  example: 'pending',
                  enum: Object.values(TodoStatus),
                },
                ownerId: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011',
                },
              },
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
