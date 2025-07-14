# 🛠️ Utils Module - @resk/nest/utils

> **Essential utilities for NestJS application setup, Swagger documentation, and development tools**

## 📖 Overview

The Utils module provides a comprehensive set of utilities for @resk/nest applications, including application creation helpers, Swagger documentation setup, versioning support, and development tools that streamline the setup and configuration of NestJS applications.

---

## 🚀 Quick Start

### **Basic Application Setup**

```typescript
import { createApp } from '@resk/nest/utils';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createApp(AppModule, {
    globalPrefix: 'api',
    swaggerOptions: {
      enabled: true,
      title: 'My API',
      description: 'API documentation for my application',
      version: '1.0.0',
    },
    versioningOptions: {
      enabled: true,
    },
  });

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000/api/v1/swagger');
}

bootstrap();
```

### **Advanced Application Configuration**

```typescript
import { createApp } from '@resk/nest/utils';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await createApp<NestExpressApplication>(AppModule, {
    // Global prefix for all routes
    globalPrefix: 'api',
    
    // CORS configuration
    cors: {
      origin: ['http://localhost:3000', 'https://myapp.com'],
      credentials: true,
    },
    
    // Body parser configuration
    bodyParser: true,
    
    // Swagger documentation
    swaggerOptions: {
      enabled: process.env.NODE_ENV !== 'production',
      path: 'docs',
      title: 'My Application API',
      description: 'Comprehensive API documentation',
      version: '2.1.0',
      configMutator: (builder) => {
        return builder
          .addBearerAuth()
          .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
          .addServer('http://localhost:3000', 'Development')
          .addServer('https://api.myapp.com', 'Production');
      },
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
      },
    },
    
    // API versioning
    versioningOptions: {
      enabled: true,
      defaultVersion: '2',
      type: 'URI', // or 'HEADER', 'MEDIA_TYPE', 'CUSTOM'
    },
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Static assets (for web applications)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
```

---

## 🏗️ Core Functions

### **createApp Function**

```typescript
/**
 * Creates a NestJS application with optional Swagger and versioning
 */
export async function createApp<T extends INestApplication = INestApplication>(
  module: any,
  options?: ICreateNestAppOptions
): Promise<INestApplication<T>>;

// Configuration interface
interface ICreateNestAppOptions extends NestApplicationOptions {
  // Global prefix for all routes
  globalPrefix?: string;
  
  // Swagger documentation options
  swaggerOptions?: {
    enabled?: boolean;
    path?: string;
    title?: string;
    description?: string;
    version?: string;
    configMutator?: (builder: DocumentBuilder) => DocumentBuilder;
    documentOptions?: SwaggerDocumentOptions;
    swaggerOptions?: SwaggerCustomOptions;
    useGlobalPrefix?: boolean;
    customCssUrl?: string | string[];
    customJs?: string | string[];
  };
  
  // API versioning options
  versioningOptions?: {
    enabled?: boolean;
    type?: VersioningType;
    defaultVersion?: string | string[];
    header?: string;
    key?: string;
  };
}
```

### **setupSwagger Function**

```typescript
/**
 * Sets up Swagger documentation for a NestJS application
 */
export const setupSwagger = (
  app: INestApplication,
  swaggerOptions?: ICreateNestAppOptions['swaggerOptions']
): void;
```

---

## 📚 Swagger Documentation Setup

### **Basic Swagger Configuration**

```typescript
import { createApp } from '@resk/nest/utils';
import { AppModule } from './app.module';

const app = await createApp(AppModule, {
  swaggerOptions: {
    enabled: true,
    path: 'api-docs',
    title: 'My API',
    description: 'RESTful API for my application',
    version: '1.0.0',
  },
});

// Swagger will be available at: http://localhost:3000/api-docs
```

### **Advanced Swagger Configuration**

```typescript
import { DocumentBuilder } from '@nestjs/swagger';

const app = await createApp(AppModule, {
  swaggerOptions: {
    enabled: true,
    path: 'docs',
    title: 'E-Commerce API',
    description: 'Comprehensive e-commerce platform API',
    version: '2.1.0',
    
    // Advanced configuration using configMutator
    configMutator: (builder: DocumentBuilder) => {
      return builder
        // Authentication
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
          },
          'JWT-auth'
        )
        .addApiKey(
          {
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
            description: 'API key for external integrations',
          },
          'api-key'
        )
        
        // Servers
        .addServer('http://localhost:3000', 'Development Server')
        .addServer('https://api-staging.myapp.com', 'Staging Server')
        .addServer('https://api.myapp.com', 'Production Server')
        
        // Contact and license
        .setContact('API Support', 'https://myapp.com/support', 'support@myapp.com')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        
        // Terms of service
        .setTermsOfService('https://myapp.com/terms')
        
        // Tags
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('products', 'Product catalog')
        .addTag('orders', 'Order management')
        .addTag('admin', 'Administrative functions');
    },
    
    // Document options
    documentOptions: {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
      deepScanRoutes: true,
    },
    
    // Swagger UI options
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayOperationId: true,
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    },
    
    // Custom styling
    customCssUrl: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-flattop.css'
    ],
    
    // Use global prefix
    useGlobalPrefix: true,
  },
});
```

