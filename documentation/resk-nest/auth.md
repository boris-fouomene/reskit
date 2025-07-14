# 🔐 Authentication Module - @resk/nest/auth

> **Complete authentication system with JWT, guards, permissions, and security utilities**

## 📖 Overview

The Authentication module provides a comprehensive security framework for NestJS applications, including JWT token management, permission-based access control, password hashing, OTP generation, and various authentication guards. It integrates seamlessly with @resk/core and provides enterprise-grade security features.

---

## 🚀 Quick Start

### **Basic Authentication Setup**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { 
  AuthModule, 
  JwtAuthGuard, 
  PermissionGuard,
  Bcrypt 
} from '@resk/nest/auth';

@Module({
  imports: [
    AuthModule.forRoot({
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class AppModule {}
```

### **Protected Controller Example**

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { 
  JwtAuthGuard, 
  PermissionGuard, 
  Permissions,
  Bcrypt 
} from '@resk/nest/auth';

@Controller('auth')
export class AuthController {
  
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.authService.generateTokens(user);
  }
  
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Hash password before saving
    const hashedPassword = await Bcrypt.hash(registerDto.password);
    
    const userData = {
      ...registerDto,
      password: hashedPassword
    };
    
    return this.userService.create(userData);
  }
}

@Controller('protected')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProtectedController {
  
  @Permissions('users.read')
  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }
  
  @Permissions('users.create')
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

---

## 🔑 Password Hashing

### **Bcrypt Class**

```typescript
/**
 * Secure password hashing using bcrypt
 */
export class Bcrypt {
  // Hash password with default or custom rounds
  static async hash(password: string, rounds: number = 10): Promise<string>;
  
  // Compare password with hash
  static async compare(password: string, hash: string): Promise<boolean>;
  
  // Hash with custom salt
  static async hashWithSalt(
    password: string, 
    salt: string, 
    saltRounds: number = 10
  ): Promise<string>;
}

// Usage examples
const password = 'user-password-123';

// Basic hashing (recommended)
const hashedPassword = await Bcrypt.hash(password);
console.log(hashedPassword); // $2b$10$abc123...

// Hash with custom rounds (higher = more secure but slower)
const strongHash = await Bcrypt.hash(password, 12);

// Verify password
const isValid = await Bcrypt.compare(password, hashedPassword);
console.log(isValid); // true

// Hash with custom salt
const customSalt = 'my-custom-salt';
const saltedHash = await Bcrypt.hashWithSalt(password, customSalt, 10);
```

### **Password Security Best Practices**

```typescript
@Injectable()
export class AuthService {
  
  async registerUser(registerDto: RegisterDto): Promise<User> {
    // Validate password strength
    this.validatePasswordStrength(registerDto.password);
    
    // Hash with appropriate rounds (10-12 for production)
    const hashedPassword = await Bcrypt.hash(registerDto.password, 12);
    
    const userData = {
      ...registerDto,
      password: hashedPassword,
      createdAt: new Date(),
      lastPasswordChange: new Date()
    };
    
    return this.userService.create(userData);
  }
  
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      // Prevent timing attacks
      await Bcrypt.hash('dummy-password', 10);
      return null;
    }
    
    const isPasswordValid = await Bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Log failed attempt
      await this.logFailedLogin(email);
      return null;
    }
    
    // Update last login
    await this.userService.updateLastLogin(user.id);
    
    return user;
  }
  
  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await this.userService.findOne(userId);
    
    // Verify current password
    const isCurrentValid = await Bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    // Check if new password is different
    const isSamePassword = await Bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }
    
    // Validate new password strength
    this.validatePasswordStrength(newPassword);
    
    // Hash and save new password
    const hashedNewPassword = await Bcrypt.hash(newPassword, 12);
    
    await this.userService.update(userId, {
      password: hashedNewPassword,
      lastPasswordChange: new Date()
    });
  }
  
  private validatePasswordStrength(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      throw new BadRequestException(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }
    
    if (!hasLowerCase) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }
    
    if (!hasNumbers) {
      throw new BadRequestException('Password must contain at least one number');
    }
    
    if (!hasSpecialChar) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }
}
```

---

## 🎫 OTP Generation

### **OTPGenerator Class**

```typescript
/**
 * One-Time Password generation with customizable options
 */
