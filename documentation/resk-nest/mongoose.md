# 🍃 Mongoose Module - @resk/nest/mongoose

> **MongoDB integration with Mongoose ODM for seamless data access**

## 📖 Overview

The Mongoose module provides complete MongoDB integration for @resk/nest applications using Mongoose ODM. It offers resource services, data access layers, connection management, and transaction support for building scalable MongoDB-based applications.

---

## 🚀 Quick Start

### **Installation & Setup**

```bash
npm install @resk/nest mongoose @types/mongoose
```

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@resk/nest/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
})
export class AppModule {}
```

### **Basic Resource Service**

```typescript
import { Injectable } from '@nestjs/common';
import { MongooseResourceService } from '@resk/nest/mongoose';
import { Connection, Schema, Types } from 'mongoose';

// Define your data interface
interface User {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema
const UserSchema = new Schema<User>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 0, max: 120 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create resource service
@Injectable()
export class UserService extends MongooseResourceService<User> {
  constructor(connection: Connection) {
    super(connection, 'User', UserSchema);
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

### **MongooseResourceService**

```typescript
/**
 * Resource service implementation for MongoDB using Mongoose
 */
export class MongooseResourceService<
  DataType extends IDatabaseRecordType = any,
  PrimaryKeyType extends IResourcePrimaryKey = ObjectId
> extends ResourceService<DataType, PrimaryKeyType> {
  
  readonly dataService: MongooseDataService<DataType, PrimaryKeyType>;
  
  constructor(
    protected readonly connection: Connection,
    protected readonly schemaName: string, 
    protected readonly schema: Schema
  );
  
  // Transaction support
  async executeInTransaction<ReturnType>(
    callback: (session: ClientSession) => Promise<ReturnType>
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

### **MongooseDataService**

```typescript
/**
 * Low-level data access service for MongoDB operations
 */
export class MongooseDataService<
  DataType extends IDatabaseRecordType = any,
  PrimaryKeyType extends IResourcePrimaryKey = ObjectId
> implements IResourceDataService<DataType, PrimaryKeyType> {
  
  constructor(
    protected readonly connection: Connection,
    protected readonly schemaName: string,
    protected readonly schema: Schema
  );
  
  // Core data operations
  create(record: Partial<DataType>): Promise<DataType>;
  update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
  delete(primaryKey: PrimaryKeyType): Promise<void>;
  findOne(primaryKey: PrimaryKeyType): Promise<DataType | null>;
  findMany(options: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndCount(options: IResourceQueryOptions<DataType>): Promise<IResourcePaginatedResult<DataType>>;
  
  // Transaction support
  executeInTransaction<ReturnType>(
    callback: (session: ClientSession) => Promise<ReturnType>
  ): Promise<ReturnType>;
  
  // Query building
  buildFindOptions(
    options: PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>
  ): Omit<IResourceQueryOptions<DataType>, "where"> & { where?: FilterQuery<DataType> };
}
```

---

## 🔧 Schema Definition

### **Basic Schema Examples**

```typescript
import { Schema, Types } from 'mongoose';

// User schema with validation
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  profile: {
    bio: String,
    avatar: String,
    social: {
      twitter: String,
      linkedin: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ name: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Add middleware for automatic updatedAt
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});
```

### **Advanced Schema with References**

```typescript
// Post schema with user reference
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    readTime: Number,
    wordCount: Number,
    seoTitle: String,
    seoDescription: String
  }
}, {
  timestamps: true
});

// Virtual for like count
PostSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
PostSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Include virtuals in JSON output
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });
```

---

## 🔍 Querying & Filtering

### **Basic Queries**

```typescript
@Injectable()
export class UserService extends MongooseResourceService<User> {
  
  // Find all active users
  async findActiveUsers(): Promise<User[]> {
    return this.find({
      where: { isActive: true },
      sort: 'name'
    });
  }
  
  // Find users with pagination
  async findUsersWithPagination(page: number = 1, limit: number = 10) {
    return this.findAndPaginate({
      page,
      limit,
      sort: '-createdAt'
    });
  }
  
  // Find users by age range
  async findUsersByAge(minAge: number, maxAge: number): Promise<User[]> {
    return this.find({
      where: {
        age: { $gte: minAge, $lte: maxAge },
        isActive: true
      },
      sort: 'age'
    });
  }
  
