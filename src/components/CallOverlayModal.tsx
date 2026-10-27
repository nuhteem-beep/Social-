import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Volume2,
  Users,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface CallOverlayModalProps {
  partner: User;
  isVideo: boolean;
  onEndCall: () => void;
}

export const CallOverlayModal: React.FC<CallOverlayModalProps> = ({
  partner,
  isVideo: initialIsVideo,
  onEndCall,
}) => {
  const [isVideo, setIsVideo] = useState(initialIsVideo);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              {isVideo ? 'UsWorld HD Video Call' : 'UsWorld Encrypted Voice Call'}
            </h3>
            <p className="text-xs text-slate-400 tabular-nums">
              Connected · {formatDuration(callDuration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-slate-300">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>2 Participants</span>
        </div>
      </div>

      {/* Main Video / Audio Grid Stage */}
      <div className="flex-1 my-4 flex items-center justify-center relative">
        {isVideo ? (
          <div className="w-full h-full max-w-4xl max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* Remote Video (Partner) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
              <img
                src={partner.avatar}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <span className="text-xs font-semibold drop-shadow">{partner.name}</span>
                <span className="p-1 rounded-full bg-emerald-500/80">
                  <Mic className="w-3 h-3 text-white" />
                </span>
              </div>
            </div>

            {/* Local Video Stream or Screen Share */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
              {isScreenSharing ? (
                <div className="w-full h-full bg-slate-900 p-6 flex flex-col items-center justify-center text-center">
                  <Monitor className="w-16 h-16 text-indigo-400 mb-3 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-200">
                    Sharing Your Display: UsWorld Social Platform
                  </p>
                  <p className="text-xs text-slate-400 mt-1">1080p 60fps Ultra-low latency stream</p>
                </div>
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-3">
                      <div className="w-24 h-24 rounded-full bg-indigo-600/30 flex items-center justify-center border border-indigo-400/30">
                        <span className="text-2xl font-bold font-display">You</span>
                      </div>
                      <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                    </div>
                    <p className="text-xs text-slate-300">Front Camera HD Active</p>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                    <span className="text-xs font-semibold drop-shadow">You (Host)</span>
                    <span className={`p-1 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-500/80'}`}>
                      {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Voice Call Stage */
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-violet-500 to-rose-500 animate-pulse">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">{partner.name}</h2>
              <p className="text-xs text-slate-400 mt-1">@{partner.username} · Active Voice Stream</p>
            </div>

            {/* Audio Waveform visualization */}
            <div className="flex items-center gap-1.5 h-10 px-6 py-2 bg-slate-900/80 rounded-full border border-slate-800">
              {[40, 70, 95, 60, 85, 45, 90, 75, 55, 80, 100, 65, 40].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-indigo-400 rounded-full transition-all duration-150 animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${idx * 100}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Call Controls Toolbar */}
      <div className="flex items-center justify-center gap-4 z-10 pb-4">
        {/* Mute Mic */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full transition-colors ${
            isMuted ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideo(!isVideo)}
          className={`p-4 rounded-full transition-colors ${
            !isVideo ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
          title={isVideo ? 'Turn off video' : 'Turn on video'}
        >
          {isVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        {isVideo && (
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Screen Sharing"
          >
            <Monitor className="w-5 h-5" />
          </button>
        )}

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
          title="Hang up call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