interface IOTPOptions {
  length?: number;        // OTP length (default: 6)
  digits?: boolean;       // Include digits 0-9 (default: true)
  upperCase?: boolean;    // Include A-Z (default: true)
  lowerCase?: boolean;    // Include a-z (default: true)
  specialChars?: boolean; // Include special characters (default: true)
}

export class OTPGenerator {
  static generate(options: IOTPOptions): string;
}

// Usage examples
// Simple 6-digit numeric OTP
const numericOTP = OTPGenerator.generate({
  length: 6,
  digits: true,
  upperCase: false,
  lowerCase: false,
  specialChars: false
});
console.log(numericOTP); // "123456"

// Alphanumeric OTP
const alphanumericOTP = OTPGenerator.generate({
  length: 8,
  digits: true,
  upperCase: true,
  lowerCase: true,
  specialChars: false
});
console.log(alphanumericOTP); // "A3b7K9m2"

// Complex OTP with special characters
const complexOTP = OTPGenerator.generate({
  length: 12,
  digits: true,
  upperCase: true,
  lowerCase: true,
  specialChars: true
});
console.log(complexOTP); // "K3$m9B@x2F!z"

// Uppercase letters only
const upperCaseOTP = OTPGenerator.generate({
  length: 4,
  digits: false,
  upperCase: true,
  lowerCase: false,
  specialChars: false
});
console.log(upperCaseOTP); // "KBXF"
```

### **OTP Service Implementation**

```typescript
@Injectable()
export class OTPService {
  private otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();
  
  async generateOTP(
    identifier: string, 
    options?: Partial<IOTPOptions>
  ): Promise<{
    otp: string;
    expiresIn: number;
    attemptsLeft: number;
  }> {
    // Generate OTP
    const otp = OTPGenerator.generate({
      length: 6,
      digits: true,
      upperCase: false,
      lowerCase: false,
      specialChars: false,
      ...options
    });
    
    // Set expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Store OTP
    this.otpStore.set(identifier, {
      otp,
      expiresAt,
      attempts: 0
    });
    
    // Send OTP (email/SMS)
    await this.sendOTP(identifier, otp);
    
    return {
      otp: process.env.NODE_ENV === 'development' ? otp : '******',
      expiresIn: 300, // 5 minutes in seconds
      attemptsLeft: 3
    };
  }
  
  async verifyOTP(identifier: string, providedOTP: string): Promise<boolean> {
    const storedData = this.otpStore.get(identifier);
    
    if (!storedData) {
      throw new BadRequestException('OTP not found or expired');
    }
    
    // Check expiration
    if (new Date() > storedData.expiresAt) {
      this.otpStore.delete(identifier);
      throw new BadRequestException('OTP has expired');
    }
    
    // Check attempts
    if (storedData.attempts >= 3) {
      this.otpStore.delete(identifier);
      throw new BadRequestException('Too many failed attempts');
    }
    
    // Verify OTP
    if (storedData.otp !== providedOTP) {
      storedData.attempts++;
      throw new BadRequestException(`Invalid OTP. ${3 - storedData.attempts} attempts left`);
    }
    
    // Valid OTP - remove from store
    this.otpStore.delete(identifier);
    return true;
  }
  
  async resendOTP(identifier: string): Promise<void> {
    const storedData = this.otpStore.get(identifier);
    
    if (storedData) {
      // Check if enough time has passed (prevent spam)
      const timeSinceLastSent = Date.now() - (storedData.expiresAt.getTime() - 5 * 60 * 1000);
      if (timeSinceLastSent < 60 * 1000) { // 1 minute cooldown
        throw new BadRequestException('Please wait before requesting a new OTP');
      }
    }
    
    // Generate new OTP
    await this.generateOTP(identifier);
  }
  
