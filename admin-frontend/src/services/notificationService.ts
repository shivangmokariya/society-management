import { getSecretaryRegistrations } from './adminService';
import { AdminNotification, SecretaryRegistration } from '../types';

const READ_NOTIFS_KEY = 'calm_admin_read_notifs';
const BROADCASTS_KEY = 'calm_admin_broadcast_notifs';

export const getReadNotificationIds = (): string[] => {
  try {
    const data = localStorage.getItem(READ_NOTIFS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const markNotificationAsRead = (id: string) => {
  const readIds = getReadNotificationIds();
  if (!readIds.includes(id)) {
    readIds.push(id);
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(readIds));
  }
};

export const markAllNotificationsAsRead = (ids: string[]) => {
  const readIds = getReadNotificationIds();
  const updated = Array.from(new Set([...readIds, ...ids]));
  localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(updated));
};

export const getStoredBroadcasts = (): AdminNotification[] => {
  try {
    const data = localStorage.getItem(BROADCASTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addBroadcastNotification = (title: string, message: string): AdminNotification => {
  const newNotif: AdminNotification = {
    id: `bc-${Date.now()}`,
    title,
    message,
    type: 'alert',
    timestamp: 'Just now',
    read: false,
    route: '/notifications',
  };
  const broadcasts = getStoredBroadcasts();
  localStorage.setItem(BROADCASTS_KEY, JSON.stringify([newNotif, ...broadcasts]));
  return newNotif;
};

const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export const fetchDynamicNotifications = async (): Promise<AdminNotification[]> => {
  try {
    const registrations: SecretaryRegistration[] = await getSecretaryRegistrations();
    const readIds = getReadNotificationIds();
    const broadcasts = getStoredBroadcasts();

    const requestNotifs: AdminNotification[] = registrations.map((reg) => {
      let id = `req-${reg._id}`;
      let title = 'New Secretary Registration Request';
      let message = `A new secretary registration request was submitted for ${reg.societyName} by ${reg.fullName}.`;
      let type: 'access_request' | 'alert' = 'access_request';
      let route = '/requests';
      let timestampStr = reg.createdAt;

      if (reg.status === 'Approved') {
        id = `app-${reg._id}`;
        title = 'Secretary Access Approved';
        message = `Secretary ${reg.fullName} account access approved for ${reg.societyName}.`;
        type = 'access_request';
        route = '/secretaries';
        timestampStr = reg.updatedAt || reg.createdAt;
      } else if (reg.status === 'Rejected') {
        id = `rej-${reg._id}`;
        title = 'Secretary Access Rejected';
        message = `Secretary ${reg.fullName} registration request for ${reg.societyName} was declined.`;
        type = 'alert';
        route = '/requests';
        timestampStr = reg.updatedAt || reg.createdAt;
      }

      return {
        id,
        title,
        message,
        type,
        timestamp: formatRelativeTime(timestampStr),
        read: readIds.includes(id),
        route,
        relatedId: reg._id,
      };
    });

    // Default System Notifications
    const sysAuditId = 'sys-audit-1';
    const sysBackupId = 'sys-backup-1';

    const systemNotifs: AdminNotification[] = [
      {
        id: sysAuditId,
        title: 'System Security Audit Completed',
        message: 'Monthly security audit and backend database connectivity verification completed successfully.',
        type: 'system',
        timestamp: '2 hours ago',
        read: readIds.includes(sysAuditId),
        route: '/profile',
      },
      {
        id: sysBackupId,
        title: 'Database Backup Complete',
        message: 'Automated database backup was generated and stored securely.',
        type: 'system',
        timestamp: '1 day ago',
        read: readIds.includes(sysBackupId),
        route: '/dashboard',
      },
    ];

    // Merge: Broadcasts first, then request notifications, then system notifications
    const allNotifs = [...broadcasts, ...requestNotifs, ...systemNotifs];

    return allNotifs;
  } catch (err) {
    console.error('Failed to fetch dynamic notifications:', err);
    return [];
  }
};
