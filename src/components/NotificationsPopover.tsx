import React from 'react';
import { X, Bell, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notification: AppNotification) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-12 z-50 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-xs">Notificări Live</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMarkAllAsRead}
            className="text-[10px] text-emerald-400 hover:underline font-bold"
          >
            Bifează citit
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-xs text-slate-400">Nu ai notificări noi.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotification(n)}
              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition space-y-1 ${
                !n.read ? 'bg-emerald-50/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
