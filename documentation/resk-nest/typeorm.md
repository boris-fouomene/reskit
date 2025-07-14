# 🔗 TypeORM Module - @resk/nest/typeorm

> **SQL database integration with TypeORM for robust relational data management**

## 📖 Overview

The TypeORM module provides comprehensive SQL database integration for @resk/nest applications using TypeORM ORM. It offers resource services, data access layers, entity management, and transaction support for building scalable applications with PostgreSQL, MySQL, SQLite, and other SQL databases.

---

## 🚀 Quick Start

### **Installation & Setup**

```bash
npm install @resk/nest typeorm @nestjs/typeorm pg
# For other databases:
# npm install mysql2      # MySQL
# npm install sqlite3     # SQLite
# npm install mssql       # SQL Server
```

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmResourceModule } from '@resk/nest/typeorm';

@Module({
  imports: [
    TypeOrmResourceModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'myapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development
    }),
  ],
})
export class DatabaseModule {}
```

### **Basic Entity & Service**

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmResourceService } from '@resk/nest/typeorm';
import { DataSource } from 'typeorm';

// Define your entity
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Create resource service
@Injectable()
export class UserService extends TypeOrmResourceService<User> {
  constructor(@Inject('default') dataSource: DataSource) {
    super(dataSource, User);
  }
}

// Use in controller
@Controller('users')
export class UserController extends ResourceController<User> {
  constructor(userService: UserService) {
    super(userService);
  }
}
```

---

## 🏗️ Core Components

### **TypeOrmResourceService**

```typescript
/**
 * Resource service implementation for SQL databases using TypeORM
 */
export class TypeOrmResourceService<
  DataType extends IResourceData = any,
  PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey
> extends ResourceService<DataType, PrimaryKeyType> {
  
  readonly dataService: TypeOrmDataService<DataType, PrimaryKeyType>;
  
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly entity: IClassConstructor<DataType>
  );
  
  // Transaction support
  async executeInTransaction<ReturnType>(
    callback: (queryRunner: QueryRunner) => Promise<ReturnType>
  ): Promise<ReturnType>;
  
  // Inherited CRUD operations
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndPaginate(options?: IResourceQueryOptions<DataType>): Promise<IPaginatedResult<DataType>>;
  findOne(id: PrimaryKeyType): Promise<DataType | null>;
  create(data: Partial<DataType>): Promise<DataType>;
  update(id: PrimaryKeyType, data: Partial<DataType>): Promise<DataType>;
  delete(id: PrimaryKeyType): Promise<void>;
}
```

### **TypeOrmDataService**

```typescript
/**
 * Low-level data access service for SQL database operations
 */
export class TypeOrmDataService<
  DataType extends IResourceData = any,
  PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey
> implements IResourceDataService<DataType, PrimaryKeyType> {
  
  constructor(
    protected readonly dataSource: DataSource,
    readonly entity: IClassConstructor<DataType>
  );
  
  // Core data operations
  create(data: Partial<DataType>): Promise<DataType>;
  update(primaryKey: PrimaryKeyType, dataToUpdate: Partial<DataType>): Promise<DataType>;
  delete(primaryKey: PrimaryKeyType): Promise<void>;
  findOne(primaryKey: PrimaryKeyType): Promise<DataType | null>;
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndCount(options?: IResourceQueryOptions<DataType>): Promise<[DataType[], number]>;
  
  // Batch operations
  createMany(data: Partial<DataType>[]): Promise<DataType[]>;
  updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;
  deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;
  
  // Transaction support
  executeInTransaction<ReturnType>(
    callback: (queryRunner: QueryRunner) => Promise<ReturnType>
  ): Promise<ReturnType>;
  
  // Repository access
  getRepository(): Repository<DataType>;
  getManager(): EntityManager;
  getDataSource(): DataSource;
}
```

---

## 🎯 Entity Definition

### **Basic Entity Examples**

```typescript
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index,
  Check
} from 'typeorm';

// User entity with validation and constraints
@Entity('users')
@Index(['email']) // Single column index
@Index(['name', 'isActive']) // Composite index
@Check(`"age" >= 0 AND "age" <= 120`) // Database constraint
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: false 
  })
  name: string;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    unique: true,
    transformer: {
      to: (value: string) => value?.toLowerCase(),
      from: (value: string) => value
    }
  })
  email: string;

  @Column({ 
    type: 'int', 
    nullable: true,
    unsigned: true 
  })
  age?: number;

  @Column({ 
    type: 'enum',
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  })
  role: string;

  @Column({ 
    type: 'boolean', 
    default: true 
  })
  isActive: boolean;

  @Column({ 
    type: 'simple-array',
    nullable: true 
  })
  tags?: string[];

  @Column({ 
    type: 'json',
    nullable: true 
  })
  profile?: {
    bio?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### **Advanced Entity with Relations**

```typescript
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  RelationId
} from 'typeorm';

