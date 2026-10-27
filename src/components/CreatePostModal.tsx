import React, { useState } from 'react';
import { User, Post, Poll } from '../types';
import { generateAICaption, runAIModerationScan } from '../services/aiService';
import {
  X,
  Image as ImageIcon,
  BarChart2,
  Sparkles,
  MapPin,
  Smile,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitPost: (postData: Partial<Post>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'subscribers'>('public');

  // Poll state
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  // AI Assistant state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiMood, setAiMood] = useState('Inspiring');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAiPolish = async () => {
    setIsGeneratingAI(true);
    setModerationWarning(null);
    try {
      const topic = aiTopic || content || 'Creative freedom & global connection';
      const result = await generateAICaption(topic, aiMood);
      setContent(result.caption + '\n\n' + result.hashtags.join(' '));
      setShowAiPanel(false);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;

    // Run AI content safety scan
    const scan = await runAIModerationScan(content);
    if (!scan.isSafe) {
      setModerationWarning(scan.reason);
      return;
    }

    let pollData: Poll | undefined = undefined;
    if (hasPoll && pollQuestion.trim()) {
      pollData = {
        id: `poll_${Date.now()}`,
        question: pollQuestion.trim(),
        options: pollOptions.map((opt, i) => ({
          id: `opt_${i + 1}`,
          text: opt || `Choice ${i + 1}`,
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    onSubmitPost({
      content: content.trim(),
      image: imagePreview || undefined,
      location: location || undefined,
      feeling: feeling || undefined,
      visibility,
      poll: pollData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base font-display">Create UsWorld Post</h3>
            <span className="text-[11px] text-slate-400">· Connect. Share. Inspire.</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info & Visibility */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs">
            {visibility === 'public' ? (
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="public">Public</option>
              <option value="followers">Followers Only</option>
              <option value="subscribers">Subscribers Only</option>
            </select>
          </div>
        </div>

        {/* AI Content Assistant Panel */}
        {showAiPanel && (
          <div className="mb-3 p-3.5 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>AI Creative Caption & Hashtags Generator</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAiPanel(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="What topic or story are you sharing? (e.g. Sunset in Cape Town, tech startup launch)"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Tone:</span>
              {(['Inspiring', 'Creative', 'Tech'] as const).map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setAiMood(mood)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    aiMood === mood
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {mood}
                </button>
              ))}

              <button
                type="button"
                disabled={isGeneratingAI}
                onClick={handleAiPolish}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content Textarea */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={4}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setModerationWarning(null);
            }}
            placeholder="What is inspiring you today? Share a moment, project, or question..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
          />

          {/* Moderation Warning */}
          {moderationWarning && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{moderationWarning}</span>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden max-h-52 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={imagePreview}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Interactive Poll Builder */}
          {hasPoll && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-500" />
                  <span>Community Poll</span>
                </span>
                <button
                  type="button"
                  onClick={() => setHasPoll(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Ask a community question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />

              <div className="space-y-1.5">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Choice ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...pollOptions];
                        next[idx] = e.target.value;
                        setPollOptions(next);
                      }}
                      className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add another option</span>
                </button>
              )}
            </div>
          )}

          {/* Extra Pickers: Location & Feeling */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Add location (e.g. Cape Town)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Smile className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Feeling / activity (e.g. ✨ inspired)"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="w-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Toolbar & Submit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label
                className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Add Photo / Video"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setHasPoll(!hasPoll)}
                className={`p-2 rounded-xl transition-colors ${
                  hasPoll
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Add Interactive Poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold transition-colors"
                title="AI Polish & Suggestions"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Polish</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() && !imagePreview}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md disabled:opacity-40 transition-colors"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
