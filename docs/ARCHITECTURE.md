# AntiHack System Architecture Documentation

## Overview
AntiHack is structured around Clean Architecture principles separating responsibilities into defined layers:

```
+-------------------------------------------------------------+
|                      React 19 Frontend                      |
| (Vite + TypeScript + Tailwind CSS + Framer Motion + Query)  |
+------------------------------+------------------------------+
                               | REST API / JSON (JWT Auth)
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend API                     |
|  Routers -> Services -> Repositories -> SQLAlchemy Models    |
+------------------------------+------------------------------+
                               | ORM Layer
                               v
+-------------------------------------------------------------+
|                   Database Storage Layer                    |
|      (PostgreSQL Production / SQLite Local Fallback)         |
+-------------------------------------------------------------+
```

## Security Design
1. **Password Hashing**: Passlib with Bcrypt salting.
2. **Stateless Authentication**: OAuth2 Bearer JSON Web Tokens (HS256).
3. **Role Based Access Control (RBAC)**: Enforced via FastAPI dependencies (`get_current_user`, `get_current_admin_user`).
4. **Header Defense**: Custom middleware applying X-Frame-Options, X-Content-Type-Options, CSP policies.
