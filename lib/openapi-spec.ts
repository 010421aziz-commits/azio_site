export const openapiSpec: Record<string, unknown> = {
  openapi: '3.0.3',
  info: {
    title: 'Quran Academy API',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'qa_token',
      },
    },

    schemas: {
      Teacher: {
        type: 'object',
        required: ['id', 'name', 'position', 'order', 'active', 'createdAt'],
        properties: {
          id:        { type: 'string' },
          name:      { type: 'string' },
          position:  { type: 'string' },
          bio:       { type: 'string' },
          image:     { type: 'string' },
          order:     { type: 'integer' },
          active:    { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      Program: {
        type: 'object',
        required: ['id', 'title', 'description', 'icon', 'topics', 'order', 'active'],
        properties: {
          id:          { type: 'string' },
          title:       { type: 'string' },
          description: { type: 'string' },
          icon:        { type: 'string' },
          topics:      { type: 'array', items: { type: 'string' } },
          order:       { type: 'integer' },
          active:      { type: 'boolean' },
        },
      },

      Gallery: {
        type: 'object',
        required: ['id', 'image', 'order', 'createdAt'],
        properties: {
          id:        { type: 'string' },
          image:     { type: 'string' },
          caption:   { type: 'string' },
          alt:       { type: 'string' },
          order:     { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      News: {
        type: 'object',
        required: ['id', 'title', 'slug', 'excerpt', 'content', 'published', 'createdAt'],
        properties: {
          id:          { type: 'string' },
          title:       { type: 'string' },
          slug:        { type: 'string' },
          excerpt:     { type: 'string' },
          content:     { type: 'string' },
          image:       { type: 'string' },
          published:   { type: 'boolean' },
          publishedAt: { type: 'string', format: 'date-time' },
          createdAt:   { type: 'string', format: 'date-time' },
        },
      },

      Contact: {
        type: 'object',
        required: ['id', 'address', 'phone', 'instagram', 'updatedAt'],
        properties: {
          id:        { type: 'string' },
          address:   { type: 'string' },
          phone:     { type: 'string' },
          instagram: { type: 'string' },
          mapUrl:    { type: 'string' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      Message: {
        type: 'object',
        required: ['id', 'name', 'phone', 'message', 'read', 'createdAt'],
        properties: {
          id:        { type: 'string' },
          name:      { type: 'string' },
          email:     { type: 'string' },
          phone:     { type: 'string' },
          message:   { type: 'string' },
          read:      { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      Setting: {
        type: 'object',
        required: ['id', 'key', 'value', 'updatedAt'],
        properties: {
          id:        { type: 'string' },
          key:       { type: 'string' },
          value:     { type: 'string' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },

  paths: {
    // ── Auth ────────────────────────────────────────────────────────────────
    '/login': {
      post: {
        summary: 'Admin login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email:    { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful — sets qa_token cookie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { ok: { type: 'boolean' } },
                },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/logout': {
      post: {
        summary: 'Admin logout',
        tags: ['Auth'],
        responses: {
          '200': {
            description: 'Logout successful — clears qa_token cookie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { ok: { type: 'boolean' } },
                },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Contact form ────────────────────────────────────────────────────────
    '/contact': {
      post: {
        summary: 'Submit contact form',
        tags: ['Contact'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'phone', 'message'],
                properties: {
                  name:    { type: 'string', minLength: 2, example: 'Aibek Asanov' },
                  email:   { type: 'string', format: 'email', example: 'aibek@example.com' },
                  phone:   { type: 'string', minLength: 6, example: '+996 555 123 456' },
                  message: { type: 'string', minLength: 10, example: 'I would like to learn more about the courses.' },
                },
              },
              example: {
                name: 'Aibek Asanov',
                email: 'aibek@example.com',
                phone: '+996 555 123 456',
                message: 'I would like to learn more about the courses.',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Message created',
            content: {
              'application/json': {
                schema: { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Contacts ────────────────────────────────────────────────────────────
    '/contacts': {
      get: {
        summary: 'Get contact info',
        tags: ['Contacts'],
        responses: {
          '200': {
            description: 'Contact record',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contact' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Upsert contact info',
        tags: ['Contacts'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  address:   { type: 'string' },
                  phone:     { type: 'string' },
                  instagram: { type: 'string' },
                  mapUrl:    { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated contact record',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contact' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Teachers ────────────────────────────────────────────────────────────
    '/teachers': {
      get: {
        summary: 'List active teachers',
        tags: ['Teachers'],
        responses: {
          '200': {
            description: 'Array of teachers ordered by `order`',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Teacher' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a teacher',
        tags: ['Teachers'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'position'],
                properties: {
                  name:     { type: 'string', minLength: 2, example: 'Ustaz Aibek' },
                  position: { type: 'string', minLength: 2, example: 'Quran teacher' },
                  bio:      { type: 'string' },
                  image:    { type: 'string' },
                  order:    { type: 'integer' },
                  active:   { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created teacher',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Teacher' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/teachers/{id}': {
      put: {
        summary: 'Update a teacher',
        tags: ['Teachers'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'position'],
                properties: {
                  name:     { type: 'string' },
                  position: { type: 'string' },
                  bio:      { type: 'string' },
                  image:    { type: 'string' },
                  order:    { type: 'integer' },
                  active:   { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated teacher',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Teacher' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Delete a teacher',
        tags: ['Teachers'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Programs ────────────────────────────────────────────────────────────
    '/programs': {
      get: {
        summary: 'List active programs',
        tags: ['Programs'],
        responses: {
          '200': {
            description: 'Array of programs ordered by `order`',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Program' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a program',
        tags: ['Programs'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'icon', 'topics'],
                properties: {
                  title:       { type: 'string', minLength: 2, example: 'Tajweed course' },
                  description: { type: 'string', minLength: 2, example: 'Learn Quran recitation.' },
                  icon:        { type: 'string', example: 'BookOpen' },
                  topics:      { type: 'array', items: { type: 'string' }, example: ['Makharij', 'Rules'] },
                  order:       { type: 'integer' },
                  active:      { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created program',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Program' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/programs/{id}': {
      put: {
        summary: 'Update a program',
        tags: ['Programs'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'icon', 'topics'],
                properties: {
                  title:       { type: 'string' },
                  description: { type: 'string' },
                  icon:        { type: 'string' },
                  topics:      { type: 'array', items: { type: 'string' } },
                  order:       { type: 'integer' },
                  active:      { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated program',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Program' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Delete a program',
        tags: ['Programs'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Gallery ─────────────────────────────────────────────────────────────
    '/gallery': {
      get: {
        summary: 'List gallery items',
        tags: ['Gallery'],
        responses: {
          '200': {
            description: 'Array of gallery records ordered by `order`',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Gallery' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a gallery item',
        tags: ['Gallery'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image:   { type: 'string' },
                  caption: { type: 'string' },
                  alt:     { type: 'string' },
                  order:   { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created gallery item',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Gallery' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/gallery/{id}': {
      put: {
        summary: 'Update a gallery item',
        tags: ['Gallery'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                required: ['image'],
                type: 'object',
                properties: {
                  image:   { type: 'string' },
                  caption: { type: 'string' },
                  alt:     { type: 'string' },
                  order:   { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated gallery item',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Gallery' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Delete a gallery item',
        tags: ['Gallery'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── News ─────────────────────────────────────────────────────────────────
    '/news': {
      get: {
        summary: 'List published news',
        tags: ['News'],
        responses: {
          '200': {
            description: 'Array of published news ordered by publishedAt desc',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/News' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a news article',
        tags: ['News'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'slug', 'excerpt', 'content'],
                properties: {
                  title:       { type: 'string', minLength: 3, example: 'New Quran course' },
                  slug:        { type: 'string', minLength: 3, pattern: '^[a-z0-9-]+$', example: 'new-quran-course' },
                  excerpt:     { type: 'string', minLength: 10, example: 'A short course introduction.' },
                  content:     { type: 'string', minLength: 20, example: 'Detailed information about this Quran course and its lessons.' },
                  image:       { type: 'string' },
                  published:   { type: 'boolean' },
                  publishedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created news article',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/News' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/news/{id}': {
      put: {
        summary: 'Update a news article',
        tags: ['News'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'slug', 'excerpt', 'content', 'published'],
                properties: {
                  title:       { type: 'string' },
                  slug:        { type: 'string' },
                  excerpt:     { type: 'string' },
                  content:     { type: 'string' },
                  image:       { type: 'string' },
                  published:   { type: 'boolean' },
                  publishedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated news article',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/News' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        summary: 'Delete a news article',
        tags: ['News'],
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
              },
            },
          },
          '400': { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Settings ─────────────────────────────────────────────────────────────
    '/settings': {
      get: {
        summary: 'Get all settings',
        tags: ['Settings'],
        responses: {
          '200': {
            description: 'All key-value setting pairs',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        summary: 'Upsert a setting by key',
        tags: ['Settings'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['key', 'value'],
                properties: {
                  key:   { type: 'string' },
                  value: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Upserted setting',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Setting' },
              },
            },
          },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ── Upload ───────────────────────────────────────────────────────────────
    '/upload': {
      post: {
        summary: 'Upload a file',
        tags: ['Upload'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'JPEG/PNG/WebP/AVIF, max 8 MB',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Uploaded file URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { url: { type: 'string' } },
                },
              },
            },
          },
          '400': { description: 'Invalid file or size exceeded', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};
