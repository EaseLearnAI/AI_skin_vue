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

#### 更新用户名

更新当前已认证用户的用户名。

- **URL**: `/users/update-username`
- **方法**: `PATCH`
- **认证要求**: 必须
- **请求体**:

```json
{
  "name": "李四"
}
```

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "用户名更新成功",
  "data": {
    "user": {
      "_id": "用户ID",
      "name": "李四",
      "email": "zhangsan@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:30:00.000Z"
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
  "message": "请提供新的用户名"
}
```

#### 获取用户统计数据

获取当前已认证用户的统计数据，包括创建的反馈数量、反馈类别分布和账户年龄。

- **URL**: `/users/stats`
- **方法**: `GET`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "stats": {
      "ideasCount": 5,
      "ideaCategories": [
        { "_id": "功能建议", "count": 2 },
        { "_id": "问题反馈", "count": 2 },
        { "_id": "界面优化", "count": 1 }
      ],
      "accountAge": 30
    }
  }
}
```

#### 用户登出

登出当前用户。

- **URL**: `/users/logout`
- **方法**: `POST`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "登出成功",
  "data": null
}
```

### 产品管理

#### 创建产品

创建新的护肤产品记录（用户只需提供基本信息，产品名称可以通过OCR自动获取）。

- **URL**: `/products`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**:

```json
{
  "name": "美白精华液",  // 可选，如不提供将默认为"未命名产品"，后续可通过OCR自动获取
  "description": "这是一款美白精华产品",  // 可选，可在成分分析后自动更新
  "label": "美白",  // 可选，用于产品分类标签
  "openingDate": "2025-05-20T12:00:00.000Z"  // 可选，产品开封日期，ISO日期字符串
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
      "description": "",
      "label": "美白",
      "openingDate": "2025-05-20T12:00:00.000Z",
      "imageUrl": "",
      "ingredients": [],
      "createdBy": "用户ID",
      "createdAt": "2025-05-20T12:00:00.000Z",
      "updatedAt": "2025-05-20T12:00:00.000Z"
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

使用OCR技术从产品图片中提取产品名称和成分信息，并自动更新产品记录。系统会自动将OCR识别的产品名称更新到name字段。

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
    "name": "COSRX 低pH洁面啫喱",  // OCR识别的产品名称，已自动更新到产品记录
    "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
    "rawContent": "OCR原始识别文本"
  }
}
```

#### 分析产品成分

使用通义千问AI模型分析产品成分，生成详细的安全性和功效评估。系统会自动将分析结果的summary更新到产品描述字段(description)。

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
    },
    "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。"
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
      "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。",
      "label": "保湿",
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
        "description": "这是一款美白精华产品，含有多种抗氧化成分，具有抗老化功效。",
        "label": "美白",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product1.jpg",
        "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
        "createdBy": "用户ID",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      },
      {
        "_id": "产品ID2",
        "name": "保湿面霜",
        "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。",
        "label": "保湿",
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
      "description": "含有多种抗氧化成分，具有抗老化功效。适合干性和中性肌肤使用，敏感肌需谨慎使用。",
      "label": "美白",
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

更新产品信息，包括开封日期。

- **URL**: `/products/:id`
- **方法**: `PUT`
- **认证要求**: 必须
- **请求体**:

```json
{
  "name": "更新后的美白精华液",
  "description": "这是更新后的美白精华产品描述",
  "label": "美白修护",
  "openingDate": "2025-06-01T00:00:00.000Z"
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
      "label": "美白修护",
      "openingDate": "2025-06-01T00:00:00.000Z",
      "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product.jpg",
      "ingredients": ["水", "甘油", "尿素", "透明质酸钠", "..."],
      "createdBy": "用户ID",
      "createdAt": "2025-05-20T12:00:00.000Z",
      "updatedAt": "2025-05-20T13:00:00.000Z"
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

### 获取用户产品

#### 获取用户所有产品简要信息

获取指定用户创建的所有产品的简要信息。

- **URL**: `/products/user/:userId`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "count": 2,
  "data": {
    "products": [
      {
        "id": "产品ID1",
        "name": "美白精华液",
        "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和...",
        "label": "美白",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product1.jpg",
        "safetyScore": 85,
        "efficacyScore": 4.2,
        "overallRating": 4.0
      },
      {
        "id": "产品ID2",
        "name": "保湿面霜",
        "description": "这是一款保湿面霜...",
        "label": "保湿",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product2.jpg",
        "safetyScore": 90,
        "efficacyScore": 4.5,
        "overallRating": 4.3
      }
    ]
  }
}
```

#### 根据标签获取用户产品简要信息

根据标签获取指定用户创建的产品简要信息。

- **URL**: `/products/user/:userId/label/:label`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "count": 1,
  "data": {
    "products": [
      {
        "id": "产品ID1",
        "name": "美白精华液",
        "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和...",
        "label": "美白",
        "imageUrl": "https://abc1567849.oss-cn-beijing.aliyuncs.com/1234567890-product1.jpg",
        "safetyScore": 85,
        "efficacyScore": 4.2,
        "overallRating": 4.0
      }
    ]
  }
}
```

