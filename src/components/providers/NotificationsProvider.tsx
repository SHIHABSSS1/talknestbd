"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  NOTIFICATIONS_KEY,
  readNotificationState,
  sampleNotifications,
  writeNotificationState,
  type AdminNotification,
} from "@/lib/notifications";

interface NotificationsContextValue {
  notifications: (AdminNotification & { read: boolean })[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReadIds(readNotificationState().read);
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_KEY || event.key === null) {
        setReadIds(readNotificationState().read);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((ids: string[]) => {
    const current = readNotificationState();
    writeNotificationState({ ...current, read: ids });
    setReadIds(ids);
  }, []);

  const markRead = useCallback(
    (id: string) => {
      if (!readIds.includes(id)) persist([...readIds, id]);
    },
    [readIds, persist],
  );

  const markAllRead = useCallback(() => {
    persist(sampleNotifications.map((item) => item.id));
  }, [persist]);

  const notifications = useMemo(
    () =>
      sampleNotifications.map((item) => ({
        ...item,
        read: hydrated && readIds.includes(item.id),
      })),
    [readIds, hydrated],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead,
      markAllRead,
    }),
    [notifications, markRead, markAllRead],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
