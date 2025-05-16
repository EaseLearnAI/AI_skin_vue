# AI护肤系统API文档与实现总结

## 系统概述

AI护肤系统后端是一个基于Node.js和Express框架开发的RESTful API服务，主要功能包括用户认证、产品管理、图片上传、OCR识别产品成分以及AI成分分析。系统实现了模块化设计，确保代码的可维护性和可扩展性。

## 技术栈

- **后端框架**：Node.js + Express
- **数据库**：MongoDB + Mongoose
- **认证**：JWT (JSON Web Token)
- **存储服务**：阿里云OSS对象存储
- **AI服务**：
  - 阿里云通义千问OCR模型(qwen-vl-ocr-2025-04-13)
  - 阿里云通义千问对话模型(qwen-turbo-latest)
- **文件处理**：Multer

## 基础URL

```
http://localhost:5000/api
```

## 认证方式

大多数API端点需要通过JWT令牌进行身份验证。在请求头中包含令牌：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API端点

### 用户管理

#### 用户注册

创建新用户账号。

- **URL**: `/users/register`
- **方法**: `POST`
- **认证要求**: 无
- **请求体**:

```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

- **成功响应**:
  - **状态码**: 201 Created
  - **响应内容**:

```json
{
  "success": true,
  "message": "用户注册成功",
  "token": "JWT_TOKEN",
  "data": {
    "user": {
      "_id": "用户ID",
      "name": "张三",
      "email": "zhangsan@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **错误响应**:
  - **状态码**: 400 Bad Request
  - **响应内容**:

```json
{
  "success": false,
  "message": "请提供姓名、邮箱和密码"
}
```

或

```json
{
  "success": false,
  "message": "此邮箱已被注册"
}
```

#### 用户登录

验证用户身份并返回JWT令牌。

- **URL**: `/users/login`
- **方法**: `POST`
- **认证要求**: 无
- **请求体**:

```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "登录成功",
  "token": "JWT_TOKEN",
  "data": {
    "user": {
      "_id": "用户ID",
      "name": "张三",
      "email": "zhangsan@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **错误响应**:
  - **状态码**: 401 Unauthorized
  - **响应内容**:

```json
{
  "success": false,
  "message": "邮箱或密码不正确"
}
```

#### 获取当前用户信息

获取当前已认证用户的个人资料。

- **URL**: `/users/me`
- **方法**: `GET`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "用户ID",
      "name": "张三",
      "email": "zhangsan@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

### 产品管理

#### 创建产品

创建新的护肤产品记录。

- **URL**: `/products`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**:

```json
{
  "name": "美白精华液",
  "description": "这是一款美白精华产品"
}
```

- **成功响应**:
  - **状态码**: 201 Created
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品创建成功",
  "data": {
    "product": {
      "_id": "产品ID",
      "name": "美白精华液",
      "description": "这是一款美白精华产品",
      "imageUrl": "",
      "ingredients": [],
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

#### 上传产品图片

为已创建的产品上传图片。

- **URL**: `/products/:id/upload-image`
- **方法**: `POST`
- **认证要求**: 必须
- **Content-Type**: `multipart/form-data`
- **表单字段**:
  - `productImage`: 产品图片文件（支持jpg、jpeg、png、gif格式，最大5MB）

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品图片上传成功",
  "data": {
    "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product.jpg"
  }
}
```

#### 提取产品成分和名称

使用OCR技术从产品图片中提取成分信息和产品名称。

- **URL**: `/products/:id/extract-ingredients`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**: 空

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品成分提取成功",
  "data": {
    "name": "COSRX 低pH洁面啫喱",
    "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
    "rawContent": "OCR原始识别文本"
  }
}
```

#### 分析产品成分

使用通义千问AI模型分析产品成分，生成详细的安全性和功效评估。

- **URL**: `/products/:id/analyze-ingredients`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**: 空

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品成分分析成功",
  "data": {
    "ingredientAnalysis": {
      "safetyIndex": 85,
      "efficacyScore": 4.2,
      "activeIngredients": 8,
      "acneRisk": {"level": "低", "percentage": 15},
      "irritationRisk": {"level": "低", "percentage": 20},
      "allergyRisk": {"level": "低", "percentage": 25},
      "efficacyAnalysis": [
        "主要功效为保湿补水，有效滋润肌肤",
        "含有多种抗氧化成分，具有抗老化功效",
        "添加舒缓成分，能够镇静肌肤"
      ],
      "potentialRisks": [
        "含有香精成分，敏感肌肤可能产生刺激",
        "部分防腐剂可能引起过敏反应"
      ],
      "recommendations": [
        "建议敏感肌肤先进行局部测试",
        "适合干性和中性肌肤使用",
        "建议早晚各使用一次，效果更好"
      ],
      "overallRating": 4.0,
      "summary": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。"
    }
  }
}
```

#### 获取成分分析结果

获取已分析产品的成分分析结果，包含产品信息和详细分析。

- **URL**: `/products/:id/ingredient-analysis`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "产品ID",
      "name": "保湿面霜",
      "imageUrl": "https://example.com/image.jpg",
      "ingredients": ["水", "甘油", "丁二醇", "..."]
    },
    "ingredientAnalysis": {
      "safetyIndex": 85,
      "efficacyScore": 4.2,
      "activeIngredients": 8,
      "acneRisk": {"level": "低", "percentage": 15},
      "irritationRisk": {"level": "低", "percentage": 20},
      "allergyRisk": {"level": "低", "percentage": 25},
      "efficacyAnalysis": [
        "主要功效为保湿补水，有效滋润肌肤",
        "含有多种抗氧化成分，具有抗老化功效",
        "添加舒缓成分，能够镇静肌肤"
      ],
      "potentialRisks": [
        "含有香精成分，敏感肌肤可能产生刺激",
        "部分防腐剂可能引起过敏反应"
      ],
      "recommendations": [
        "建议敏感肌肤先进行局部测试",
        "适合干性和中性肌肤使用",
        "建议早晚各使用一次，效果更好"
      ],
      "overallRating": 4.0,
      "summary": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。"
    }
  }
}
```

#### 获取产品列表

获取当前用户创建的所有产品列表。

- **URL**: `/products`
- **方法**: `GET`
- **认证要求**: 必须
- **查询参数**:
  - `page`: 页码，默认为1
  - `limit`: 每页数量，默认为10

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "data": {
    "products": [
      {
        "_id": "产品ID1",
        "name": "美白精华液",
        "description": "这是一款美白精华产品",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product1.jpg",
        "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
        "createdBy": "用户ID",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      },
      {
        "_id": "产品ID2",
        "name": "保湿面霜",
        "description": "这是一款保湿面霜",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product2.jpg",
        "ingredients": ["水", "甘油", "..."],
        "createdBy": "用户ID",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### 获取单个产品

获取单个产品的详细信息。

- **URL**: `/products/:id`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "产品ID",
      "name": "美白精华液",
      "description": "这是一款美白精华产品",
      "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product.jpg",
      "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
      "ingredientAnalysis": {
        "safetyIndex": 85,
        "efficacyScore": 4.2,
        "activeIngredients": 8,
        "acneRisk": {"level": "低", "percentage": 15},
        "irritationRisk": {"level": "低", "percentage": 20},
        "allergyRisk": {"level": "低", "percentage": 25},
        "efficacyAnalysis": ["...", "...", "..."],
        "potentialRisks": ["...", "..."],
        "recommendations": ["...", "...", "..."],
        "overallRating": 4.0,
        "summary": "..."
      },
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

#### 更新产品

更新产品信息。

- **URL**: `/products/:id`
- **方法**: `PUT`
- **认证要求**: 必须
- **请求体**:

```json
{
  "name": "更新后的美白精华液",
  "description": "这是更新后的美白精华产品描述"
}
```

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品更新成功",
  "data": {
    "product": {
      "_id": "产品ID",
      "name": "更新后的美白精华液",
      "description": "这是更新后的美白精华产品描述",
      "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product.jpg",
      "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

#### 删除产品

删除产品。

- **URL**: `/products/:id`
- **方法**: `DELETE`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品删除成功",
  "data": {}
}
```