### 用户反馈管理

#### 创建反馈

创建一个新的用户反馈（想法、建议或问题）。

- **URL**: `/ideas`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**:

```json
{
  "title": "功能建议",
  "content": "希望能增加产品之间的对比功能",
  "category": "功能建议"  // 可选，可选值有：'功能建议', '问题反馈', '界面优化', '产品需求', '其他'，默认为'其他'
}
```

- **成功响应**:
  - **状态码**: 201 Created
  - **响应内容**:

```json
{
  "success": true,
  "message": "反馈提交成功",
  "data": {
    "idea": {
      "_id": "反馈ID",
      "title": "功能建议",
      "content": "希望能增加产品之间的对比功能",
      "category": "功能建议",
      "status": "待处理",
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

#### 获取用户反馈列表

获取当前用户提交的所有反馈。

- **URL**: `/ideas`
- **方法**: `GET`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "count": 2,
  "data": {
    "ideas": [
      {
        "_id": "反馈ID1",
        "title": "功能建议",
        "content": "希望能增加产品之间的对比功能",
        "category": "功能建议",
        "status": "待处理",
        "createdBy": "用户ID",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      },
      {
        "_id": "反馈ID2",
        "title": "界面问题",
        "content": "界面上的按钮太小了，点击困难",
        "category": "界面优化",
        "status": "待处理",
        "createdBy": "用户ID",
        "createdAt": "2023-10-02T12:00:00.000Z",
        "updatedAt": "2023-10-02T12:00:00.000Z"
      }
    ]
  }
}
```

#### 获取反馈详情

获取特定反馈的详细信息。

- **URL**: `/ideas/:id`
- **方法**: `GET`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "idea": {
      "_id": "反馈ID",
      "title": "功能建议",
      "content": "希望能增加产品之间的对比功能",
      "category": "功能建议",
      "status": "待处理",
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

- **错误响应**:
  - **状态码**: 404 Not Found
  - **响应内容**:

```json
{
  "success": false,
  "message": "反馈不存在"
}
```

#### 更新反馈

更新特定反馈的内容。

- **URL**: `/ideas/:id`
- **方法**: `PUT`
- **认证要求**: 必须
- **请求体**:

```json
{
  "title": "修改后的标题",
  "content": "修改后的内容",
  "category": "问题反馈"  // 可选
}
```

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "反馈更新成功",
  "data": {
    "idea": {
      "_id": "反馈ID",
      "title": "修改后的标题",
      "content": "修改后的内容",
      "category": "问题反馈",
      "status": "待处理",
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T13:00:00.000Z"
    }
  }
}
```

- **错误响应**:
  - **状态码**: 404 Not Found
  - **响应内容**:

```json
{
  "success": false,
  "message": "反馈不存在"
}
```

#### 删除反馈

删除特定反馈。

- **URL**: `/ideas/:id`
- **方法**: `DELETE`
- **认证要求**: 必须
- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "反馈删除成功",
  "data": {}
}
```

- **错误响应**:
  - **状态码**: 404 Not Found
  - **响应内容**:

```json
{
  "success": false,
  "message": "反馈不存在"
}
```

### 成分冲突检测

#### 分析产品冲突

分析多个产品之间的成分冲突，并生成详细的冲突报告和使用建议。

- **URL**: `/conflicts`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**:

```json
{
  "productIds": ["产品ID1", "产品ID2"]
}
```

- **成功响应**:
  - **状态码**: 201 Created
  - **响应内容**:

