import React, { useState } from 'react';
import { Conversation, User, ChatMessage } from '../types';
import {
  Search,
  Phone,
  Video,
  Send,
  Mic,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Users,
  Play,
  Pause,
} from 'lucide-react';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => void;
  onStartCall: (partner: User, isVideo: boolean) => void;
  onViewProfile: (user: User) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onStartCall,
  onViewProfile,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const getOtherParticipant = (conv: Conversation): User => {
    return (
      conv.participants.find((p) => p.id !== currentUser.id) ||
      conv.participants[0]
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    if (conv.isGroup) {
      return (
        conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true
      );
    }
    const other = getOtherParticipant(conv);
    return (
      other.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, messageText.trim());
    setMessageText('');
  };

  const currentPartner = activeConversation
    ? getOtherParticipant(activeConversation)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex h-[78vh] min-h-[580px]">
      {/* Left Pane: Conversations List */}
      <div
        className={`w-full md:w-80 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 shrink-0 ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Messages
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Encrypted Chat
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversation?.id;
            const other = getOtherParticipant(conv);
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  {conv.isGroup ? (
                    <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                      <Users className="w-5 h-5" />
                    </div>
                  ) : (
                    <img
                      src={other.avatar}
                      alt={other.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {conv.isGroup ? conv.title : other.name}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessageTimestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {lastMsg ? lastMsg.text : 'Started conversation'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Active Chat Conversation */}
      {activeConversation && currentPartner ? (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
          {/* Chat Header */}
          <div className="p-3.5 sm:px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConvId('')}
                className="md:hidden text-xs text-indigo-600 dark:text-indigo-400 font-medium mr-1"
              >
                ← Back
              </button>

              <button
                onClick={() => !activeConversation.isGroup && onViewProfile(currentPartner)}
                className="flex items-center gap-3 text-left group"
              >
                <div className="relative">
                  {activeConversation.isGroup ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600">
                      <Users className="w-4 h-4" />
                    </div>
                  ) : (
                    <img
                      src={currentPartner.avatar}
                      alt={currentPartner.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:underline">
                    {activeConversation.isGroup ? activeConversation.title : currentPartner.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeConversation.isGroup
                      ? `${activeConversation.participants.length} members`
                      : `@${currentPartner.username} · Online`}
                  </p>
                </div>
              </button>
            </div>

            {/* Calling Triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartCall(currentPartner, false)}
                className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Start Voice Call"
                aria-label="Start Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStartCall(currentPartner, true)}
                className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Start Video Call"
                aria-label="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
            {activeConversation.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const sender =
                activeConversation.participants.find((p) => p.id === msg.senderId) ||
                currentPartner;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={sender.avatar}
                      alt={sender.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {!isMine && activeConversation.isGroup && (
                      <p className="text-[10px] font-semibold text-indigo-500 mb-1">
                        {sender.name}
                      </p>
                    )}
                    <p>{msg.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                        isMine ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Attach media or photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Send Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${
                activeConversation.isGroup ? activeConversation.title : '@' + currentPartner.username
              }...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
};