// Category entity
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Post, post => post.category)
  posts: Post[];
}

// Tag entity
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(() => Post, post => post.tags)
  posts: Post[];
}

// Post entity with relationships
@Entity('posts')
@Index(['authorId', 'status', 'publishedAt'])
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ 
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'int', default: 0, unsigned: true })
  views: number;

  // Many-to-One relationship with User
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @RelationId((post: Post) => post.author)
  authorId: number;

  // Many-to-One relationship with Category
  @ManyToOne(() => Category, category => category.posts)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @RelationId((post: Post) => post.category)
  categoryId: number;

  // Many-to-Many relationship with Tags
  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags: Tag[];

  // One-to-Many relationship with Comments
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Column({ 
    type: 'json',
    nullable: true 
  })
  metadata?: {
    readTime?: number;
    wordCount?: number;
    seoTitle?: string;
    seoDescription?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Comment entity
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((comment: Comment) => comment.user)
  userId: number;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @RelationId((comment: Comment) => comment.post)
  postId: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 🔍 Querying & Filtering

### **Basic Queries**

```typescript
@Injectable()
export class UserService extends TypeOrmResourceService<User> {
  
  // Find all active users
  async findActiveUsers(): Promise<User[]> {
    return this.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }
  
  // Find users with pagination
  async findUsersWithPagination(page: number = 1, limit: number = 10) {
    return this.findAndPaginate({
      page,
      limit,
      order: { createdAt: 'DESC' }
    });
  }
  
  // Find users by age range
  async findUsersByAge(minAge: number, maxAge: number): Promise<User[]> {
    const repository = this.getDataService().getRepository();
    
    return repository.find({
      where: {
        age: MoreThanOrEqual(minAge) && LessThanOrEqual(maxAge),
        isActive: true
      },
      order: { age: 'ASC' }
    });
  }
  
  // Search users by name or email
  async searchUsers(query: string): Promise<User[]> {
    const repository = this.getDataService().getRepository();
    
    return repository.find({
      where: [
        { name: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) }
      ],
      take: 20
    });
  }
  
  // Find users with custom SQL
  async findUsersByCustomQuery(minAge: number): Promise<User[]> {
    const repository = this.getDataService().getRepository();
    
    return repository
      .createQueryBuilder('user')
      .where('user.age >= :minAge', { minAge })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .orderBy('user.name', 'ASC')
      .getMany();
  }
}
```

### **Advanced Queries with Relations**

```typescript
@Injectable()
export class PostService extends TypeOrmResourceService<Post> {
  
  // Find posts with author and category
  async findPostsWithRelations(options?: IResourceQueryOptions<Post>): Promise<Post[]> {
    const repository = this.getDataService().getRepository();
    
    return repository.find({
      ...options,
      relations: ['author', 'category', 'tags', 'comments'],
      order: { createdAt: 'DESC' }
    });
  }
  
  // Get posts by author with statistics
  async findPostsByAuthor(authorId: number): Promise<{
    posts: Post[];
    totalViews: number;
    averageViews: number;
  }> {
    const repository = this.getDataService().getRepository();
    
    const posts = await repository.find({
      where: { authorId },
      relations: ['category', 'tags'],
      order: { publishedAt: 'DESC' }
    });
    
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const averageViews = posts.length ? totalViews / posts.length : 0;
    
    return { posts, totalViews, averageViews };
  }
  
  // Complex query with QueryBuilder
  async getTrendingPosts(days: number = 7): Promise<Post[]> {
    const repository = this.getDataService().getRepository();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', { status: 'published' })
      .andWhere('post.publishedAt >= :startDate', { startDate })
      .orderBy('post.views', 'DESC')
      .addOrderBy('post.publishedAt', 'DESC')
      .take(20)
      .getMany();
  }
  
  // Aggregation queries
  async getPostStatistics(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    byCategory: Array<{ categoryName: string; count: number }>;
    topAuthors: Array<{ authorName: string; postCount: number }>;
  }> {
    const repository = this.getDataService().getRepository();
    
    const [
      total,
      published,
      draft,
      archived,
      byCategory,
      topAuthors
    ] = await Promise.all([
      repository.count(),
      repository.count({ where: { status: 'published' } }),
      repository.count({ where: { status: 'draft' } }),
      repository.count({ where: { status: 'archived' } }),
      
      // Posts by category
      repository
        .createQueryBuilder('post')
        .leftJoin('post.category', 'category')
        .select('category.name', 'categoryName')
        .addSelect('COUNT(post.id)', 'count')
        .groupBy('category.id')
        .orderBy('count', 'DESC')
        .getRawMany(),
      
      // Top authors by post count
      repository
        .createQueryBuilder('post')
        .leftJoin('post.author', 'author')
        .select('author.name', 'authorName')
        .addSelect('COUNT(post.id)', 'postCount')
        .where('post.status = :status', { status: 'published' })
        .groupBy('author.id')
        .orderBy('postCount', 'DESC')
        .limit(10)
        .getRawMany()
    ]);
    
    return {
      total,
      published,
      draft,
      archived,
      byCategory,
      topAuthors
    };
  }
  
  // Full-text search (PostgreSQL specific)
  async searchPosts(query: string): Promise<Post[]> {
    const repository = this.getDataService().getRepository();
    
    return repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .where(
        'to_tsvector(\'english\', post.title || \' \' || post.content) @@ plainto_tsquery(\'english\', :query)',
        { query }
      )
      .andWhere('post.status = :status', { status: 'published' })
      .orderBy('post.publishedAt', 'DESC')
      .getMany();
  }
}
```

---

## 💾 Transaction Support

### **Basic Transactions**

```typescript
@Injectable()
export class UserService extends TypeOrmResourceService<User> {
  
  async transferUserData(fromUserId: number, toUserId: number): Promise<void> {
    return this.executeInTransaction(async (queryRunner) => {
      const userRepository = queryRunner.manager.getRepository(User);
      
      // Get both users
      const fromUser = await userRepository.findOne({ where: { id: fromUserId } });
      const toUser = await userRepository.findOne({ where: { id: toUserId } });
      
      if (!fromUser || !toUser) {
        throw new NotFoundException('User not found');
      }
      
      // Perform data transfer operations
      await userRepository.update(
        fromUserId,
        { isActive: false, transferredTo: toUserId }
      );
      
      await userRepository.increment(
        { id: toUserId },
        'dataTransfers',
        1
      );
      
      // Log the transfer
      await this.auditService.logTransfer(fromUserId, toUserId, queryRunner);
    });
  }
  
  async createUserWithProfile(
    userData: CreateUserDto, 
    profileData: CreateProfileDto
  ): Promise<User> {
    return this.executeInTransaction(async (queryRunner) => {
      const userRepository = queryRunner.manager.getRepository(User);
      const profileRepository = queryRunner.manager.getRepository(Profile);
      
      // Create user first
      const user = userRepository.create(userData);
      const savedUser = await queryRunner.manager.save(user);
      
      // Create profile with user reference
      const profile = profileRepository.create({
        ...profileData,
        userId: savedUser.id
      });
      await queryRunner.manager.save(profile);
      
      // Update user with profile flag
      await userRepository.update(savedUser.id, { hasProfile: true });
      
      return userRepository.findOne({ 
        where: { id: savedUser.id },
        relations: ['profile']
      });
    });
  }
}
```

### **Complex Multi-Table Transactions**

```typescript
@Injectable()
export class OrderService extends TypeOrmResourceService<Order> {
  constructor(
    @Inject('default') dataSource: DataSource,
    private userService: UserService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private emailService: EmailService
  ) {
    super(dataSource, Order);
  }
  
  async processOrder(orderData: CreateOrderDto): Promise<Order> {
    return this.executeInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const productRepo = queryRunner.manager.getRepository(Product);
      const inventoryRepo = queryRunner.manager.getRepository(Inventory);
      const orderRepo = queryRunner.manager.getRepository(Order);
      const orderItemRepo = queryRunner.manager.getRepository(OrderItem);
      
      // 1. Validate user
      const user = await userRepo.findOne({ where: { id: orderData.userId } });
      if (!user || !user.isActive) {
        throw new BadRequestException('Invalid user');
      }
      
      // 2. Validate and reserve products
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of orderData.items) {
        // Check product exists and is available
        const product = await productRepo.findOne({ 
          where: { id: item.productId } 
        });
        
        if (!product || !product.isActive) {
          throw new BadRequestException(`Product ${item.productId} not available`);
        }
        
        // Check inventory using optimistic locking
        const inventory = await inventoryRepo.findOne({
          where: { productId: item.productId },
          lock: { mode: 'pessimistic_write' } // Prevents race conditions
        });
        
        if (!inventory || inventory.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
        
        // Reserve inventory
        await inventoryRepo.update(
          { productId: item.productId },
          { 
            quantity: () => `quantity - ${item.quantity}`,
            reserved: () => `reserved + ${item.quantity}`
          }
        );
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          productId: item.productId,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        });
      }
      
      // 3. Create order
      const order = orderRepo.create({
        userId: orderData.userId,
        totalAmount,
        status: 'confirmed',
        shippingAddress: orderData.shippingAddress
      });
      const savedOrder = await queryRunner.manager.save(order);
      
      // 4. Create order items
      const orderItemEntities = orderItems.map(item => 
        orderItemRepo.create({
          ...item,
          orderId: savedOrder.id
        })
      );
      await queryRunner.manager.save(orderItemEntities);
      
      // 5. Update user statistics
      await userRepo.increment(
        { id: orderData.userId },
        'totalOrders',
        1
      );
      
      await userRepo.update(
        orderData.userId,
        { 
          totalSpent: () => `totalSpent + ${totalAmount}`,
          lastOrderAt: new Date()
        }
      );
      
      // 6. Send confirmation email (non-transactional)
      setImmediate(async () => {
        try {
          await this.emailService.sendOrderConfirmation(user.email, savedOrder);
        } catch (error) {
          console.error('Failed to send order confirmation:', error);
        }
      });
      
      return orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'user']
      });
    });
  }
  
  async cancelOrder(orderId: number, reason: string): Promise<Order> {
    return this.executeInTransaction(async (queryRunner) => {
      const orderRepo = queryRunner.manager.getRepository(Order);
      const inventoryRepo = queryRunner.manager.getRepository(Inventory);
      const userRepo = queryRunner.manager.getRepository(User);
      
      // Get order with items
      const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: ['items']
      });
      
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      if (order.status !== 'confirmed') {
        throw new BadRequestException('Order cannot be cancelled');
      }
      
      // Restore inventory for each item
      for (const item of order.items) {
        await inventoryRepo.update(
          { productId: item.productId },
          {
            quantity: () => `quantity + ${item.quantity}`,
            reserved: () => `reserved - ${item.quantity}`
          }
        );
      }
      
      // Update order status
      await orderRepo.update(orderId, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date()
      });
      
      // Update user statistics
      await userRepo.update(order.userId, {
        totalOrders: () => 'totalOrders - 1',
        totalSpent: () => `totalSpent - ${order.totalAmount}`,
        cancelledOrders: () => 'cancelledOrders + 1'
      });
      
      return orderRepo.findOne({
        where: { id: orderId },
        relations: ['items', 'user']
      });
    });
  }
}
```

---

## 🚀 Performance Optimization

### **Database Indexing**

```typescript
// Entity with optimized indexes
@Entity('users')
@Index(['email']) // Unique queries
@Index(['name', 'isActive']) // Composite searches
@Index(['createdAt']) // Date-based sorting
@Index(['role', 'isActive', 'createdAt']) // Complex filtering
export class User {
  // ... entity definition
}

// Advanced indexing strategies
@Entity('posts')
@Index('IDX_POSTS_AUTHOR_STATUS', ['authorId', 'status', 'publishedAt'])
@Index('IDX_POSTS_CATEGORY_VIEWS', ['categoryId', 'views'])
@Index('IDX_POSTS_FULL_TEXT', { synchronize: false }) // Custom index
export class Post {
  // ... entity definition
}

// Create custom indexes in migrations
export class CreateCustomIndexes implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Full-text search index (PostgreSQL)
    await queryRunner.query(`
      CREATE INDEX "IDX_POSTS_FULL_TEXT" ON "posts" 
      USING gin(to_tsvector('english', title || ' ' || content))
    `);
    
    // Partial index for active records only
    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_ACTIVE_EMAIL" ON "users" (email) 
      WHERE "isActive" = true
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_POSTS_FULL_TEXT"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_ACTIVE_EMAIL"`);
  }
}
```

### **Query Optimization**

```typescript
@Injectable()
export class OptimizedUserService extends TypeOrmResourceService<User> {
  
