export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  likesCount?: number;
  isFollowing?: boolean;
  isBusiness?: boolean;
  businessCategory?: string;
  isCreator?: boolean;
  subscriberCount?: number;
  coinsBalance: number;
  badges?: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: User;
  timestamp: string;
  content: string;
  image?: string;
  videoUrl?: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  isSaved?: boolean;
  tags?: string[];
  location?: string;
  feeling?: string;
  poll?: Poll;
  comments: Comment[];
  visibility: 'public' | 'followers' | 'subscribers';
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  durationMs: number;
  caption?: string;
  timestamp: string;
}

export interface Story {
  id: string;
  user: User;
  hasUnseen: boolean;
  items: StoryItem[];
}

export interface Reel {
  id: string;
  author: User;
  caption: string;
  musicTrack: string;
  videoCover: string;
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  audioDuration?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  title?: string;
  participants: User[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageTimestamp: string;
}

export interface LiveGift {
  id: string;
  name: string;
  icon: string;
  coins: number;
  color: string;
}

export interface LiveStreamComment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  gift?: LiveGift;
}

export interface LiveStream {
  id: string;
  host: User;
  title: string;
  category: string;
  viewersCount: number;
  thumbnail: string;
  isLive: boolean;
  comments: LiveStreamComment[];
  totalGiftsReceived: number;
}

export interface MarketplaceItem {
  id: string;
  seller: User;
  title: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  image: string;
  condition: string;
  description: string;
  inStock: boolean;
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  avatar: string;
  category: string;
  membersCount: number;
  isJoined: boolean;
  rules: string[];
}

export interface EventItem {
  id: string;
  title: string;
  organizer: User;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  coverImage: string;
  description: string;
  rsvpCount: number;
  isRsvp: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'gift' | 'purchase' | 'system';
  actor: User;
  targetText: string;
  timestamp: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  targetType: 'post' | 'user' | 'message';
  targetId: string;
  reportedBy: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export type ActiveTab =
  | 'feed'
  | 'stories'
  | 'reels'
  | 'explore'
  | 'messages'
  | 'live'
  | 'marketplace'
  | 'communities'
  | 'events'
  | 'creator'
  | 'profile'
  | 'admin';
