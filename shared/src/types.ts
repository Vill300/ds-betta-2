// Core entity types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User related types
export enum UserStatus {
  ONLINE = 'online',
  IDLE = 'idle',
  DND = 'dnd',
  OFFLINE = 'offline'
}

export interface User extends BaseEntity {
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  status: UserStatus;
  lastSeen: Date;
  emailVerified: boolean;
}

export interface UserProfile extends Partial<User> {
  // Extended profile fields
  theme?: 'light' | 'dark';
  language?: string;
  timezone?: string;
}

// Server/Guild types
export enum ChannelType {
  TEXT = 'text',
  VOICE = 'voice',
  CATEGORY = 'category'
}

export interface Server extends BaseEntity {
  name: string;
  description?: string;
  iconUrl?: string;
  ownerId: string;
  memberCount?: number;
}

export interface Channel extends BaseEntity {
  serverId: string;
  name: string;
  type: ChannelType;
  position: number;
  topic?: string;
  parentId?: string; // For nested channels/categories
  memberCount?: number;
}

// Message types
export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  EMBED = 'embed',
  SYSTEM = 'system'
}

export interface Message extends BaseEntity {
  channelId: string;
  userId: string;
  content: string;
  type: MessageType;
  replyTo?: string; // Message ID
  pinned: boolean;
  editedAt?: Date;
  attachments?: Attachment[];
}

export interface Attachment extends BaseEntity {
  messageId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// Direct Message types
export interface DMConversation extends BaseEntity {
  // Direct message conversation
}

export interface DMParticipant {
  conversationId: string;
  userId: string;
}

// Roles and Permissions
export interface Role extends BaseEntity {
  serverId: string;
  name: string;
  color?: string;
  permissions: Permission[];
  position: number;
  hoist: boolean; // Display separately from others
  mentionable: boolean;
}

export enum Permission {
  // Channel permissions
  VIEW_CHANNEL = 'VIEW_CHANNEL',
  SEND_MESSAGES = 'SEND_MESSAGES',
  EMBED_LINKS = 'EMBED_LINKS',
  ATTACH_FILES = 'ATTACH_FILES',
  READ_MESSAGE_HISTORY = 'READ_MESSAGE_HISTORY',
  MENTION_EVERYONE = 'MENTION_EVERYONE',
  USE_EXTERNAL_EMOJIS = 'USE_EXTERNAL_EMOJIS',
  ADD_REACTIONS = 'ADD_REACTIONS',
  MANAGE_MESSAGES = 'MANAGE_MESSAGES',
  MANAGE_CHANNELS = 'MANAGE_CHANNELS',
  
  // Server permissions
  MANAGE_SERVER = 'MANAGE_SERVER',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  KICK_MEMBERS = 'KICK_MEMBERS',
  BAN_MEMBERS = 'BAN_MEMBERS',
  
  // Voice permissions
  CONNECT = 'CONNECT',
  SPEAK = 'SPEAK',
  STREAM = 'STREAM',
  MUTE_MEMBERS = 'MUTE_MEMBERS',
  DEAFEN_MEMBERS = 'DEAFEN_MEMBERS',
  MOVE_MEMBERS = 'MOVE_MEMBERS',
  
  // Admin permissions
  ADMINISTRATOR = 'ADMINISTRATOR'
}

export interface UserRole {
  userId: string;
  roleId: string;
  serverId: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// WebSocket Event types
export enum WSEventType {
  // Connection events
  AUTHENTICATE = 'authenticate',
  AUTHENTICATED = 'authenticated',
  DISCONNECT = 'disconnect',
  
  // Message events
  MESSAGE_SEND = 'message:send',
  MESSAGE_NEW = 'message:new',
  MESSAGE_EDIT = 'message:edit',
  MESSAGE_DELETE = 'message:delete',
  MESSAGE_PIN = 'message:pin',
  MESSAGE_UNPIN = 'message:unpin',
  
  // Presence events
  PRESENCE_UPDATE = 'presence:update',
  PRESENCE_USER = 'presence:user',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',
  
  // Channel events
  CHANNEL_CREATE = 'channel:create',
  CHANNEL_UPDATE = 'channel:update',
  CHANNEL_DELETE = 'channel:delete',
  
  // Voice events
  VOICE_JOIN = 'voice:join',
  VOICE_LEAVE = 'voice:leave',
  VOICE_OFFER = 'voice:offer',
  VOICE_ANSWER = 'voice:answer',
  VOICE_ICE_CANDIDATE = 'voice:ice-candidate',
  VOICE_MUTE = 'voice:mute',
  VOICE_DEAFEN = 'voice:deafen',
  
  // Server events
  SERVER_MEMBER_ADD = 'server:member:add',
  SERVER_MEMBER_REMOVE = 'server:member:remove',
  SERVER_ROLE_UPDATE = 'server:role:update',
  
  // Notification events
  NOTIFICATION_NEW = 'notification:new'
}

export interface WSEvent<T = any> {
  type: WSEventType;
  data: T;
  timestamp?: Date;
  userId?: string;
  serverId?: string;
  channelId?: string;
}

// Request/Response DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface CreateServerRequest {
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  topic?: string;
  parentId?: string;
}

export interface SendMessageRequest {
  channelId: string;
  content: string;
  replyTo?: string;
  attachments?: File[];
}

export interface UpdateMessageRequest {
  content: string;
}

// Search types
export interface SearchQuery {
  query: string;
  serverId?: string;
  channelId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  messages: Message[];
  users: User[];
  servers: Server[];
}

// File upload types
export interface FileUpload {
  file: File;
  channelId?: string;
  messageId?: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

// Voice types
export interface VoiceRoom {
  id: string;
  channelId: string;
  participants: VoiceParticipant[];
  maxParticipants: number;
}

export interface VoiceParticipant {
  userId: string;
  joinedAt: Date;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  MESSAGE = 'message',
  MENTION = 'mention',
  FRIEND_REQUEST = 'friend_request',
  SERVER_INVITE = 'server_invite'
}

// Error types
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T> = Partial<CreateInput<T>>;