  private async sendOTP(identifier: string, otp: string): Promise<void> {
    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      await this.emailService.sendOTP(identifier, otp);
    } else {
      await this.smsService.sendOTP(identifier, otp);
    }
  }
}

// Usage in authentication flow
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService
  ) {}
  
  @Post('send-otp')
  async sendOTP(@Body() { email }: { email: string }) {
    return this.otpService.generateOTP(email);
  }
  
  @Post('verify-otp')
  async verifyOTP(@Body() { email, otp }: { email: string; otp: string }) {
    const isValid = await this.otpService.verifyOTP(email, otp);
    
    if (isValid) {
      // Generate access token
      const user = await this.userService.findByEmail(email);
      return this.authService.generateTokens(user);
    }
  }
  
  @Post('reset-password')
  async resetPassword(@Body() { email, otp, newPassword }: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    // Verify OTP first
    await this.otpService.verifyOTP(email, otp);
    
    // Reset password
    const hashedPassword = await Bcrypt.hash(newPassword, 12);
    await this.userService.updatePasswordByEmail(email, hashedPassword);
    
    return { message: 'Password reset successfully' };
  }
}
```

---

## 🛡️ Guards & Permissions

### **JWT Authentication Guard**

```typescript
/**
 * JWT Authentication Guard
 * Protects routes by validating JWT tokens
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

// Usage
@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; // User data from JWT payload
  }
}
```

### **Permission Guard**

```typescript
/**
 * Permission-based access control guard
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

/**
 * Permissions decorator for defining required permissions
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminController {
  
  @Permissions('users.read', 'users.list')
  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }
  
  @Permissions('users.create')
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @Permissions('users.update')
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  
  @Permissions('users.delete')
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
```

### **HTTPS Guard**

```typescript
/**
 * HTTPS enforcement guard
 */
@Injectable()
export class HttpsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean;
}

// Usage
@Controller('api')
@UseGuards(HttpsGuard)
export class ApiController {
  // All routes require HTTPS
}
```

---

## 🎯 Advanced Authentication Patterns

### **JWT Service Implementation**

```typescript
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}
  
  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });
    
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: '7d', // Long-lived refresh token
        secret: this.configService.get('JWT_REFRESH_SECRET')
      }
    );
    
    // Store refresh token in database
    await this.userService.updateRefreshToken(user.id, refreshToken);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };
  }
  
  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      });
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      
      const user = await this.userService.findOne(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }
  
  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.sub);
      
      if (!user || !user.isActive) {
        return null;
      }
      
      return user;
    } catch (error) {
      return null;
    }
  }
}
```

### **Role-Based Access Control**

```typescript
// Define roles and permissions
export enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

export const RolePermissions = {
  [Role.ADMIN]: [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.delete',
    'system.configure'
  ],
  [Role.MODERATOR]: [
    'users.read',
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.moderate'
  ],
  [Role.USER]: [
    'posts.read',
    'posts.create',
    'profile.update'
  ]
};

// Role guard
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some(role => user.role === role);
  }
}

// Roles decorator
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

// Enhanced permission guard
@Injectable()
export class EnhancedPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Get user permissions from role
    const userPermissions = RolePermissions[user.role] || [];
    
    // Add any additional user-specific permissions
    if (user.additionalPermissions) {
      userPermissions.push(...user.additionalPermissions);
    }
    
    // Check if user has all required permissions
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }
}

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard, EnhancedPermissionGuard)
export class AdminController {
  
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Permissions('users.read')
  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }
  
  @Roles(Role.ADMIN)
  @Permissions('system.configure')
  @Post('configure')
  async configureSystem(@Body() config: SystemConfig) {
    return this.systemService.configure(config);
  }
}
```

### **Multi-Factor Authentication**

```typescript
@Injectable()
export class MFAService {
  constructor(
    private otpService: OTPService,
    private userService: UserService,
    private authService: AuthService
  ) {}
  