  // Search users by name or email
  async searchUsers(query: string): Promise<User[]> {
    return this.find({
      where: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      },
      limit: 20
    });
  }
}
```

### **Advanced Queries with Aggregation**

```typescript
@Injectable()
export class PostService extends MongooseResourceService<Post> {
  
  // Get posts with author information
  async findPostsWithAuthors(options?: IResourceQueryOptions<Post>): Promise<Post[]> {
    const model = this.getDataService().getModel();
    
    return model.find(options?.where || {})
      .populate('author', 'name email')
      .populate('category', 'name description')
      .sort(options?.sort || '-createdAt')
      .limit(options?.limit || 10)
      .skip(options?.skip || 0)
      .exec();
  }
  
  // Get post statistics
  async getPostStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    byCategory: Array<{ _id: string; count: number }>;
    topAuthors: Array<{ _id: string; name: string; postCount: number }>;
  }> {
    const model = this.getDataService().getModel();
    
    const [
      total,
      published,
      draft,
      archived,
      byCategory,
      topAuthors
    ] = await Promise.all([
      model.countDocuments(),
      model.countDocuments({ status: 'published' }),
      model.countDocuments({ status: 'draft' }),
      model.countDocuments({ status: 'archived' }),
      
      // Posts by category
      model.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Top authors by post count
      model.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$author', postCount: { $sum: 1 } } },
        { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorInfo'
        }},
        { $unwind: '$authorInfo' },
        { $project: {
          _id: 1,
          name: '$authorInfo.name',
          postCount: 1
        }},
        { $sort: { postCount: -1 } },
        { $limit: 10 }
      ])
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
  
  // Get trending posts (by views and recent likes)
  async getTrendingPosts(days: number = 7): Promise<Post[]> {
    const model = this.getDataService().getModel();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return model.aggregate([
      {
        $match: {
          status: 'published',
          publishedAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
          recentLikes: {
            $size: {
              $filter: {
                input: '$likes',
                cond: { $gte: ['$$this.createdAt', startDate] }
              }
            }
          },
          trendScore: {
            $add: [
              '$views',
              { $multiply: ['$recentLikes', 5] } // Weight recent likes more
            ]
          }
        }
      },
      { $sort: { trendScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' }
    ]);
  }
}
```

---

## 💾 Transaction Support

### **Basic Transactions**

```typescript
@Injectable()
export class UserService extends MongooseResourceService<User> {
  
  async transferUserData(fromUserId: string, toUserId: string): Promise<void> {
    return this.executeInTransaction(async (session) => {
      // Get both users
      const fromUser = await this.getDataService().getModel()
        .findById(fromUserId)
        .session(session);
      
      const toUser = await this.getDataService().getModel()
        .findById(toUserId)
        .session(session);
      
      if (!fromUser || !toUser) {
        throw new NotFoundException('User not found');
      }
      
      // Perform data transfer operations
      await this.getDataService().getModel()
        .updateOne(
          { _id: fromUserId },
          { $set: { isActive: false, transferredTo: toUserId } },
          { session }
        );
      
      await this.getDataService().getModel()
        .updateOne(
          { _id: toUserId },
          { $inc: { dataTransfers: 1 } },
          { session }
        );
      
      // Log the transfer
      await this.auditService.logTransfer(fromUserId, toUserId, session);
    });
  }
  
  async createUserWithProfile(userData: CreateUserDto, profileData: CreateProfileDto): Promise<User> {
    return this.executeInTransaction(async (session) => {
      // Create user first
      const user = await this.getDataService().getModel()
        .create([userData], { session });
      
      // Create profile with user reference
      await this.profileService.getDataService().getModel()
        .create([{
          ...profileData,
          userId: user[0]._id
        }], { session });
      
      // Update user with profile reference
      const updatedUser = await this.getDataService().getModel()
        .findByIdAndUpdate(
          user[0]._id,
          { hasProfile: true },
          { new: true, session }
        );
      
      return updatedUser;
    });
  }
}
```

### **Complex Multi-Collection Transactions**

```typescript
@Injectable()
export class OrderService extends MongooseResourceService<Order> {
  constructor(
    connection: Connection,
    private userService: UserService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private emailService: EmailService
  ) {
    super(connection, 'Order', OrderSchema);
  }
  
  async processOrder(orderData: CreateOrderDto): Promise<Order> {
    return this.executeInTransaction(async (session) => {
      // 1. Validate user
      const user = await this.userService.getDataService().getModel()
        .findById(orderData.userId)
        .session(session);
      
      if (!user || !user.isActive) {
        throw new BadRequestException('Invalid user');
      }
      
      // 2. Validate and reserve products
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of orderData.items) {
        // Check product exists and is available
        const product = await this.productService.getDataService().getModel()
          .findById(item.productId)
          .session(session);
        
        if (!product || !product.isActive) {
          throw new BadRequestException(`Product ${item.productId} not available`);
        }
        
        // Check inventory
        const inventory = await this.inventoryService.getDataService().getModel()
          .findOne({ productId: item.productId })
          .session(session);
        
        if (!inventory || inventory.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
        
        // Reserve inventory
        await this.inventoryService.getDataService().getModel()
          .updateOne(
            { productId: item.productId },
            { 
              $inc: { 
                quantity: -item.quantity,
                reserved: item.quantity 
              }
            },
            { session }
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
      const order = await this.getDataService().getModel()
        .create([{
          ...orderData,
          items: orderItems,
          totalAmount,
          status: 'confirmed',
          createdAt: new Date()
        }], { session });
      
      // 4. Update user order history
      await this.userService.getDataService().getModel()
        .updateOne(
          { _id: orderData.userId },
          { 
            $inc: { totalOrders: 1, totalSpent: totalAmount },
            $push: { recentOrders: order[0]._id }
          },
          { session }
        );
      
      // 5. Send confirmation email (non-transactional)
      setImmediate(async () => {
        try {
          await this.emailService.sendOrderConfirmation(user.email, order[0]);
        } catch (error) {
          console.error('Failed to send order confirmation:', error);
        }
      });
      
      return order[0];
    });
  }
  
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    return this.executeInTransaction(async (session) => {
      // Get order
      const order = await this.getDataService().getModel()
        .findById(orderId)
        .session(session);
      
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      if (order.status !== 'confirmed') {
        throw new BadRequestException('Order cannot be cancelled');
      }
      
      // Restore inventory
      for (const item of order.items) {
        await this.inventoryService.getDataService().getModel()
          .updateOne(
            { productId: item.productId },
            { 
              $inc: { 
                quantity: item.quantity,
                reserved: -item.quantity 
              }
            },
            { session }
          );
      }
      
      // Update order status
      const updatedOrder = await this.getDataService().getModel()
        .findByIdAndUpdate(
          orderId,
          { 
            status: 'cancelled',
            cancellationReason: reason,
            cancelledAt: new Date()
          },
          { new: true, session }
        );
      
      // Update user stats
      await this.userService.getDataService().getModel()
        .updateOne(
          { _id: order.userId },
          { 
            $inc: { 
              totalOrders: -1,
              totalSpent: -order.totalAmount,
              cancelledOrders: 1
            }
          },
          { session }
        );
      
      return updatedOrder;
    });
  }
}
```

---

## 🚀 Performance Optimization

### **Indexing Strategies**

```typescript
// User schema with performance indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'profile.bio': 'text', name: 'text' }); // Text search

// Post schema with compound indexes
PostSchema.index({ author: 1, status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1, views: -1 });
PostSchema.index({ tags: 1, status: 1 });
PostSchema.index({ title: 'text', content: 'text' }); // Full-text search

// Geospatial index for location-based queries
LocationSchema.index({ location: '2dsphere' });

@Injectable()
export class DatabaseIndexService {
  constructor(private connection: Connection) {}
  
  async createIndexes(): Promise<void> {
    const collections = await this.connection.db.collections();
    
    for (const collection of collections) {
      const indexes = await collection.indexes();
      console.log(`${collection.collectionName} indexes:`, indexes);
    }
  }
  
  async analyzePerformance(): Promise<any> {
    // Get slow operations
    const slowOps = await this.connection.db.admin().command({
      currentOp: true,
      $or: [
        { "secs_running": { "$gt": 5 } },
        { "microsecs_running": { "$gt": 5000000 } }
      ]
    });
    
    return slowOps;
  }
}
```

### **Query Optimization**

```typescript
@Injectable()
export class OptimizedUserService extends MongooseResourceService<User> {
  
  // Use lean() for read-only operations
  async findUsersForDisplay(): Promise<Partial<User>[]> {
    const model = this.getDataService().getModel();
    
    return model
      .find({ isActive: true })
      .select('name email createdAt') // Only select needed fields
      .lean() // Return plain objects, not Mongoose documents
      .sort('-createdAt')
      .limit(100);
  }
  
  // Use aggregation for complex queries
  async getUserSummary(userId: string): Promise<any> {
    const model = this.getDataService().getModel();
    
    return model.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'user',
          as: 'comments'
        }
      },
      {
        $addFields: {
          postCount: { $size: '$posts' },
          commentCount: { $size: '$comments' },
          averagePostViews: { $avg: '$posts.views' }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          postCount: 1,
          commentCount: 1,
          averagePostViews: 1,
          joinedAt: '$createdAt'
        }
      }
    ]).exec();
  }
  
  // Batch operations for efficiency
  async updateMultipleUsers(updates: Array<{ id: string; data: Partial<User> }>): Promise<void> {
    const model = this.getDataService().getModel();
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data }
      }
    }));
    
    await model.bulkWrite(bulkOps);
  }
  
  // Cursor-based pagination for large datasets
  async findUsersCursor(
    lastId?: string,
    limit: number = 20
  ): Promise<{ users: User[]; hasMore: boolean; nextCursor?: string }> {
    const model = this.getDataService().getModel();
    
    const query: any = { isActive: true };
    if (lastId) {
      query._id = { $gt: new Types.ObjectId(lastId) };
    }
    
    const users = await model
      .find(query)
      .sort({ _id: 1 })
      .limit(limit + 1) // Get one extra to check if there are more
      .lean();
    
    const hasMore = users.length > limit;
    if (hasMore) {
      users.pop(); // Remove the extra item
    }
    
    const nextCursor = hasMore && users.length > 0 
      ? users[users.length - 1]._id.toString()
      : undefined;
    
    return { users, hasMore, nextCursor };
  }
}
```

---

## 🛠️ Connection Management

### **Multi-Database Setup**

```typescript
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/main-db', {
      connectionName: 'main',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/analytics-db', {
      connectionName: 'analytics',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
})
export class DatabaseModule {}

