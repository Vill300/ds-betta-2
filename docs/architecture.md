# Discord Clone - Архитектура системы

## Обзор проекта

Создание современного аналога Discord с полным функционалом:
- Текстовые и голосовые каналы
- Реалтайм сообщения
- Система ролей и модерации
- Файлообмен и медиа
- Уведомления и поиск

## Технологический стек

### Backend
- **Runtime**: Node.js 18+ / Python 3.11+
- **Framework**: Express.js / FastAPI
- **База данных**: PostgreSQL 15+
- **ORM**: Prisma / SQLAlchemy
- **Кеширование**: Redis
- **WebSocket**: Socket.IO / WebSocket API
- **Файловое хранилище**: AWS S3 / MinIO
- **Поиск**: PostgreSQL Full-Text Search / Elasticsearch
- **Аутентификация**: JWT + OAuth2 (Google, GitHub)
- **Email**: SendGrid / AWS SES

### Frontend
- **Framework**: React 18+ с TypeScript
- **Build**: Vite
- **UI библиотека**: Tailwind CSS + Headless UI
- **Состояние**: Zustand / Redux Toolkit
- **WebSocket клиент**: Socket.IO-client
- **Markdown**: React Markdown + syntax highlighting
- **Файлы**: React Dropzone
- **WebRTC**: Simple-peer / PeerJS

### Infrastructure
- **Контейнеризация**: Docker + Docker Compose
- **Обратный прокси**: Nginx
- **STUN/TURN**: coturn сервер
- **Мониторинг**: Prometheus + Grafana
- **Деплой**: Docker Swarm / Kubernetes

## Архитектура системы

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Auth  │  Channels  │  Messages  │  Voice  │  Profile       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Nginx)                      │
├─────────────────────────────────────────────────────────────┤
│  Rate Limiting  │  Load Balancing  │  SSL Termination      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Services                           │
├─────────────────────────────────────────────────────────────┤
│  Auth Service  │  Message Service  │  File Service         │
│  User Service  │  Voice Service    │  Notification Service │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis Cache  │  S3 Storage  │  Search      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Real-time Layer                             │
├─────────────────────────────────────────────────────────────┤
│  WebSocket Server  │  WebRTC Signaling  │  Push Service     │
└─────────────────────────────────────────────────────────────┘
```

## Схема базы данных

### Основные таблицы

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  status VARCHAR(20) DEFAULT 'offline',
  last_seen TIMESTAMP DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Servers (Guilds)
```sql
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Channels
```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'text', -- text, voice, category
  position INTEGER,
  topic TEXT,
  parent_id UUID REFERENCES channels(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text', -- text, file, embed
  reply_to UUID REFERENCES messages(id),
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Roles & Permissions
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  permissions JSONB,
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id, server_id)
);
```

#### Direct Messages
```sql
CREATE TABLE dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dm_participants (
  conversation_id UUID REFERENCES dm_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);
```

#### Files
```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size BIGINT,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Индексы для производительности

```sql
-- Messages
CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_content_fts ON messages USING gin(to_tsvector('english', content));

-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- Channels
CREATE INDEX idx_channels_server ON channels(server_id);
CREATE INDEX idx_channels_parent ON channels(parent_id);

-- Real-time subscriptions
CREATE INDEX idx_user_sessions ON user_sessions(user_id, last_seen);
```

## API Design

### REST Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/oauth/google
GET    /api/auth/oauth/github
POST   /api/auth/oauth/callback
```

#### Users
```
GET    /api/users/me
PUT    /api/users/me
POST   /api/users/me/avatar
GET    /api/users/:id
GET    /api/users/:id/presence
```

#### Servers
```
GET    /api/servers
POST   /api/servers
GET    /api/servers/:id
PUT    /api/servers/:id
DELETE /api/servers/:id
POST   /api/servers/:id/invite
POST   /api/servers/join/:invite
```

#### Channels
```
GET    /api/servers/:serverId/channels
POST   /api/servers/:serverId/channels
GET    /api/channels/:id
PUT    /api/channels/:id
DELETE /api/channels/:id
```