```json
{
  "success": true,
  "message": "产品冲突分析成功",
  "data": {
    "conflictId": "冲突分析记录ID",
    "conflicts": [
      {
        "components": ["维生素C", "烟酰胺"],
        "severity": "高",
        "description": "这两种成分混合使用会相互影响功效",
        "effects": ["降低吸收效果", "可能导致皮肤刺激"]
      }
    ],
    "safeCombo": [
      {
        "components": ["神经酰胺", "玻尿酸"],
        "description": "这两种成分相辅相成，能提供更好的保湿效果"
      }
    ],
    "recommendations": {
      "productPairings": {
        "cannotUseTogether": [
          {
            "products": ["The Ordinary 维生素C精华", "某品牌烟酰胺精华"],
            "reason": "成分相互干扰，降低功效"
          }
        ],
        "canUseTogether": [
          {
            "products": ["洁面产品", "精华产品"],
            "reason": "不存在成分冲突，可以安全搭配"
          }
        ]
      },
      "routines": {
        "morning": ["洁面 → 烟酰胺产品"],
        "evening": ["洁面 → 维生素C产品"]
      }
    },
    "products": [
      {
        "id": "产品ID1",
        "name": "产品名称1",
        "description": "产品描述1",
        "imageUrl": "产品图片URL1"
      },
      {
        "id": "产品ID2",
        "name": "产品名称2",
        "description": "产品描述2",
        "imageUrl": "产品图片URL2"
      }
    ]
  }
}
```

#### 获取用户所有冲突分析记录

获取当前用户的所有冲突分析记录。