@Injectable()
export class UserService extends MongooseResourceService<User> {
  constructor(@InjectConnection('main') connection: Connection) {
    super(connection, 'User', UserSchema);
  }
}

@Injectable()
export class AnalyticsService extends MongooseResourceService<Analytics> {
  constructor(@InjectConnection('analytics') connection: Connection) {
    super(connection, 'Analytics', AnalyticsSchema);
  }
}
```

### **Connection Health Monitoring**

```typescript
@Injectable()
export class DatabaseHealthService {
  constructor(
    @InjectConnection('main') private mainConnection: Connection,
    @InjectConnection('analytics') private analyticsConnection: Connection
  ) {}
  
  async checkHealth(): Promise<{
    main: { status: string; responseTime: number };
    analytics: { status: string; responseTime: number };
  }> {
    const [mainHealth, analyticsHealth] = await Promise.all([
      this.checkConnectionHealth(this.mainConnection, 'main'),
      this.checkConnectionHealth(this.analyticsConnection, 'analytics')
    ]);
    
    return { main: mainHealth, analytics: analyticsHealth };
  }
  
  private async checkConnectionHealth(connection: Connection, name: string): Promise<{
    status: string;
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      await connection.db.admin().ping();
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime
      };
    }
  }
}
```

---

## 🎯 Best Practices

### **1. Schema Design**
```typescript
// ✅ Good: Use appropriate data types and validation
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  }
});

// ✅ Good: Add indexes for query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1, isActive: 1 });
```

### **2. Query Optimization**
```typescript
// ✅ Good: Use lean() for read-only operations
const users = await model.find().lean();

// ✅ Good: Select only needed fields
const users = await model.find().select('name email');

// ✅ Good: Use aggregation for complex operations
const stats = await model.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } }
]);
```

### **3. Transaction Usage**
```typescript
// ✅ Good: Use transactions for multi-operation consistency
await this.executeInTransaction(async (session) => {
  await model1.create([data1], { session });
  await model2.updateOne(filter, update, { session });
});

// ❌ Avoid: Unnecessary transactions for single operations
// Single operations are already atomic in MongoDB
```

---

The Mongoose module provides a complete, production-ready MongoDB integration with performance optimizations, transaction support, and comprehensive querying capabilities.