  // Use select for specific fields
  async findUsersForListing(): Promise<Partial<User>[]> {
    const repository = this.getDataService().getRepository();
    
    return repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.createdAt'])
      .where('user.isActive = :isActive', { isActive: true })
      .orderBy('user.createdAt', 'DESC')
      .limit(100)
      .getMany();
  }
  
  // Efficient eager loading
  async findUsersWithPosts(): Promise<User[]> {
    const repository = this.getDataService().getRepository();
    
    return repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post', 'post.status = :status', { status: 'published' })
      .leftJoinAndSelect('post.category', 'category')
      .where('user.isActive = :isActive', { isActive: true })
      .orderBy('user.name', 'ASC')
      .addOrderBy('post.publishedAt', 'DESC')
      .getMany();
  }
  
  // Batch loading to avoid N+1 problems
  async loadUserPostCounts(userIds: number[]): Promise<Map<number, number>> {
    const repository = this.getDataService().getRepository();
    
    const results = await repository
      .createQueryBuilder('user')
      .leftJoin('user.posts', 'post', 'post.status = :status', { status: 'published' })
      .select('user.id', 'userId')
      .addSelect('COUNT(post.id)', 'postCount')
      .where('user.id IN (:...userIds)', { userIds })
      .groupBy('user.id')
      .getRawMany();
    
    return new Map(
      results.map(r => [parseInt(r.userId), parseInt(r.postCount)])
    );
  }
  