### **Environment-Based Swagger Setup**

```typescript
import { createApp } from '@resk/nest/utils';

const isDevelopment = process.env.NODE_ENV === 'development';
const isStaging = process.env.NODE_ENV === 'staging';

const app = await createApp(AppModule, {
  swaggerOptions: {
    // Only enable in development and staging
    enabled: isDevelopment || isStaging,
    
    path: isDevelopment ? 'docs' : 'internal/docs',
    title: process.env.APP_NAME || 'My API',
    description: 'API Documentation',
    version: process.env.APP_VERSION || '1.0.0',
    
    configMutator: (builder) => {
      const config = builder
        .setTitle(process.env.APP_NAME || 'My API')
        .setDescription(process.env.APP_DESCRIPTION || 'API Documentation')
        .setVersion(process.env.APP_VERSION || '1.0.0');
      
      // Add authentication only in non-development environments
      if (!isDevelopment) {
        config.addBearerAuth();
      }
      
      // Add servers based on environment
      if (isDevelopment) {
        config.addServer('http://localhost:3000', 'Development');
      } else if (isStaging) {
        config.addServer('https://api-staging.myapp.com', 'Staging');
      } else {
        config.addServer('https://api.myapp.com', 'Production');
      }
      
      return config;
    },
    
    swaggerOptions: {
      persistAuthorization: !isDevelopment,
    },
  },
});
```

---

## 🔄 API Versioning

### **URI Versioning (Default)**

```typescript
const app = await createApp(AppModule, {
  globalPrefix: 'api',
  versioningOptions: {
    enabled: true,
    type: VersioningType.URI,
    defaultVersion: '1',
  },
});

// Routes will be available at:
// http://localhost:3000/api/v1/users
// http://localhost:3000/api/v2/users
```

### **Header-Based Versioning**

```typescript
const app = await createApp(AppModule, {
  versioningOptions: {
    enabled: true,
    type: VersioningType.HEADER,
    header: 'X-Version',
    defaultVersion: '1',
  },
});

// Clients send: X-Version: 2
```

### **Media Type Versioning**

```typescript
const app = await createApp(AppModule, {
  versioningOptions: {
    enabled: true,
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
    defaultVersion: '1',
  },
});

// Clients send: Accept: application/json;v=2
```

### **Controller-Level Versioning**

```typescript
import { Controller, Get, Version } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  @Version('1')
  findAllV1() {
    return { version: '1', users: [] };
  }

  @Get()
  @Version('2')
  findAllV2() {
    return { version: '2', users: [], metadata: {} };
  }

  @Get()
  @Version(['1', '2'])
  findProfile() {
    return { profile: {} }; // Available in both versions
  }
}
```

---

## 🔧 Development Utilities

### **Environment Configuration Helper**

```typescript
import { createApp } from '@resk/nest/utils';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Environment-aware application setup
export async function createEnvironmentApp(AppModule: any) {
  return createApp(AppModule, {
    globalPrefix: process.env.GLOBAL_PREFIX || 'api',
    
    swaggerOptions: {
      enabled: process.env.SWAGGER_ENABLED === 'true',
      path: process.env.SWAGGER_PATH || 'docs',
      title: process.env.APP_NAME || 'API',
      description: process.env.APP_DESCRIPTION || 'API Documentation',
      version: process.env.APP_VERSION || '1.0.0',
    },
    
    versioningOptions: {
      enabled: process.env.VERSIONING_ENABLED === 'true',
      defaultVersion: process.env.DEFAULT_VERSION || '1',
    },
    
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || true,
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  });
}

// Usage
async function bootstrap() {
  const app = await createEnvironmentApp(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
```

### **Development vs Production Setup**

```typescript
import { createApp } from '@resk/nest/utils';
import { Logger } from '@nestjs/common';

async function createProductionApp(AppModule: any) {
  const app = await createApp(AppModule, {
    // Production settings
    logger: ['error', 'warn'], // Minimal logging
    
    swaggerOptions: {
      enabled: false, // Disable Swagger in production
    },
    
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
    },
  });

  // Production middleware
  app.use(helmet()); // Security headers
  app.use(compression()); // Response compression
  
  return app;
}

async function createDevelopmentApp(AppModule: any) {
  const app = await createApp(AppModule, {
    // Development settings
    logger: ['log', 'debug', 'error', 'verbose', 'warn'],
    
    swaggerOptions: {
      enabled: true,
      path: 'docs',
      title: 'Development API',
      description: 'API Documentation for Development',
      version: 'dev',
      swaggerOptions: {
        persistAuthorization: false, // Don't persist auth in dev
      },
    },
    
    cors: true, // Allow all origins in development
  });

  return app;
}

// Environment-based bootstrap
async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const app = isDevelopment 
    ? await createDevelopmentApp(AppModule)
    : await createProductionApp(AppModule);
  
  await app.listen(process.env.PORT || 3000);
}
```

