/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  User,
  Post,
  Story,
  Reel,
  Conversation,
  LiveStream,
  MarketplaceItem,
  Community,
  EventItem,
  NotificationItem,
  ReportItem,
  LiveGift,
} from './types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_STORIES,
  MOCK_REELS,
  MOCK_CONVERSATIONS,
  MOCK_LIVE_STREAM,
  MOCK_MARKETPLACE,
  MOCK_COMMUNITIES,
  MOCK_EVENTS,
  MOCK_NOTIFICATIONS,
  MOCK_REPORTS,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar, MobileTabBar } from './components/Navigation';
import { RightWidgets } from './components/RightWidgets';
import { FeedView } from './components/FeedView';
import { StoryViewerModal } from './components/StoriesTray';
import { ReelsView } from './components/ReelsView';
import { MessagesView } from './components/MessagesView';
import { CallOverlayModal } from './components/CallOverlayModal';
import { LiveStreamView } from './components/LiveStreamView';
import { MarketplaceView } from './components/MarketplaceView';
import { CommunitiesView } from './components/CommunitiesView';
import { EventsView } from './components/EventsView';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { CreatorStudioView } from './components/CreatorStudioView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CreatePostModal } from './components/CreatePostModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ReportModal } from './components/ReportModal';
import { ShareModal } from './components/ShareModal';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [viewedProfileUser, setViewedProfileUser] = useState<User | null>(null);

  // Content Data State
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [reels, setReels] = useState<Reel[]>(MOCK_REELS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [liveStream, setLiveStream] = useState<LiveStream>(MOCK_LIVE_STREAM);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);

  // Modals & Active Interaction State
  const [activeStoryModal, setActiveStoryModal] = useState<Story | null>(null);
  const [activeCall, setActiveCall] = useState<{ partner: User; isVideo: boolean } | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [activeShareItem, setActiveShareItem] = useState<Post | Reel | null>(null);
  const [activeReportPost, setActiveReportPost] = useState<Post | null>(null);

  // Preferences
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  // -------------------------------------------------------------
  // Engagement Handlers
  // -------------------------------------------------------------
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            author: currentUser,
            content: text,
            timestamp: 'Just now',
            likesCount: 0,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll) {
          if (p.poll.userVotedId === optionId) return p;
          const prevVoted = p.poll.userVotedId;
          const options = p.poll.options.map((opt) => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (opt.id === prevVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          });
          const totalVotes = prevVoted ? p.poll.totalVotes : p.poll.totalVotes + 1;
          return {
            ...p,
            poll: {
              ...p.poll,
              options,
              totalVotes,
              userVotedId: optionId,
            },
          };
        }
        return p;
      })
    );
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const handleAddReelComment = (reelId: string, text: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const comment = {
            id: `rc_${Date.now()}`,
            author: currentUser,
            content: text,
            timestamp: 'Just now',
            likesCount: 0,
          };
          return {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [comment, ...r.comments],
          };
        }
        return r;
      })
    );
  };

  const handleFollowToggle = (userId: string) => {
    // Update all users and post authors
    setPosts((prev) =>
      prev.map((p) => {
        if (p.author.id === userId) {
          const isFollowing = !p.author.isFollowing;
          return {
            ...p,
            author: {
              ...p.author,
              isFollowing,
              followersCount: isFollowing
                ? p.author.followersCount + 1
                : p.author.followersCount - 1,
            },
          };
        }
        return p;
      })
    );

    if (viewedProfileUser && viewedProfileUser.id === userId) {
      const isFollowing = !viewedProfileUser.isFollowing;
      setViewedProfileUser({
        ...viewedProfileUser,
        isFollowing,
        followersCount: isFollowing
          ? viewedProfileUser.followersCount + 1
          : viewedProfileUser.followersCount - 1,
      });
    }
  };

  // -------------------------------------------------------------
  // Messaging & Auto-Reply
  // -------------------------------------------------------------
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: 'Just now',
      status: 'sent' as const,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessageTimestamp: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    // Simulated reply after 1.5 seconds if direct message
    const targetConv = conversations.find((c) => c.id === conversationId);
    if (targetConv && !targetConv.isGroup) {
      const other = targetConv.participants.find((p) => p.id !== currentUser.id);
      if (other) {
        setTimeout(() => {
          const autoReplies = [
            `Hey ${currentUser.name.split(' ')[0]}! Love seeing this. Let me check my schedule.`,
            `Sounds amazing! I am testing the new live stream features today too.`,
            `Checked it out—the visuals look stunning! Let’s hop on a voice call soon.`,
          ];
          const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];

          setConversations((prev2) =>
            prev2.map((c) => {
              if (c.id === conversationId) {
                return {
                  ...c,
                  lastMessageTimestamp: 'Just now',
                  messages: [
                    ...c.messages,
                    {
                      id: `m_rep_${Date.now()}`,
                      senderId: other.id,
                      text: replyText,
                      timestamp: 'Just now',
                      status: 'read' as const,
                    },
                  ],
                };
              }
              return c;
            })
          );
        }, 1600);
      }
    }
  };

  // -------------------------------------------------------------
  // Live Streaming & Virtual Gifts
  // -------------------------------------------------------------
  const handleSendLiveComment = (text: string) => {
    const newComment = {
      id: `lc_${Date.now()}`,
      user: currentUser,
      text,
      timestamp: 'Just now',
    };
    setLiveStream((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));
  };

  const handleTipGift = (gift: LiveGift) => {
    // Deduct coins from user
    setCurrentUser((prev) => ({
      ...prev,
      coinsBalance: Math.max(0, prev.coinsBalance - gift.coins),
    }));

    // Add to live stream comments and total gifts
    const tipComment = {
      id: `lc_gift_${Date.now()}`,
      user: currentUser,
      text: `Tipped ${gift.name} (${gift.coins} coins)!`,
      timestamp: 'Just now',
      gift,
    };

    setLiveStream((prev) => ({
      ...prev,
      totalGiftsReceived: prev.totalGiftsReceived + gift.coins,
      comments: [tipComment, ...prev.comments],
    }));
  };

  // -------------------------------------------------------------
  // Marketplace & Commerce
  // -------------------------------------------------------------
  const handleAddMarketplaceItem = (itemData: Partial<MarketplaceItem>) => {
    const newItem: MarketplaceItem = {
      id: `mp_${Date.now()}`,
      seller: currentUser,
      title: itemData.title || 'UsWorld Product',
      price: itemData.price || 50,
      currency: 'USD',
      category: itemData.category || 'Cameras & Optics',
      location: itemData.location || 'Cape Town & Global Delivery',
      image: itemData.image || '/src/assets/images/usworld_market_camera_1793123387074.jpg',
      condition: itemData.condition || 'Like New',
      description: itemData.description || 'Verified item',
      inStock: true,
    };
    setMarketplaceItems([newItem, ...marketplaceItems]);
  };

  // -------------------------------------------------------------
  // Communities & Events
  // -------------------------------------------------------------
  const handleJoinCommunityToggle = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            membersCount: isJoined ? c.membersCount + 1 : c.membersCount - 1,
          };
        }
        return c;
      })
    );
  };

  const handleRsvpToggle = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const isRsvp = !e.isRsvp;
          return {
            ...e,
            isRsvp,
            rsvpCount: isRsvp ? e.rsvpCount + 1 : e.rsvpCount - 1,
          };
        }
        return e;
      })
    );
  };

  const handleCreateEvent = (eventData: Partial<EventItem>) => {
    const newEvent: EventItem = {
      id: `evt_${Date.now()}`,
      title: eventData.title || 'UsWorld Creator Event',
      organizer: currentUser,
      date: eventData.date || 'Next Saturday',
      time: eventData.time || '18:00 UTC',
      location: eventData.location || 'UsWorld Live Stream Stage',
      isVirtual: eventData.isVirtual ?? true,
      coverImage: eventData.coverImage || '/src/assets/images/usworld_livestream_dj_1793123386386.jpg',
      description: eventData.description || 'Community gathering on UsWorld.',
      rsvpCount: 1,
      isRsvp: true,
    };
    setEvents([newEvent, ...events]);
  };

  // -------------------------------------------------------------
  // Post Creation
  // -------------------------------------------------------------
  const handleCreatePost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      timestamp: 'Just now',
      content: postData.content || '',
      image: postData.image,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      isSaved: false,
      location: postData.location,
      feeling: postData.feeling,
      poll: postData.poll,
      comments: [],
      visibility: postData.visibility || 'public',
      tags: ['UsWorld', 'Creator'],
    };
    setPosts([newPost, ...posts]);
    setActiveTab('feed');
  };

  // -------------------------------------------------------------
  // Moderation & Reports
  // -------------------------------------------------------------
  const handleSubmitReport = (reason: string, details: string) => {
    if (!activeReportPost) return;
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      targetType: 'post',
      targetId: activeReportPost.id,
      reportedBy: currentUser.username,
      reason,
      details,
      status: 'pending',
      timestamp: 'Just now',
      severity: 'medium',
    };
    setReports([newReport, ...reports]);
  };

  const handleResolveReport = (
    reportId: string,
    action: 'dismiss' | 'remove_content' | 'ban_user'
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: 'resolved' };
        }
        return r;
      })
    );

    if (action === 'remove_content') {
      const rep = reports.find((r) => r.id === reportId);
      if (rep && rep.targetType === 'post') {
        setPosts((prev) => prev.filter((p) => p.id !== rep.targetId));
      }
    }
  };

  // -------------------------------------------------------------
  // Profile & Persona Switcher
  // -------------------------------------------------------------
  const handleViewProfile = (user: User) => {
    setViewedProfileUser(user);
    setActiveTab('profile');
  };

  const handleSwitchUser = (userId: string) => {
    const all = { [CURRENT_USER.id]: CURRENT_USER, ...MOCK_USERS };
    if (all[userId]) {
      setCurrentUser(all[userId]);
      setViewedProfileUser(null);
    }
    setShowSettingsModal(false);
  };

  const handleUpdateBio = (bio: string, loc: string, website: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      bio,
      location: loc,
      website,
    }));
  };

  const handleTipUser = (user: User, amount: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      coinsBalance: Math.max(0, prev.coinsBalance - amount),
    }));
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const displayProfileUser =
    activeTab === 'profile' && viewedProfileUser ? viewedProfileUser : currentUser;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Bar Header (Adheres to Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'profile') setViewedProfileUser(null);
        }}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        openCreateModal={() => setShowCreatePostModal(true)}
        openLiveStream={() => setActiveTab('live')}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        isDark={isDark}
        toggleDark={toggleDark}
        language={language}
        setLanguage={setLanguage}
        onSearchClick={() => setActiveTab('explore')}
      />

      {/* Main App Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Left Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'profile') setViewedProfileUser(null);
          }}
          currentUser={currentUser}
          unreadMessagesCount={unreadMessagesCount}
          onOpenSettings={() => setShowSettingsModal(true)}
          onSwitchAccount={() => setShowSettingsModal(true)}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              stories={stories}
              onOpenStory={(s) => setActiveStoryModal(s)}
              onAddStory={() => setShowCreatePostModal(true)}
              onLikePost={handleLikePost}
              onSavePost={handleSavePost}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onOpenCreatePost={() => setShowCreatePostModal(true)}
              onReportPost={(p) => setActiveReportPost(p)}
              onSharePost={(p) => setActiveShareItem(p)}
              onViewProfile={handleViewProfile}
              onFollowToggle={handleFollowToggle}
            />
          )}

          {activeTab === 'reels' && (
            <ReelsView
              reels={reels}
              currentUser={currentUser}
              onLikeReel={handleLikeReel}
              onSaveReel={handleSaveReel}
              onAddComment={handleAddReelComment}
              onFollowToggle={handleFollowToggle}
              onViewProfile={handleViewProfile}
              onShareReel={(r) => setActiveShareItem(r)}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesView
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onStartCall={(partner, isVideo) => setActiveCall({ partner, isVideo })}
              onViewProfile={handleViewProfile}
            />
          )}

          {activeTab === 'live' && (
            <LiveStreamView
              liveStream={liveStream}
              currentUser={currentUser}
              onSendComment={handleSendLiveComment}
              onTipGift={handleTipGift}
              onViewProfile={handleViewProfile}
              onFollowToggle={handleFollowToggle}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView
              items={marketplaceItems}
              currentUser={currentUser}
              onContactSeller={(seller) => {
                handleViewProfile(seller);
                setActiveTab('messages');
              }}
              onAddItem={handleAddMarketplaceItem}
              onViewProfile={handleViewProfile}
            />
          )}

          {activeTab === 'communities' && (
            <CommunitiesView
              communities={communities}
              currentUser={currentUser}
              onJoinToggle={handleJoinCommunityToggle}
            />
          )}

          {activeTab === 'events' && (
            <EventsView
              events={events}
              currentUser={currentUser}
              onRsvpToggle={handleRsvpToggle}
              onCreateEvent={handleCreateEvent}
              onViewProfile={handleViewProfile}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              allUsers={Object.values(MOCK_USERS)}
              posts={posts}
              currentUser={currentUser}
              onFollowToggle={handleFollowToggle}
              onViewProfile={handleViewProfile}
              onSelectPost={(p) => {
                setActiveTab('feed');
              }}
            />
          )}

          {activeTab === 'creator' && (
            <CreatorStudioView
              currentUser={currentUser}
              onTopUpCoins={(coins) =>
                setCurrentUser((prev) => ({ ...prev, coinsBalance: prev.coinsBalance + coins }))
              }
              onWithdrawEarnings={(amt) => {}}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardView reports={reports} onResolveReport={handleResolveReport} />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={displayProfileUser}
              currentUser={currentUser}
              posts={posts}
              reels={reels}
              onFollowToggle={handleFollowToggle}
              onStartChat={(u) => {
                setActiveTab('messages');
              }}
              onUpdateBio={handleUpdateBio}
              onTipUser={handleTipUser}
            />
          )}
        </main>

        {/* Right Desktop Widgets (Trending, Suggested Creators, Wallet) */}
        {activeTab !== 'messages' && (
          <RightWidgets
            usersToFollow={Object.values(MOCK_USERS)}
            upcomingEvents={events}
            currentUser={currentUser}
            onFollowToggle={handleFollowToggle}
            onViewProfile={handleViewProfile}
            onOpenCreatorStudio={() => setActiveTab('creator')}
            onSelectEvent={(evt) => setActiveTab('events')}
          />
        )}
      </div>

      {/* Mobile Fixed Bottom Tab Bar */}
      <MobileTabBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'profile') setViewedProfileUser(null);
        }}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Modals & Overlays */}
      {/* 1. 24h Story Viewer */}
      {activeStoryModal && (
        <StoryViewerModal
          story={activeStoryModal}
          allStories={stories}
          onClose={() => setActiveStoryModal(null)}
          onNextStory={() => {
            const idx = stories.findIndex((s) => s.id === activeStoryModal.id);
            if (idx < stories.length - 1) setActiveStoryModal(stories[idx + 1]);
            else setActiveStoryModal(null);
          }}
          onPrevStory={() => {
            const idx = stories.findIndex((s) => s.id === activeStoryModal.id);
            if (idx > 0) setActiveStoryModal(stories[idx - 1]);
          }}
          onSendReply={(sId, rep) => {}}
        />
      )}

      {/* 2. WebRTC Simulated Audio & Video Call Overlay */}
      {activeCall && (
        <CallOverlayModal
          partner={activeCall.partner}
          isVideo={activeCall.isVideo}
          onEndCall={() => setActiveCall(null)}
        />
      )}

      {/* 3. Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setShowCreatePostModal(false)}
          onSubmitPost={handleCreatePost}
        />
      )}

      {/* 4. Settings & Privacy Modal */}
      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setShowSettingsModal(false)}
          isDark={isDark}
          toggleDark={toggleDark}
          language={language}
          setLanguage={setLanguage}
          onSwitchUser={handleSwitchUser}
          availableUsers={{ [CURRENT_USER.id]: CURRENT_USER, ...MOCK_USERS }}
        />
      )}

      {/* 5. Notifications Drawer */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllAsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onViewProfile={handleViewProfile}
        />
      )}

      {/* 6. Report Content Modal */}
      {activeReportPost && (
        <ReportModal
          post={activeReportPost}
          onClose={() => setActiveReportPost(null)}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {/* 7. Share Post / Reel Modal */}
      {activeShareItem && (
        <ShareModal
          item={activeShareItem}
          onClose={() => setActiveShareItem(null)}
          onSendViaChat={(name) => {
            setActiveTab('messages');
          }}
        />
      )}
    </div>
  );
}