  // Cursor-based pagination for large datasets
  async findUsersCursor(
    lastId?: number,
    limit: number = 20
  ): Promise<{ users: User[]; hasMore: boolean; nextCursor?: number }> {
    const repository = this.getDataService().getRepository();
    
    const queryBuilder = repository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .orderBy('user.id', 'ASC')
      .limit(limit + 1);
    
    if (lastId) {
      queryBuilder.andWhere('user.id > :lastId', { lastId });
    }
    
    const users = await queryBuilder.getMany();
    const hasMore = users.length > limit;
    
    if (hasMore) {
      users.pop(); // Remove the extra item
    }
    
    const nextCursor = hasMore && users.length > 0 
      ? users[users.length - 1].id
      : undefined;
    
    return { users, hasMore, nextCursor };
  }
  
  // Bulk operations for efficiency
  async bulkUpdateUsers(updates: Array<{ id: number; data: Partial<User> }>): Promise<void> {
    const repository = this.getDataService().getRepository();
    
    // Group updates by similar data to minimize queries
    const updateGroups = new Map<string, Array<{ id: number; data: Partial<User> }>>();
    
    updates.forEach(update => {
      const key = JSON.stringify(Object.keys(update.data).sort());
      if (!updateGroups.has(key)) {
        updateGroups.set(key, []);
      }
      updateGroups.get(key)!.push(update);
    });
    
    // Execute bulk updates
    await Promise.all(
      Array.from(updateGroups.values()).map(async (group) => {
        const ids = group.map(item => item.id);
        const sampleData = group[0].data;
        
        // For identical updates, use a single query
        if (group.every(item => JSON.stringify(item.data) === JSON.stringify(sampleData))) {
          await repository.update(ids, sampleData);
        } else {
          // For different updates, use QueryBuilder with CASE statements
          let query = repository.createQueryBuilder().update(User);
          
          Object.keys(sampleData).forEach(key => {
            const caseStatement = group
              .map(item => `WHEN id = ${item.id} THEN '${item.data[key]}'`)
              .join(' ');
            
            query = query.set({
              [key]: () => `CASE ${caseStatement} ELSE ${key} END`
            });
          });
          
          await query.where('id IN (:...ids)', { ids }).execute();
        }
      })
    );
  }
}
```

---

## 🔧 Multi-Database Configuration

### **Multiple Database Setup**

```typescript
@Module({
  imports: [
    // Main application database
    TypeOrmResourceModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'app_user',
      password: 'app_password',
      database: 'main_db',
      entities: [User, Post, Category],
      synchronize: false,
      migrations: ['dist/migrations/main/*.js'],
      logging: ['error', 'warn'],
    }),
    
    // Analytics database (read-only)
    TypeOrmResourceModule.forRoot({
      name: 'analytics',
      type: 'postgres',
      host: 'analytics-db.example.com',
      port: 5432,
      username: 'analytics_user',
      password: 'analytics_password',
      database: 'analytics_db',
      entities: [AnalyticsEvent, UserSession],
      synchronize: false,
      extra: {
        max: 5, // Smaller connection pool for analytics
      },
    }),
    
    // Logging database (write-heavy)
    TypeOrmResourceModule.forRoot({
      name: 'logs',
      type: 'postgres',
      host: 'logs-db.example.com',
      port: 5432,
      username: 'logs_user',
      password: 'logs_password',
      database: 'logs_db',
      entities: [AuditLog, ErrorLog],
      synchronize: false,
      extra: {
        max: 10, // Larger pool for write-heavy operations
      },
    }),
  ],
})
export class DatabaseModule {}

