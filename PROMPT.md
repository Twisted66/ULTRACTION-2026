# ULTRACTION CUSTOM GPT CONFIGURATION REFERENCE
# Generated: Friday, March 6, 2026

================================================================================
1. AUTHENTICATION DETAILS
================================================================================
Unified API Key: 5991308d17448b76b5f727c9993c6a51b17b341c3e39b143

Jobs API Header: x-jobs-api-key
News API Header: x-news-api-key

Note: In ChatGPT "Authentication" settings, use:
- Auth Type: API Key
- Custom Header Name: x-jobs-api-key (or x-news-api-key)
- Key: 5991308d17448b76b5f727c9993c6a51b17b341c3e39b143

================================================================================
2. AGENT SYSTEM PROMPT (Instructions)
================================================================================
# Role: ULTRACTION Content & Recruitment Manager
You are the official digital assistant for ULTRACTION General Contracting LLC. Your primary responsibility is to manage the company's public-facing job listings and news articles through the ULTRACTION API.

# Key Capabilities:
1. Manage Jobs: Retrieve, post, update, and archive job vacancies.
   - Required for POST: title, location, description.
   - Optional: department, employmentType.
2. Manage News: Curate news articles for the website.
   - Required for POST: title, excerpt, content, category, author, image, sourceName, sourceUrl, sourcePublishedAt.
3. Data Integrity: Always format JSON payloads correctly. Use ISO 8601 dates for all timestamp fields.

# Authentication:
Use the provided API Key for all protected (POST, PATCH, DELETE) operations.
- Job Header: x-jobs-api-key
- News Header: x-news-api-key

# Response Tone:
Professional, efficient, and aligned with ULTRACTION's brand as a premium UAE construction firm.

================================================================================
3. OPENAPI SCHEMA (Actions)
================================================================================
openapi: 3.1.0
info:
  title: ULTRACTION Management API
  version: 1.0.0
servers:
  - url: https://ultraction.ae/api
paths:
  /jobs:
    get:
      operationId: listJobs
      summary: List job vacancies
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [open, closed, all]
            default: open
      responses:
        '200':
          description: OK
    post:
      operationId: createJob
      summary: Create a new job vacancy
      security:
        - JobsAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, location, description]
              properties:
                title: {type: string}
                location: {type: string}
                description: {type: string}
                department: {type: string}
                employmentType: {type: string}
      responses:
        '201':
          description: Created
  /news:
    get:
      operationId: listNews
      summary: List news articles
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [published, draft, archived, all]
            default: published
      responses:
        '200':
          description: OK
    post:
      operationId: createNews
      summary: Create a news article
      security:
        - NewsAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, excerpt, content, category, author, image, sourceName, sourceUrl, sourcePublishedAt]
              properties:
                title: {type: string}
                excerpt: {type: string, maxLength: 600}
                content: {type: string}
                category: {type: string}
                author: {type: string}
                image: {type: string}
                sourceName: {type: string}
                sourceUrl: {type: string}
                sourcePublishedAt: {type: string, format: date-time}
      responses:
        '201':
          description: Created

components:
  securitySchemes:
    JobsAuth:
      type: apiKey
      in: header
      name: x-jobs-api-key
    NewsAuth:
      type: apiKey
      in: header
      name: x-news-api-key@@
