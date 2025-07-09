# 📚 API Documentation

## Overview

The GenAI Image Generator API provides RESTful endpoints for AI-powered image generation, content moderation, and image management. All endpoints require authentication via API key.

## Base URL

```
Development: http://localhost:3001
Production: https://api.genai-image-generator.com
```

## Authentication

All API requests require an API key in the request header:

```http
X-API-Key: your-api-key-here
```

### API Key Format

API keys should be 32-128 characters long and contain only alphanumeric characters, hyphens, and underscores.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "timestamp": "2025-01-15T10:30:00Z",
    "path": "/api/images/generate",
    "method": "POST"
  }
}
```

## Rate Limiting

- **Limit**: 100 requests per 15-minute window
- **Headers**: Rate limit information is included in response headers
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## Endpoints

### Health Check

#### GET /health

Check the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 10485760
  },
  "pid": 12345
}
```

#### GET /api/health/detailed

Get detailed health information including AWS service status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 10485760
  },
  "pid": 12345,
  "services": {
    "aws": {
      "region": "us-east-1",
      "bedrock": "available",
      "s3": "available"
    },
    "database": "not_implemented",
    "cache": "not_implemented"
  },
  "dependencies": {
    "express": "✓",
    "cors": "✓",
    "helmet": "✓",
    "rateLimit": "✓"
  }
}
```

### Image Generation

#### POST /api/images/generate

Generate an image from a text prompt using AI models.

**Request Body:**
```json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "modelId": "stability.stable-diffusion-xl-v1",
  "size": "1024x1024",
  "steps": 50,
  "cfgScale": 7.5,
  "style": "photographic",
  "negativePrompt": "blurry, low quality, distorted"
}
```

**Parameters:**
- `prompt` (string, required): Text description of the image to generate (1-1000 characters)
- `modelId` (string, optional): AI model to use
  - `stability.stable-diffusion-xl-v1` (default)
  - `stability.stable-diffusion-xl-v0`
  - `amazon.titan-image-generator-v1`
- `size` (string, optional): Image dimensions (default: "1024x1024")
  - Supported sizes vary by model
- `steps` (number, optional): Number of diffusion steps (10-150, default: 50)
- `cfgScale` (number, optional): CFG scale for guidance (1-20, default: 7.5)
- `style` (string, optional): Artistic style preset
- `negativePrompt` (string, optional): What to avoid in the image (max 500 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "prompt": "A futuristic city at sunset with flying cars",
    "modelId": "stability.stable-diffusion-xl-v1",
    "size": "1024x1024",
    "url": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/image.jpg",
    "presignedUrl": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/image.jpg?signature=...",
    "generationTime": 2500,
    "timestamp": "2025-01-15T10:30:00Z",
    "metadata": {
      "model": "Stable Diffusion XL",
      "format": "base64",
      "size": "1024x1024",
      "s3Key": "images/2025/1/image.jpg",
      "fileSize": 524288
    }
  },
  "message": "Image generated successfully"
}
```

#### POST /api/images/variations

Generate multiple variations of an existing image.

**Request Body:**
```json
{
  "baseImageId": "550e8400-e29b-41d4-a716-446655440000",
  "count": 4,
  "modelId": "stability.stable-diffusion-xl-v1"
}
```

**Parameters:**
- `baseImageId` (string, required): ID of the base image
- `count` (number, optional): Number of variations (1-10, default: 4)
- `modelId` (string, optional): AI model to use

**Response:**
```json
{
  "success": true,
  "data": {
    "baseImageId": "550e8400-e29b-41d4-a716-446655440000",
    "count": 4,
    "variations": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "prompt": "A futuristic city at sunset with flying cars (variation 1)",
        "url": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/variation_1.jpg",
        "presignedUrl": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/variation_1.jpg?signature=...",
        "generationTime": 2300,
        "timestamp": "2025-01-15T10:30:00Z"
      }
      // ... more variations
    ]
  },
  "message": "Variations generated successfully"
}
```

#### GET /api/images/models

Get information about supported AI models.

**Response:**
```json
{
  "success": true,
  "data": {
    "stability.stable-diffusion-xl-v1": {
      "name": "Stable Diffusion XL",
      "maxTokens": 1000,
      "maxImages": 1,
      "supportedFormats": ["png", "jpeg"],
      "supportedSizes": ["1024x1024", "1152x896", "896x1152", "1216x832", "832x1216", "1344x768", "768x1344"]
    },
    "amazon.titan-image-generator-v1": {
      "name": "Titan Image Generator",
      "maxTokens": 1000,
      "maxImages": 1,
      "supportedFormats": ["png", "jpeg"],
      "supportedSizes": ["1024x1024", "1024x1408", "1408x1024"]
    }
  },
  "message": "Supported models retrieved successfully"
}
```