// Service using specific database
@Injectable()
export class UserService extends TypeOrmResourceService<User> {
  constructor(@Inject('default') dataSource: DataSource) {
    super(dataSource, User);
  }
}

@Injectable()
export class AnalyticsService extends TypeOrmResourceService<AnalyticsEvent> {
  constructor(@Inject('analytics') dataSource: DataSource) {
    super(dataSource, AnalyticsEvent);
  }
}

@Injectable()
export class AuditService extends TypeOrmResourceService<AuditLog> {
  constructor(@Inject('logs') dataSource: DataSource) {
    super(dataSource, AuditLog);
  }
}
```

### **Database Health Monitoring**

```typescript
@Injectable()
export class DatabaseHealthService {
  constructor(
    @Inject('default') private defaultDataSource: DataSource,
    @Inject('analytics') private analyticsDataSource: DataSource,
    @Inject('logs') private logsDataSource: DataSource
  ) {}
  
  async checkHealth(): Promise<{
    default: { status: string; responseTime: number; activeConnections: number };
    analytics: { status: string; responseTime: number; activeConnections: number };
    logs: { status: string; responseTime: number; activeConnections: number };
  }> {
    const [defaultHealth, analyticsHealth, logsHealth] = await Promise.all([
      this.checkDataSourceHealth(this.defaultDataSource, 'default'),
      this.checkDataSourceHealth(this.analyticsDataSource, 'analytics'),
      this.checkDataSourceHealth(this.logsDataSource, 'logs')
    ]);
    
    return { 
      default: defaultHealth, 
      analytics: analyticsHealth, 
      logs: logsHealth 
    };
  }
  
