# Course Management System (Backend Fragment)

This repository contains a core backend module for a professional educational platform. It focuses on hierarchical course structures (Levels & Lessons) and a robust Role-Based Access Control (RBAC) system.

**Live Project:** [on-the-next-level.pp.ua](https://on-the-next-level.pp.ua)

## 🚀 Features

* **Hierarchical Data Modeling:** Manages complex relationships between Courses, Levels, and Lessons using MongoDB and Mongoose.
* **Role-Based Access Control (RBAC):** Custom Guards to manage permissions for `USER`, `ADMIN`, and `SUPER_ADMIN`.
* **JWT Authentication:** Secure stateless authentication using NestJS Passport/JWT.
* **Automated Documentation:** Fully documented REST API using Swagger (OpenAPI).
* **Data Validation:** Strong input validation using `class-validator` and `class-transformer`.

## 🛠 Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Language:** TypeScript
* **Auth:** JWT (JSON Web Tokens)
* **API Docs:** Swagger UI

## 📁 Project Structure (Current Module)

* `auth/` - Authentication logic, JWT strategy, and Roles management.
* `courses/` - Core business logic for managing educational content.
    * `dto/` - Data Transfer Objects for request validation.
    * `schemas/` - Mongoose database models.
    * `courses.controller.ts` - API endpoints and route protection.



## 🔑 Permissions Matrix

| Endpoint | Method | Roles Allowed | Description |
| :--- | :--- | :--- | :--- |
| `/levels-lessons` | GET | USER, ADMIN, SUPER_ADMIN | Fetch grouped courses |
| `/levels` | GET | USER, ADMIN, SUPER_ADMIN | Fetch specific course types |
| `/levels-lessons` | PUT | ADMIN, SUPER_ADMIN | Replace/Bulk update content |

## 🛠 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>