#### GET /api/images/list

List generated images with pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `continuationToken` (string, optional): Token for pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "key": "images/2025/1/image.jpg",
        "size": 524288,
        "lastModified": "2025-01-15T10:30:00Z",
        "url": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/image.jpg"
      }
    ],
    "pagination": {
      "isTruncated": false,
      "nextContinuationToken": null,
      "keyCount": 1,
      "page": 1,
      "limit": 20
    }
  },
  "message": "Images listed successfully"
}
```

#### GET /api/images/:key

Get metadata for a specific image.

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "images/2025/1/image.jpg",
    "contentType": "image/jpeg",
    "size": 524288,
    "lastModified": "2025-01-15T10:30:00Z",
    "metadata": {
      "prompt": "A futuristic city at sunset",
      "modelId": "stability.stable-diffusion-xl-v1",
      "size": "1024x1024",
      "steps": "50",
      "cfgScale": "7.5",
      "generationTime": "2500"
    }
  },
  "message": "Image retrieved successfully"
}
```

#### DELETE /api/images/:key

Delete a specific image.

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

#### POST /api/images/upload

Upload and process an existing image.

**Request:**
```http
POST /api/images/upload
Content-Type: multipart/form-data

Form Data:
- image: [file] (required)
- quality: 90 (optional)
- format: jpeg (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uploaded-image.jpg",
    "url": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/uploaded-image.jpg",
    "presignedUrl": "https://genai-image-generator.s3.amazonaws.com/images/2025/1/uploaded-image.jpg?signature=...",
    "size": 524288,
    "contentType": "image/jpeg",
    "metadata": {
      "originalName": "uploaded-image.jpg",
      "originalSize": "1048576",
      "upload-timestamp": "2025-01-15T10:30:00Z",
      "image-format": "jpeg",
      "image-quality": "90"
    }
  },
  "message": "Image uploaded successfully"
}
```

#### GET /api/images/stats

Get image generation statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "bucket": {
      "totalImages": 150,
      "totalSize": 78643200,
      "averageSize": 524288,
      "lastUpdated": "2025-01-15T10:30:00Z"
    },
    "models": {
      "stability.stable-diffusion-xl-v1": {
        "name": "Stable Diffusion XL",
        "maxTokens": 1000,
        "maxImages": 1,
        "supportedFormats": ["png", "jpeg"],
        "supportedSizes": ["1024x1024", "1152x896", "896x1152", "1216x832", "832x1216", "1344x768", "768x1344"]
      }
    }
  },
  "message": "Statistics retrieved successfully"
}
```

### Content Moderation

#### POST /api/moderation/check

Check if a text prompt is appropriate for image generation.

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over the ocean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompt": "A beautiful sunset over the ocean",
    "isApproved": true,
    "reason": "Content approved for generation",
    "category": "safe",
    "confidence": 0.95,
    "flaggedContent": [],
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "message": "Content approved for generation"
}
```

#### POST /api/moderation/batch

Check multiple prompts in batch (max 10 prompts).

**Request Body:**
```json
{
  "prompts": [
    "A beautiful sunset over the ocean",
    "A peaceful forest scene",
    "A violent scene with weapons"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "prompt": "A beautiful sunset over the ocean",
        "isApproved": true,
        "reason": "Content approved for generation",
        "category": "safe",
        "confidence": 0.95,
        "flaggedContent": []
      },
      {
        "prompt": "A peaceful forest scene",
        "isApproved": true,
        "reason": "Content approved for generation",
        "category": "safe",
        "confidence": 0.92,
        "flaggedContent": []
      },
      {
        "prompt": "A violent scene with weapons",
        "isApproved": false,
        "reason": "Content contains blocked keywords: violence, weapon",
        "category": "violence",
        "confidence": 1.0,
        "flaggedContent": ["violence", "weapon"]
      }
    ],
    "summary": {
      "total": 3,
      "approved": 2,
      "rejected": 1,
      "approvalRate": 66.67
    },
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "message": "Batch moderation completed: 2 approved, 1 rejected"
}
```

#### GET /api/moderation/guidelines

Get content moderation guidelines and policies.