- **URL**: `/conflicts`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "count": 2,
  "data": {
    "conflicts": [
      {
        "_id": "冲突记录ID1",
        "products": [
          {
            "_id": "产品ID1",
            "name": "产品名称1",
            "description": "产品描述1",
            "imageUrl": "产品图片URL1"
          },
          {
            "_id": "产品ID2",
            "name": "产品名称2",
            "description": "产品描述2",
            "imageUrl": "产品图片URL2"
          }
        ],
        "conflicts": [
          {
            "components": ["维生素C", "烟酰胺"],
            "severity": "高",
            "description": "这两种成分混合使用会相互影响功效",
            "effects": ["降低吸收效果", "可能导致皮肤刺激"]
          }
        ],
        "safeCombo": [...],
        "recommendations": {...},
        "createdAt": "2023-10-01T12:00:00.000Z"
      },
      {
        "_id": "冲突记录ID2",
        "products": [...],
        "conflicts": [...],
        "safeCombo": [...],
        "recommendations": {...},
        "createdAt": "2023-10-02T12:00:00.000Z"
      }
    ]
  }
}
```

#### 获取单个冲突分析记录

获取单个冲突分析记录的详细信息。

- **URL**: `/conflicts/:id`
- **方法**: `GET`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "data": {
    "conflict": {
      "_id": "冲突记录ID",
      "products": [
        {
          "_id": "产品ID1",
          "name": "产品名称1",
          "description": "产品描述1",
          "imageUrl": "产品图片URL1",
          "ingredients": ["成分1", "成分2", "..."]
        },
        {
          "_id": "产品ID2",
          "name": "产品名称2",
          "description": "产品描述2",
          "imageUrl": "产品图片URL2",
          "ingredients": ["成分1", "成分3", "..."]
        }
      ],
      "conflicts": [
        {
          "components": ["维生素C", "烟酰胺"],
          "severity": "高",
          "description": "这两种成分混合使用会相互影响功效",
          "effects": ["降低吸收效果", "可能导致皮肤刺激"]
        }
      ],
      "safeCombo": [
        {
          "components": ["神经酰胺", "玻尿酸"],
          "description": "这两种成分相辅相成，能提供更好的保湿效果"
        }
      ],
      "recommendations": {
        "productPairings": {
          "cannotUseTogether": [
            {
              "products": ["The Ordinary 维生素C精华", "某品牌烟酰胺精华"],
              "reason": "成分相互干扰，降低功效"
            }
          ],
          "canUseTogether": [
            {
              "products": ["洁面产品", "精华产品"],
              "reason": "不存在成分冲突，可以安全搭配"
            }
          ]
        },
        "routines": {
          "morning": ["洁面 → 烟酰胺产品"],
          "evening": ["洁面 → 维生素C产品"]
        }
      },
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

#### 删除冲突分析记录

删除冲突分析记录。

- **URL**: `/conflicts/:id`
- **方法**: `DELETE`
- **认证要求**: 必须

- **成功响应**:
  - **状态码**: 200 OK
  - **响应内容**:

```json
{
  "success": true,
  "message": "冲突分析记录删除成功",
  "data": {}
}
```

### 个性化护肤方案

#### 生成个性化护肤方案

根据用户需求和现有产品，生成个性化的早晚护肤方案。

- **URL**: `/plans`
- **方法**: `POST`
- **认证要求**: 必须
- **请求体**:

```json
{
  "requirement": "美白淡斑，皮肤容易干燥"  // 可选，如不提供则使用默认的日常基础护肤需求
}
```

- **成功响应**:
  - **状态码**: 201 Created
  - **响应内容**:

```json
{
  "success": true,
  "message": "护肤方案生成成功",
  "data": {
    "plan": {
      "_id": "方案ID",
      "name": "美白保湿护肤方案",
      "requirement": "美白淡斑，皮肤容易干燥",
      "morning": [
        {
          "step": 1,
          "product": "COSRX 低pH洁面啫喱"
        },
        {
          "step": 2,
          "product": "理肤泉特安舒缓保湿霜"
        },
        {
          "step": 3,
          "product": "安耐晒金瓶防晒霜"
        }
      ],
      "evening": [
        {
          "step": 1,
          "product": "COSRX 低pH洁面啫喱"
        },
        {
          "step": 2,
          "product": "The Ordinary 维生素C精华"
        },
        {
          "step": 3,
          "product": "理肤泉特安舒缓保湿霜"
        }
      ],
      "recommendations": [
        "早晚使用温和洁面产品，避免过度清洁",
        "防晒是美白的基础，白天必须使用防晒霜",
        "晚上使用维生素C精华有助于淡斑和提亮肤色"
      ],
      "createdBy": "用户ID",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

### 成分分析

#### 分析产品成分

使用通义千问AI模型分析产品成分，生成详细的安全性和功效评估。系统会自动将分析结果的summary更新到产品描述字段(description)。

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
    },
    "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。"
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
      "description": "整体来说是一款性价比较高的基础保湿产品，成分相对温和，适合大多数肌肤类型使用。敏感肌需谨慎使用。",
      "label": "保湿",
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

## 核心功能实现

### 1. 用户认证

- **用户模型**：使用Mongoose定义用户模型，包含名称、邮箱和密码字段
- **密码安全**：使用bcryptjs对密码进行哈希处理
- **令牌生成**：使用jsonwebtoken库生成JWT令牌
- **中间件验证**：实现身份验证中间件拦截需要认证的路由

### 2. 产品管理

- **产品模型**：定义产品模型，包含名称、描述、标签、图片URL、成分列表和分析结果等字段
- **CRUD操作**：实现产品的创建、读取、更新和删除功能
- **数据验证**：对请求进行验证，确保数据完整性
- **用户隔离**：确保用户只能操作自己创建的产品
- **自动更新**：OCR识别的产品名称和AI分析的描述自动更新到产品记录

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
- **自动更新**：将OCR识别的产品名称自动更新到产品记录

### 5. 成分分析

- **AI模型集成**：接入通义千问对话模型(qwen-turbo-latest)
- **提示词设计**：设计专业的护肤品成分分析提示词
- **结果解析**：对AI返回的结果进行解析和验证
- **数据存储**：将分析结果存储到产品记录中
- **自动更新描述**：使用AI分析结果的summary更新产品描述

### 6. 成分冲突检测

- **AI模型集成**：接入通义千问对话模型(qwen-turbo-latest)
- **提示词设计**：设计专业的护肤品成分冲突分析提示词，确保AI返回格式化结果
- **多产品分析**：支持分析多个产品之间的成分冲突
- **使用建议**：生成详细的产品搭配建议和护肤步骤顺序
- **安全组合**：识别产品中可以安全组合使用的成分
- **用户隔离**：确保用户只能访问自己的冲突分析记录

### 7. 个性化护肤方案

- **方案模型**：定义护肤方案模型，包含早晚步骤和推荐建议
- **AI模型集成**：接入通义千问对话模型(qwen-turbo-latest)生成个性化护肤方案
- **现有产品分析**：分析用户现有产品，为用户提供基于已有产品的方案
- **步骤排序**：根据护肤科学原则，确定产品使用的正确顺序
- **智能推荐**：根据用户的护肤需求，提供有针对性的护肤建议
- **灵活需求**：支持用户指定特殊需求，如美白、祛痘、保湿等

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
    default: '未命名产品' // 名称字段不再是必填的，默认为"未命名产品"
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
  label: {
    type: String,
    default: ''
  },
  openingDate: {   // 新增开封日期字段
    type: Date,
    default: null
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
  summary: String                  // 总结评价（自动更新到产品描述）
}
```

### 冲突模型

```javascript
{
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  conflicts: [{
    components: [String],
    severity: {
      type: String,
      enum: ['高', '中', '低'],
      required: true
    },
    description: String,
    effects: [String]
  }],
  safeCombo: [{
    components: [String],
    description: String
  }],
  recommendations: {
    productPairings: {
      cannotUseTogether: [{
        products: [String],
        reason: String
      }],
      canUseTogether: [{
        products: [String],
        reason: String
      }]
    },
    routines: {
      morning: [String],
      evening: [String]
    }
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

### 护肤方案模型

```javascript
{
  name: {
    type: String,
    default: '日常护肤方案'
  },
  requirement: {
    type: String,
    default: ''
  },
  morning: [{
    step: Number,
    product: String
  }],
  evening: [{
    step: Number,
    product: String
  }],
  recommendations: {
    type: Array,
    default: []
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

## 技术亮点

### 1. AI服务集成与智能更新

- 成功集成了两个阿里云AI服务：
  - 通义千问OCR(qwen-vl-ocr-2025-04-13)用于从图片中提取产品名称和成分
  - 通义千问对话模型(qwen-turbo-latest)进行专业的护肤品成分分析
- 实现了智能更新流程：
  - OCR识别的产品名称自动更新到产品名称字段
  - AI分析结果的summary自动更新到产品描述字段
  - 用户只需提供产品图片，系统就能完成产品信息的自动填充

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
- **智能填充**：减少前端用户输入负担，只需提供图片即可获取产品完整信息

### 6. 成分冲突检测

- **多产品分析**：支持同时分析多个产品的成分冲突
- **冲突严重程度评估**：对冲突的严重程度进行分级（高/中/低）
- **安全组合推荐**：识别可以安全组合使用的成分
- **使用顺序建议**：根据成分冲突情况提供早晚护肤顺序建议
- **产品搭配指导**：明确指出哪些产品不能一起使用，哪些可以搭配使用

### 7. 个性化护肤方案

- **智能组合**：根据用户已有产品和需求智能组合护肤方案
- **科学护肤顺序**：自动按照科学护肤步骤排序产品使用顺序
- **针对性推荐**：根据用户特定需求（如美白、保湿）提供有针对性的方案
- **早晚分离**：区分早晚护肤，确保不同时段的产品使用合理
- **灵活定制**：用户可以指定任意护肤需求，系统自动适应并生成方案

## 后续改进方向

### 1. 功能扩展

- **用户偏好设置**：允许用户设置皮肤类型、关注的成分等偏好
- **产品分类与标签筛选**：基于label字段实现产品分类和标签筛选功能
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

### 5. 成分冲突检测增强

- **实时冲突预警**：在用户添加新产品时，自动检测与现有产品的潜在冲突
- **冲突可视化**：提供成分冲突的图形化展示
- **更精确的冲突分析**：细化对特定肤质的冲突影响评估
- **智能产品替代建议**：当检测到冲突时，推荐无冲突的替代产品
- **与护肤日历集成**：基于冲突分析自动生成合理的护肤日历

### 6. 个性化方案增强

- **组合产品方案**：根据现有产品冲突情况，自动生成最佳搭配方案
- **图形可视化**：提供护肤方案的图形化展示界面
- **方案比较**：支持多个护肤方案的比较和评估
- **适应性更新**：根据用户反馈和新增产品自动调整方案
- **季节性建议**：根据季节和气候条件调整护肤建议

## 总结

AI护肤系统后端通过集成多种技术和服务，实现了一个功能完整、性能可靠的护肤品管理和分析平台。系统支持用户注册登录、产品管理、图片上传、OCR识别产品信息以及AI成分分析等核心功能。新版本实现了智能填充功能，用户只需提供产品图片，系统就能通过OCR识别产品名称和成分，并通过AI自动生成产品描述，大大减轻了用户的输入负担。通过模块化设计和良好的架构实践，确保了系统的可维护性和可扩展性。未来可以在此基础上进一步扩展功能，优化性能，提升用户体验。 