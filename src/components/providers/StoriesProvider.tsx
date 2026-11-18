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
  clearStoryContent,
  cloneStoryDefaults,
  readStoryContent,
  STORY_STORAGE_KEY,
  writeStoryContent,
  type SaveResult,
  type StoryContent,
} from "@/lib/story-content";
import {
  addStoryRequest,
  readStoryRequests,
  removeStoryRequest,
  STORY_REQUESTS_KEY,
  updateStoryRequest,
  type StoryRequest,
} from "@/lib/story-requests";
import type { Story } from "@/lib/types";

interface StoriesContextValue {
  content: StoryContent;
  hydrated: boolean;
  save: (next: StoryContent) => SaveResult;
  reset: () => SaveResult;
  requests: StoryRequest[];
  addRequest: (request: StoryRequest) => void;
  setRequestStatus: (id: string, status: StoryRequest["status"]) => void;
  removeRequest: (id: string) => void;
  approve: (request: StoryRequest) => void;
}

const StoriesContext = createContext<StoriesContextValue | null>(null);
const initialContent: StoryContent = cloneStoryDefaults();

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<StoryContent>(initialContent);
  const [requests, setRequests] = useState<StoryRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readStoryContent());
    setRequests(readStoryRequests());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORY_STORAGE_KEY || event.key === STORY_REQUESTS_KEY) {
        setContent(readStoryContent());
        setRequests(readStoryRequests());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: StoryContent) => {
    const result = writeStoryContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearStoryContent();
    if (result.ok) setContent(cloneStoryDefaults());
    return result;
  }, []);

  const refreshRequests = useCallback(() => setRequests(readStoryRequests()), []);

  const addRequest = useCallback(
    (request: StoryRequest) => {
      addStoryRequest(request);
      refreshRequests();
    },
    [refreshRequests],
  );

  const setRequestStatus = useCallback(
    (id: string, status: StoryRequest["status"]) => {
      updateStoryRequest(id, { status });
      refreshRequests();
    },
    [refreshRequests],
  );

  const removeRequest = useCallback(
    (id: string) => {
      removeStoryRequest(id);
      refreshRequests();
    },
    [refreshRequests],
  );

  const approve = useCallback(
    (request: StoryRequest) => {
      const story: Story = {
        id: `s-${request.id}`,
        name: request.name,
        title: request.title,
        excerpt: request.excerpt,
        type: request.type,
        duration: request.type === "voice" ? "3:20" : undefined,
        likes: 0,
        date: "Just now",
        avatarColor: "#1877F2",
        body: request.body,
        attachmentName: request.attachmentName,
        attachmentDataUrl: request.attachmentDataUrl,
        audioUrl: request.audioUrl,
        audioDataUrl: request.audioDataUrl,
        status: "Published",
        createdAt: request.createdAt,
      };
      const next: StoryContent = {
        ...content,
        stories: [story, ...content.stories.filter((item) => item.id !== story.id)],
      };
      const result = writeStoryContent(next);
      if (result.ok) setContent(next);
      updateStoryRequest(request.id, { status: "Approved" });
      refreshRequests();
    },
    [content, refreshRequests],
  );

  const value = useMemo(
    () => ({ content, hydrated, save, reset, requests, addRequest, setRequestStatus, removeRequest, approve }),
    [content, hydrated, save, reset, requests, addRequest, setRequestStatus, removeRequest, approve],
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories(): StoriesContextValue {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error("useStories must be used within a StoriesProvider");
  }
  return context;
}