## 核心功能实现

### 1. 用户认证

- **用户模型**：使用Mongoose定义用户模型，包含名称、邮箱和密码字段
- **密码安全**：使用bcryptjs对密码进行哈希处理
- **令牌生成**：使用jsonwebtoken库生成JWT令牌
- **中间件验证**：实现身份验证中间件拦截需要认证的路由

### 2. 产品管理

- **产品模型**：定义产品模型，包含名称、描述、图片URL、成分列表和分析结果等字段
- **CRUD操作**：实现产品的创建、读取、更新和删除功能
- **数据验证**：对请求进行验证，确保数据完整性
- **用户隔离**：确保用户只能操作自己创建的产品

### 3. 图片上传与处理

- **OSS集成**：集成阿里云OSS SDK实现图片上传到云存储
- **文件过滤**：使用Multer中间件处理文件上传，并进行类型和大小限制
- **安全处理**：生成唯一文件名，防止文件名冲突
- **临时存储**：使用临时目录进行文件处理，处理完成后清理本地文件

### 4. OCR识别

- **OCR API集成**：接入通义千问OCR模型(qwen-vl-ocr-2025-04-13)
- **提取算法**：实现从图片中提取产品名称和成分信息的算法
- **数据处理**：对OCR结果进行解析和处理，提取有效信息
- **错误处理**：处理OCR识别可能出现的异常情况