  private async checkDataSourceHealth(dataSource: DataSource, name: string): Promise<{
    status: string;
    responseTime: number;
    activeConnections: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Test database connectivity
      await dataSource.query('SELECT 1');
      
      // Get connection pool info
      const poolInfo = dataSource.driver.pool;
      const activeConnections = poolInfo?.totalCount || 0;
      
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        activeConnections
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        activeConnections: 0
      };
    }
  }
  
  async getSlowQueries(threshold: number = 1000): Promise<any[]> {
    // PostgreSQL specific - get slow queries
    try {
      const result = await this.defaultDataSource.query(`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          min_time,
          max_time
        FROM pg_stat_statements 
        WHERE mean_time > $1
        ORDER BY mean_time DESC
        LIMIT 20
      `, [threshold]);
      
      return result;
    } catch (error) {
      console.warn('Could not fetch slow queries:', error.message);
      return [];
    }
  }
}
```

---

## 🎯 Best Practices

### **1. Entity Design**
```typescript
// ✅ Good: Use appropriate column types and constraints
@Entity('users')
export class User {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  
  @Column({ type: 'int', unsigned: true, nullable: true })
  age?: number;
  
  @CreateDateColumn()
  createdAt: Date;
}

// ✅ Good: Add proper indexes for query performance
@Index(['email'])
@Index(['name', 'isActive'])
export class User { /* ... */ }
```

### **2. Query Optimization**
```typescript
// ✅ Good: Use QueryBuilder for complex queries
const users = await repository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .where('user.isActive = :isActive', { isActive: true })
  .getMany();

// ✅ Good: Select only needed fields
const users = await repository
  .createQueryBuilder('user')
  .select(['user.id', 'user.name', 'user.email'])
  .getMany();
```

### **3. Transaction Usage**
```typescript
// ✅ Good: Use transactions for multi-operation consistency
await this.executeInTransaction(async (queryRunner) => {
  await queryRunner.manager.save(entity1);
  await queryRunner.manager.update(Entity2, criteria, data);
});

// ❌ Avoid: Unnecessary transactions for single operations
// Single operations are already atomic
```

---

The TypeORM module provides a complete, production-ready SQL database integration with advanced querying capabilities, transaction support, and performance optimizations for enterprise applications.
