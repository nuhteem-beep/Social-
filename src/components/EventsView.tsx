import React, { useState } from 'react';
import { EventItem, User } from '../types';
import { Calendar, MapPin, Users, Plus, Check, Globe, Clock, X } from 'lucide-react';

interface EventsViewProps {
  events: EventItem[];
  currentUser: User;
  onRsvpToggle: (eventId: string) => void;
  onCreateEvent: (event: Partial<EventItem>) => void;
  onViewProfile: (user: User) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentUser,
  onRsvpToggle,
  onCreateEvent,
  onViewProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'virtual' | 'in_person'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [isVirtual, setIsVirtual] = useState(true);
  const [eventDescription, setEventDescription] = useState('');

  const filteredEvents = events.filter((e) => {
    if (filter === 'virtual') return e.isVirtual;
    if (filter === 'in_person') return !e.isVirtual;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    onCreateEvent({
      title: eventTitle.trim(),
      organizer: currentUser,
      date: eventDate || 'Next Weekend',
      time: '18:00 UTC',
      location: isVirtual ? 'UsWorld Live Stream Stage' : eventLocation || 'Cape Town, ZA',
      isVirtual,
      coverImage: '/src/assets/images/usworld_livestream_dj_1793123386386.jpg',
      description: eventDescription || 'Join us for an inspiring session on UsWorld Social.',
      rsvpCount: 1,
      isRsvp: true,
    });

    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            UsWorld Events & Gatherings
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mt-1">
            Global Creator Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Attend live virtual album premieres, photography photo walks, and developer hackathons across timezones.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Host an Event</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Gatherings
        </button>
        <button
          onClick={() => setFilter('virtual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'virtual'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Virtual Livestreams
        </button>
        <button
          onClick={() => setFilter('in_person')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'in_person'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          In-Person Meetups
        </button>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
              <img
                src={evt.coverImage}
                alt={evt.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                {evt.isVirtual ? <Globe className="w-3 h-3 text-indigo-400" /> : <MapPin className="w-3 h-3 text-emerald-400" />}
                <span>{evt.isVirtual ? 'Virtual Stream' : 'In Person'}</span>
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.date} · {evt.time}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onViewProfile(evt.organizer)}
                  className="flex items-center gap-2 text-left group"
                >
                  <img
                    src={evt.organizer.avatar}
                    alt={evt.organizer.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium group-hover:underline">
                    {evt.organizer.name}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 tabular-nums">
                    {evt.rsvpCount} RSVP'd
                  </span>
                  <button
                    onClick={() => onRsvpToggle(evt.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                      evt.isRsvp
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {evt.isRsvp ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Going</span>
                      </>
                    ) : (
                      <span>RSVP</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Host Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base font-display">Create Community Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cape Town Golden Hour Photo Walk"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sat, Dec 5 · 17:00"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Type
                  </label>
                  <select
                    value={isVirtual ? 'virtual' : 'in_person'}
                    onChange={(e) => setIsVirtual(e.target.value === 'virtual')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="virtual">Virtual Live Stream</option>
                    <option value="in_person">In-Person Gathering</option>
                  </select>
                </div>
              </div>

              {!isVirtual && (
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Physical Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Waterfront Harbor Cafe, Cape Town"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline topics, meeting location, and prerequisites..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
