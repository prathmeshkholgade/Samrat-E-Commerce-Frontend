import { 
  ShoppingBag, 
  Star, 
  AlertTriangle, 
  Wallet, 
  Tag, 
  Clock, 
  MailOpen, 
  Mail, 
  Trash2 
} from 'lucide-react';
import type { SellerNotification, NotificationType } from '../../../../store/slices/sellerNotificationsSlice';

interface NotificationItemRowProps {
  notification: SellerNotification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItemRow: React.FC<NotificationItemRowProps> = ({
  notification,
  onToggleRead,
  onDelete,
}) => {
  const { id, type, title, message, read, timestamp } = notification;

  // Type configuration: [Icon component, background wrapper, border/icon colors]
  const getTypeStyles = (notifType: NotificationType): {
    icon: React.ReactNode;
    badgeColor: string;
    bgContainer: string;
  } => {
    switch (notifType) {
      case 'New Order':
        return {
          icon: <ShoppingBag size={18} />,
          badgeColor: 'bg-emerald-50 border-emerald-100 text-emerald-700',
          bgContainer: 'bg-emerald-50/10 border-emerald-100/30'
        };
      case 'Review':
        return {
          icon: <Star size={18} className="fill-amber-400 text-amber-400" />,
          badgeColor: 'bg-amber-50 border-amber-100 text-amber-700',
          bgContainer: 'bg-amber-50/10 border-amber-100/30'
        };
      case 'Low Stock':
        return {
          icon: <AlertTriangle size={18} />,
          badgeColor: 'bg-rose-50 border-rose-100 text-rose-700',
          bgContainer: 'bg-rose-50/10 border-rose-100/30'
        };
      case 'Payout Update':
        return {
          icon: <Wallet size={18} />,
          badgeColor: 'bg-blue-50 border-blue-100 text-blue-700',
          bgContainer: 'bg-blue-50/10 border-blue-100/30'
        };
      case 'Promotion':
        return {
          icon: <Tag size={18} />,
          badgeColor: 'bg-purple-50 border-purple-100 text-purple-700',
          bgContainer: 'bg-purple-50/10 border-purple-100/30'
        };
      default:
        return {
          icon: <ShoppingBag size={18} />,
          badgeColor: 'bg-slate-50 border-slate-100 text-slate-700',
          bgContainer: 'bg-slate-50/10 border-slate-100/30'
        };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div 
      className={`border rounded-3xl p-5 transition-all text-left flex gap-4 items-start ${
        read 
          ? 'bg-white border-slate-100 opacity-75 hover:opacity-100' 
          : `bg-white border-indigo-100 shadow-xs ring-1 ring-indigo-50/30 ${styles.bgContainer}`
      }`}
    >
      {/* Icon Badge */}
      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-3xs ${styles.badgeColor}`}>
        {styles.icon}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-xs font-black ${read ? 'text-slate-800' : 'text-slate-900 font-extrabold'}`}>
              {title}
            </h4>
            {!read && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[8px] font-black text-white uppercase tracking-wide">
                New
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-550 border border-slate-200/40 text-[9px] font-bold uppercase tracking-wider font-mono">
              {type}
            </span>
          </div>

          {/* Time */}
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0 font-mono">
            <Clock size={11} />
            <span>{timestamp}</span>
          </span>
        </div>

        {/* Message body */}
        <p className={`text-xs leading-relaxed ${read ? 'text-slate-500' : 'text-slate-750 font-semibold'}`}>
          {message}
        </p>
      </div>

      {/* Action panel */}
      <div className="flex items-center gap-1.5 shrink-0 ml-2 self-center">
        {/* Toggle Read */}
        <button
          onClick={() => onToggleRead(id)}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            read 
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/50 text-slate-400 hover:text-slate-700' 
              : 'bg-indigo-50 hover:bg-indigo-650 hover:text-white border-indigo-100 text-indigo-700'
          }`}
          title={read ? 'Mark as Unread' : 'Mark as Read'}
        >
          {read ? <Mail size={13} /> : <MailOpen size={13} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(id)}
          className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-100 text-rose-700 rounded-xl transition-all cursor-pointer"
          title="Delete Notification"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default NotificationItemRow;