#### Messages
```
GET    /api/channels/:channelId/messages
POST   /api/channels/:channelId/messages
PUT    /api/messages/:id
DELETE /api/messages/:id
POST   /api/messages/:id/reply
POST   /api/messages/:id/pin
DELETE /api/messages/:id/pin
```

### WebSocket Events

#### Connection
```javascript
// Client -> Server
{
  "event": "authenticate",
  "data": { "token": "jwt_token" }
}

// Server -> Client
{
  "event": "authenticated",
  "data": { "user": {...}, "servers": [...] }
}
```

#### Messages
```javascript
// Client -> Server
{
  "event": "message:send",
  "data": { "channelId": "...", "content": "..." }
}

// Server -> Client (broadcast)
{
  "event": "message:new",
  "data": { "message": {...}, "channelId": "..." }
}
```

#### Presence
```javascript
// Client -> Server
{
  "event": "presence:update",
  "data": { "status": "online" }
}

// Server -> Client (broadcast to server members)
{
  "event": "presence:user",
  "data": { "userId": "...", "status": "online" }
}
```

#### Voice
```javascript
// Client -> Server
{
  "event": "voice:join",
  "data": { "channelId": "..." }
}

// Server -> Client
{
  "event": "voice:offer",
  "data": { "offer": "...", "target": "..." }
}
```

## Security

### Authentication & Authorization
- JWT токены с refresh механизмом
- OAuth2 интеграция (Google, GitHub)
- RBAC (Role-Based Access Control)
- Rate limiting на API endpoints
- CORS настройки

### Data Protection
- Хеширование паролей (bcrypt)
- Шифрование sensitive данных
- Input validation и sanitization
- SQL injection protection
- XSS protection

### File Upload Security
- MIME type validation
- File size limits
- Virus scanning
- Secure file URLs

## Performance Optimizations

### Database
- Connection pooling
- Query optimization
- Indexing strategy
- Read replicas for heavy read operations

### Caching
- Redis для session data
- Redis для frequently accessed data
- CDN для static assets
- Browser caching для API responses

### Real-time
- WebSocket connection pooling
- Event broadcasting optimization
- Message pagination
- Voice server load balancing

## Deployment Architecture

### Development
```
┌─────────────────────────────────────┐
│  Frontend (Vite dev server)         │
│  Port: 3000                         │
├─────────────────────────────────────┤
│  Backend (Node.js)                  │
│  Port: 8000                         │
├─────────────────────────────────────┤
│  PostgreSQL                         │
│  Port: 5432                         │
├─────────────────────────────────────┤
│  Redis                              │
│  Port: 6379                         │
└─────────────────────────────────────┘
```

### Production
```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │  (Nginx/ALB)    │
                    └─────────┬───────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │  Web Server  │  │ Web Server   │  │ Web Server   │
    │  (Nginx)     │  │ (Nginx)      │  │ (Nginx)      │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                 │
    ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │ Backend API │  │ Backend API  │  │ Backend API  │
    │ (Node.js)   │  │ (Node.js)    │  │ (Node.js)    │
    └──────┬──────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                 │
    ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │ PostgreSQL  │  │ Redis Cache  │  │ File Storage │
    │  (Primary)  │  │              │  │ (S3/MinIO)   │
    └─────────────┘  └──────────────┘  └──────────────┘
```

## Monitoring & Observability

### Metrics
- Response times
- Error rates
- Database performance
- WebSocket connections
- Voice server health

### Logging
- Structured logging (JSON)
- Log aggregation (ELK stack)
- Error tracking (Sentry)
- Audit logs for security events

### Health Checks
- Database connectivity
- Redis connectivity
- External service availability
- Disk space monitoring

## Scalability Considerations

### Horizontal Scaling
- Stateless backend services
- Database read replicas
- WebSocket server clustering
- Voice server load balancing

### Vertical Scaling
- Connection pooling
- Query optimization
- Caching strategies
- Asset optimization

## Next Steps

1. ✅ Архитектура спроектирована
2. 🔄 Создание базовой структуры проекта
3. ⏳ Настройка development окружения
4. ⏳ Реализация core функций
5. ⏳ Интеграция компонентов
6. ⏳ Testing и optimization
7. ⏳ Production deployment