### 5. 成分分析

- **AI模型集成**：接入通义千问对话模型(qwen-turbo-latest)
- **提示词设计**：设计专业的护肤品成分分析提示词
- **结果解析**：对AI返回的结果进行解析和验证
- **数据存储**：将分析结果存储到产品记录中

## 数据模型

### 用户模型

```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 产品模型

```javascript
{
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  ingredients: {
    type: Array,
    default: []
  },
  ingredientAnalysis: {
    type: Object,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 成分分析数据结构

```javascript
{
  safetyIndex: Number,             // 安全性指数(0-100)
  efficacyScore: Number,           // 功效评分(0-5.0)
  activeIngredients: Number,       // 活性成分数量
  acneRisk: {                      // 致痘风险
    level: String,                 // 风险等级(低/中/高)
    percentage: Number             // 风险百分比
  },
  irritationRisk: {                // 刺激风险
    level: String,                 // 风险等级(低/中/高)
    percentage: Number             // 风险百分比
  },
  allergyRisk: {                   // 过敏风险
    level: String,                 // 风险等级(低/中/高)
    percentage: Number             // 风险百分比
  },
  efficacyAnalysis: [String],      // 功效分析(3条)
  potentialRisks: [String],        // 潜在风险(最多2条)
  recommendations: [String],       // 使用建议(3条)
  overallRating: Number,           // AI综合评分(0-5.0)
  summary: String                  // 总结评价
}
```

## 技术亮点

### 1. AI服务集成

成功集成了两个阿里云AI服务：
- 通义千问OCR(qwen-vl-ocr-2025-04-13)用于从图片中提取产品名称和成分
- 通义千问对话模型(qwen-turbo-latest)进行专业的护肤品成分分析

### 2. 模块化设计

系统采用了高度模块化的设计，各个功能模块之间低耦合，包括：
- 用户认证模块
- 产品管理模块
- 文件上传模块
- OCR识别模块
- 成分分析模块

### 3. 安全性考量

- **用户数据安全**：密码哈希存储，JWT认证
- **资源隔离**：用户只能访问自己的资源
- **输入验证**：全面的请求验证机制
- **文件安全**：严格的文件类型和大小限制
- **API密钥保护**：AI服务API密钥在服务器端使用，不暴露给客户端

### 4. 错误处理

- **统一错误格式**：所有API返回一致的错误格式
- **详细错误信息**：在开发环境提供详细错误信息
- **异常捕获**：全面的异常捕获机制
- **日志记录**：详细的操作和错误日志

### 5. 前端集成友好

- **标准化响应格式**：所有API遵循一致的响应格式
- **完整的文档**：详细的API文档
- **面向前端的数据结构**：成分分析结果格式与前端展示需求一致

## 后续改进方向

### 1. 功能扩展

- **用户偏好设置**：允许用户设置皮肤类型、关注的成分等偏好
- **产品分类与标签**：实现产品分类和标签功能
- **成分对比**：提供多产品成分对比分析
- **成分冲突检测**：分析不同产品的成分是否存在使用冲突
- **个性化推荐**：基于用户肤质和偏好推荐适合的产品

### 2. 性能优化

- **缓存机制**：实现Redis缓存减少数据库查询和AI调用
- **图片处理优化**：实现图片压缩和缩放
- **批量处理**：支持批量上传和分析产品
- **数据库索引优化**：优化查询性能

### 3. 用户体验

- **实时通知**：使用WebSocket实现实时进度通知
- **批量操作**：支持批量导入导出产品数据
- **多语言支持**：支持多语言API响应
- **移动端适配**：针对移动应用优化API

### 4. 部署与运维

- **容器化**：Docker容器化部署
- **CI/CD**：自动化测试和部署流程
- **监控系统**：实现系统监控和告警
- **负载均衡**：高可用性架构设计

## 总结

AI护肤系统后端通过集成多种技术和服务，实现了一个功能完整、性能可靠的护肤品管理和分析平台。系统支持用户注册登录、产品管理、图片上传、OCR识别产品信息以及AI成分分析等核心功能。通过模块化设计和良好的架构实践，确保了系统的可维护性和可扩展性。未来可以在此基础上进一步扩展功能，优化性能，提升用户体验。 