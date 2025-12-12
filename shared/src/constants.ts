// API Constants
export const API_VERSION = 'v1';
export const API_BASE_URL = '/api'; // Will be configured per environment

// WebSocket Constants
export const WS_RECONNECT_INTERVAL = 5000;
export const WS_MAX_RECONNECT_ATTEMPTS = 10;
export const WS_HEARTBEAT_INTERVAL = 30000;

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_MESSAGE = 10;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg'
];

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm'
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json',
  'application/xml'
];

export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_AUDIO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES
];

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Message Constants
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_MESSAGES_PER_CHANNEL = 10000;

// User Constants
export const MAX_USERNAME_LENGTH = 32;
export const MAX_DISPLAY_NAME_LENGTH = 32;
export const MAX_BIO_LENGTH = 190;

// Server Constants
export const MAX_SERVER_NAME_LENGTH = 100;
export const MAX_SERVER_DESCRIPTION_LENGTH = 1024;
export const MAX_SERVERS_PER_USER = 100;

// Channel Constants
export const MAX_CHANNEL_NAME_LENGTH = 100;
export const MAX_CHANNEL_TOPIC_LENGTH = 1024;
export const MAX_CHANNELS_PER_SERVER = 500;

// Role Constants
export const MAX_ROLES_PER_SERVER = 250;
export const MAX_ROLE_NAME_LENGTH = 100;

// Real-time Constants
export const TYPING_TIMEOUT = 3000; // 3 seconds
export const PRESENCE_UPDATE_INTERVAL = 60000; // 1 minute

// Voice Constants
export const MAX_VOICE_PARTICIPANTS = 50;
export const VOICE_QUALITY_PRESETS = {
  low: { bitrate: 32, sampleRate: 24000 },
  medium: { bitrate: 64, sampleRate: 48000 },
  high: { bitrate: 128, sampleRate: 48000 }
};

// Security Constants
export const JWT_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';
export const PASSWORD_MIN_LENGTH = 8;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Rate Limiting Constants
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const MESSAGE_RATE_LIMIT = {
  window: 5000, // 5 seconds
  maxMessages: 5
};

// Cache Constants
export const CACHE_TTL = {
  user: 5 * 60, // 5 minutes
  server: 2 * 60, // 2 minutes
  channel: 1 * 60, // 1 minute
  message: 30, // 30 seconds
  presence: 10 // 10 seconds
};

// Notification Constants
export const NOTIFICATION_SOUND = true;
export const NOTIFICATION_VIBRATION = true;

// Theme Constants
export const DEFAULT_THEME = 'dark';
export const AVAILABLE_THEMES = ['light', 'dark'] as const;

// Language Constants
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = [
  'en', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'
] as const;

// Status Messages
export const PRESENCE_MESSAGES = {
  online: 'Online',
  idle: 'Away',
  dnd: 'Do Not Disturb',
  offline: 'Offline'
} as const;

// Permission Names
export const PERMISSION_NAMES = {
  VIEW_CHANNEL: 'View Channel',
  SEND_MESSAGES: 'Send Messages',
  EMBED_LINKS: 'Embed Links',
  ATTACH_FILES: 'Attach Files',
  READ_MESSAGE_HISTORY: 'Read Message History',
  MENTION_EVERYONE: 'Mention Everyone',
  USE_EXTERNAL_EMOJIS: 'Use External Emojis',
  ADD_REACTIONS: 'Add Reactions',
  MANAGE_MESSAGES: 'Manage Messages',
  MANAGE_CHANNELS: 'Manage Channels',
  MANAGE_SERVER: 'Manage Server',
  MANAGE_ROLES: 'Manage Roles',
  MANAGE_MEMBERS: 'Manage Members',
  KICK_MEMBERS: 'Kick Members',
  BAN_MEMBERS: 'Ban Members',
  CONNECT: 'Connect',
  SPEAK: 'Speak',
  STREAM: 'Stream',
  MUTE_MEMBERS: 'Mute Members',
  DEAFEN_MEMBERS: 'Deafen Members',
  MOVE_MEMBERS: 'Move Members',
  ADMINISTRATOR: 'Administrator'
} as const;