**Response:**
```json
{
  "success": true,
  "data": {
    "blockedCategories": [
      "violence",
      "hate_speech",
      "sexual_content",
      "self_harm",
      "illegal_activities",
      "personal_information",
      "political_content"
    ],
    "blockedKeywords": [
      "violence", "blood", "gore", "weapon", "gun", "knife",
      "hate", "racist", "sexist", "discrimination",
      "nude", "naked", "sexual", "explicit",
      "illegal", "criminal", "drug",
      "personal", "private", "confidential"
    ],
    "guidelines": {
      "violence": "Content promoting or depicting violence, harm, or dangerous activities",
      "hate_speech": "Content promoting discrimination, hate, or targeting specific groups",
      "sexual_content": "Explicit sexual content or adult material",
      "self_harm": "Content promoting self-harm or dangerous behaviors",
      "illegal_activities": "Content promoting illegal activities or substances",
      "personal_information": "Content containing personal or sensitive information",
      "political_content": "Extreme political content or misinformation"
    },
    "compliance": {
      "eu_ai_act": "Compliant with EU AI Act requirements",
      "ethical_guidelines": "Follows responsible AI principles",
      "content_safety": "Prioritizes user safety and well-being"
    }
  },
  "message": "Moderation guidelines retrieved successfully"
}
```

#### GET /api/moderation/stats

Get moderation statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalKeywords": 25,
    "categories": 7,
    "lastUpdated": "2025-01-15T10:30:00Z"
  },
  "message": "Moderation statistics retrieved successfully"
}
```

#### POST /api/moderation/update-keywords

Update blocked keywords list (admin only).

**Request Body:**
```json
{
  "keywords": ["new_keyword1", "new_keyword2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "addedKeywords": ["new_keyword1", "new_keyword2"],
    "totalKeywords": 27
  },
  "message": "Blocked keywords updated successfully"
}
```

#### POST /api/moderation/test

Test moderation with sample prompts.

**Response:**
```json
{
  "success": true,
  "data": {
    "testPrompts": [
      {
        "prompt": "A beautiful sunset over the ocean",
        "isApproved": true,
        "reason": "Content approved for generation",
        "category": "safe",
        "confidence": 0.95
      },
      {
        "prompt": "A violent scene with weapons",
        "isApproved": false,
        "reason": "Content contains blocked keywords: violence, weapon",
        "category": "violence",
        "confidence": 1.0
      }
    ],
    "summary": {
      "total": 10,
      "approved": 8,
      "rejected": 2,
      "approvalRate": 80.0
    },
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "message": "Moderation test completed successfully"
}
```

## Error Codes

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - AWS service error |

### Error Types

| Error Type | Description | HTTP Code |
|------------|-------------|-----------|
| `ValidationError` | Invalid input parameters | 400 |
| `UnauthorizedError` | Missing or invalid API key | 401 |
| `ForbiddenError` | Insufficient permissions | 403 |
| `NotFoundError` | Resource not found | 404 |
| `RateLimitError` | Rate limit exceeded | 429 |
| `AWSServiceError` | AWS service unavailable | 503 |

### Common Error Messages

```json
{
  "error": {
    "message": "Validation failed",
    "status": 400,
    "details": [
      "Prompt is required",
      "Prompt must be less than 1000 characters"
    ]
  }
}
```

```json
{
  "error": {
    "message": "API key required",
    "status": 401
  }
}
```

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "status": 429,
    "retryAfter": 900
  }
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.genai-image-generator.com',
  headers: {
    'X-API-Key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});

// Generate an image
async function generateImage(prompt) {
  try {
    const response = await api.post('/api/images/generate', {
      prompt,
      modelId: 'stability.stable-diffusion-xl-v1',
      size: '1024x1024'
    });
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error.response.data);
    throw error;
  }
}

// Check content moderation
async function moderateContent(prompt) {
  try {
    const response = await api.post('/api/moderation/check', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error moderating content:', error.response.data);
    throw error;
  }
}
```

### Python

```python
import requests

class GenAIClient:
    def __init__(self, api_key, base_url='https://api.genai-image-generator.com'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }
    
    def generate_image(self, prompt, **kwargs):
        url = f"{self.base_url}/api/images/generate"
        data = {'prompt': prompt, **kwargs}
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def moderate_content(self, prompt):
        url = f"{self.base_url}/api/moderation/check"
        data = {'prompt': prompt}
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage
client = GenAIClient('your-api-key-here')
result = client.generate_image('A beautiful sunset')
print(result['data']['url'])
```

### cURL Examples

```bash
# Generate an image
curl -X POST https://api.genai-image-generator.com/api/images/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "prompt": "A futuristic city at sunset",
    "modelId": "stability.stable-diffusion-xl-v1",
    "size": "1024x1024"
  }'

# Check content moderation
curl -X POST https://api.genai-image-generator.com/api/moderation/check \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{"prompt": "A beautiful sunset"}'

# Get health status
curl https://api.genai-image-generator.com/health
```

## Best Practices

### Rate Limiting
- Implement exponential backoff for retries
- Monitor rate limit headers
- Cache responses when appropriate

### Error Handling
- Always check HTTP status codes
- Handle network errors gracefully
- Implement proper logging

### Security
- Keep API keys secure and rotate regularly
- Use HTTPS for all requests
- Validate all input data

### Performance
- Use appropriate image sizes
- Implement client-side caching
- Monitor response times