### **Health Check and Metrics Setup**

```typescript
import { createApp } from '@resk/nest/utils';
import { HealthCheckModule, TerminusModule } from '@nestjs/terminus';

async function createMonitoredApp(AppModule: any) {
  const app = await createApp(AppModule, {
    swaggerOptions: {
      enabled: true,
      configMutator: (builder) => {
        return builder
          .addTag('health', 'Health check endpoints')
          .addTag('metrics', 'Application metrics');
      },
    },
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  return app;
}

// Health check controller
@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
```

---

## 📊 Custom Swagger Themes and Extensions

### **Custom Swagger Theme**

```typescript
const app = await createApp(AppModule, {
  swaggerOptions: {
    enabled: true,
    
    // Custom CSS for branding
    customCssUrl: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css'
    ],
    
    // Custom JavaScript for enhanced functionality
    customJs: [
      '/assets/swagger-extensions.js'
    ],
    
    swaggerOptions: {
      // Custom logo
      customSiteTitle: 'My Company API Docs',
      
      // Custom CSS to inject
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #2d5aa0; }
        .swagger-ui .scheme-container { display: none; }
      `,
    },
  },
});

// public/assets/swagger-extensions.js
window.onload = function() {
  // Add custom functionality to Swagger UI
  const ui = SwaggerUIBundle({
    // Custom configuration
    requestInterceptor: (request) => {
      // Add custom headers or modify requests
      request.headers['X-Client'] = 'SwaggerUI';
      return request;
    },
    
    responseInterceptor: (response) => {
      // Log or modify responses
      console.log('API Response:', response);
      return response;
    },
  });
};
```

### **Multi-Spec Swagger Setup**

```typescript
// For microservices or multi-module applications
export function setupMultiSpecSwagger(app: INestApplication) {
  // Main API documentation
  const mainConfig = new DocumentBuilder()
    .setTitle('Main API')
    .setDescription('Core application API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const mainDocument = SwaggerModule.createDocument(app, mainConfig, {
    include: [UsersModule, AuthModule],
  });
  SwaggerModule.setup('docs/main', app, mainDocument);

  // Admin API documentation
  const adminConfig = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Administrative functions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AdminModule],
  });
  SwaggerModule.setup('docs/admin', app, adminDocument);

  // Public API documentation
  const publicConfig = new DocumentBuilder()
    .setTitle('Public API')
    .setDescription('Public endpoints')
    .setVersion('1.0')
    .build();
  
  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [PublicModule],
  });
  SwaggerModule.setup('docs/public', app, publicDocument);
}
```

---

## 🔒 Security and Production Utilities

### **Security Headers and Middleware**

```typescript
import { createApp } from '@resk/nest/utils';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function createSecureApp(AppModule: any) {
  const app = await createApp(AppModule, {
    swaggerOptions: {
      enabled: process.env.NODE_ENV !== 'production',
    },
  });

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));

  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
  }));

  // Request size limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  return app;
}
```

### **Logging and Monitoring Setup**

```typescript
import { createApp } from '@resk/nest/utils';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

async function createMonitoredApp(AppModule: any) {
  // Winston logger configuration
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  });

  const app = await createApp(AppModule, {
    logger,
    swaggerOptions: {
      enabled: true,
      configMutator: (builder) => {
        return builder.addTag('monitoring', 'Application monitoring');
      },
    },
  });

  return app;
}
```

---

## 🎯 Best Practices

### **1. Application Structure**
```typescript
// ✅ Good: Environment-based configuration
const app = await createApp(AppModule, {
  swaggerOptions: {
    enabled: process.env.NODE_ENV !== 'production',
  },
});

// ✅ Good: Use descriptive Swagger documentation
configMutator: (builder) => {
  return builder
    .setTitle('E-Commerce API')
    .setDescription('Complete e-commerce platform API')
    .addBearerAuth();
}
```

### **2. Security**
```typescript
// ✅ Good: Disable Swagger in production
swaggerOptions: {
  enabled: process.env.NODE_ENV !== 'production',
}

// ✅ Good: Use environment variables for configuration
cors: {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}
```

### **3. Documentation**
```typescript
// ✅ Good: Comprehensive API documentation
configMutator: (builder) => {
  return builder
    .addBearerAuth()
    .addServer('https://api.myapp.com', 'Production')
    .setContact('Support', 'https://support.com', 'support@myapp.com');
}
```

---

The Utils module provides essential tools for creating, configuring, and documenting NestJS applications with best practices for development, staging, and production environments.