  async enableMFA(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userService.findOne(userId);
    
    // Generate TOTP secret
    const secret = this.generateTOTPSecret();
    
    // Generate QR code for authenticator apps
    const qrCode = await this.generateQRCode(user.email, secret);
    
    // Store secret (encrypted) in user record
    await this.userService.update(userId, {
      mfaSecret: this.encrypt(secret),
      mfaEnabled: false // Will be enabled after verification
    });
    
    return { secret, qrCode };
  }
  
  async verifyMFASetup(userId: string, token: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    
    if (!user.mfaSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }
    
    const secret = this.decrypt(user.mfaSecret);
    const isValid = this.verifyTOTPToken(secret, token);
    
    if (isValid) {
      await this.userService.update(userId, { mfaEnabled: true });
      return true;
    }
    
    return false;
  }
  
  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    
    if (!user.mfaEnabled || !user.mfaSecret) {
      return true; // MFA not enabled
    }
    
    const secret = this.decrypt(user.mfaSecret);
    return this.verifyTOTPToken(secret, token);
  }
  
  async generateBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = Array.from({ length: 10 }, () => 
      OTPGenerator.generate({
        length: 8,
        digits: true,
        upperCase: true,
        lowerCase: false,
        specialChars: false
      })
    );
    
    // Hash and store backup codes
    const hashedCodes = await Promise.all(
      backupCodes.map(code => Bcrypt.hash(code))
    );
    
    await this.userService.update(userId, {
      mfaBackupCodes: hashedCodes
    });
    
    return backupCodes;
  }
  
  private generateTOTPSecret(): string {
    return OTPGenerator.generate({
      length: 32,
      digits: true,
      upperCase: true,
      lowerCase: true,
      specialChars: false
    });
  }
  
  private verifyTOTPToken(secret: string, token: string): boolean {
    // Implementation would use a TOTP library like 'otplib'
    // This is a simplified example
    return true; // Placeholder
  }
}

// MFA controller
@Controller('auth/mfa')
@UseGuards(JwtAuthGuard)
export class MFAController {
  constructor(private mfaService: MFAService) {}
  
  @Post('enable')
  async enableMFA(@Req() req) {
    return this.mfaService.enableMFA(req.user.id);
  }
  
  @Post('verify-setup')
  async verifySetup(@Req() req, @Body() { token }: { token: string }) {
    const isValid = await this.mfaService.verifyMFASetup(req.user.id, token);
    
    if (isValid) {
      return { message: 'MFA enabled successfully' };
    } else {
      throw new BadRequestException('Invalid MFA token');
    }
  }
  
  @Post('backup-codes')
  async generateBackupCodes(@Req() req) {
    const codes = await this.mfaService.generateBackupCodes(req.user.id);
    return { backupCodes: codes };
  }
}
```

---

## 🎯 Security Best Practices

### **1. Token Security**
```typescript
// ✅ Good: Short-lived access tokens with refresh tokens
const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

// ✅ Good: Different secrets for access and refresh tokens
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

// ✅ Good: Store refresh tokens securely
await this.userService.updateRefreshToken(userId, hashedRefreshToken);
```

### **2. Password Security**
```typescript
// ✅ Good: Strong password requirements
private validatePasswordStrength(password: string): void {
  // Minimum 8 characters, uppercase, lowercase, number, special char
}

// ✅ Good: Appropriate bcrypt rounds (10-12 for production)
const hashedPassword = await Bcrypt.hash(password, 12);

// ✅ Good: Prevent timing attacks
if (!user) {
  await Bcrypt.hash('dummy-password', 10);
  return null;
}
```

### **3. Rate Limiting**
```typescript
// ✅ Good: Implement rate limiting for auth endpoints
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  
  @Throttle(5, 60) // 5 attempts per minute
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Login logic
  }
  
  @Throttle(3, 300) // 3 attempts per 5 minutes
  @Post('send-otp')
  async sendOTP(@Body() { email }: { email: string }) {
    // OTP logic
  }
}
```

---

The Authentication module provides enterprise-grade security features for NestJS applications with comprehensive token management, permission systems, and security utilities.
