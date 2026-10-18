import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Icon from "@/components/shared/Icon";
import Search from "@/assets/Icons/Icon - Search.svg";
import { useGetConversationsQuery } from "@/redux/endpoints/chatApi";
import useModal from "@/components/Modal/useModal";
import { useIsMobile } from "@/hooks/use-mobile";

const filters = ["All", "Unread"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

const getConversationPreview = (text?: string, attachmentName?: string) =>
  text || attachmentName || "No messages yet";

type ChatSidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onlineUsers?: number[];
  autoSelectFirst?: boolean;
};

const ChatSidebar = ({
  active,
  onSelect,
  onlineUsers = [],
  autoSelectFirst = true,
}: ChatSidebarProps) => {
  const { open, close, getParams } = useModal();
  const { data: response, isLoading, error } = useGetConversationsQuery();
  const isMobile = useIsMobile();
  const filter = getParams("message") || "All";
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (f: string) => {
    if (f === "All") {
      close(["message"]);
    } else {
      open([{ modalId: "message", openId: f }]);
    }
  };

  const conversations = useMemo(
    () => response?.data?.conversations || [],
    [response?.data?.conversations],
  );

  // Automatically select the first conversation if none is active
  useEffect(() => {
    if (autoSelectFirst && !active && conversations.length > 0) {
      onSelect(conversations[0].conversation_id.toString());
    }
  }, [active, autoSelectFirst, conversations, onSelect]);

  const filteredConversations = conversations.filter((chat) => {
    const matchesSearch = chat.with.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "All" || (filter === "Unread" && chat.unread_count > 0);
    return matchesSearch && matchesFilter;
  });

  if (isMobile) {
    return (
      <div className="w-full border-b border-white/10 bg-[#111111]">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="px-4 py-5 text-center">
            <p className="text-xs text-red-500">Failed to load conversations</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-4 py-3">
            {filteredConversations.map((chat) => {
              const isActive = chat.conversation_id.toString() === active;
              const isOnline = onlineUsers.includes(chat.with.id);

              return (
                <button
                  key={chat.conversation_id}
                  onClick={() => onSelect(chat.conversation_id.toString())}
                  className="relative shrink-0 cursor-pointer"
                  aria-label={chat.with.name}
                  title={chat.with.name}
                >
                  <Avatar
                    className={cn(
                      "h-12 w-12 border-2 transition",
                      isActive ? "border-primary" : "border-white/15",
                    )}
                  >
                    <AvatarImage
                      src={chat.with.image ?? undefined}
                      alt={chat.with.name}
                    />
                    <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                      {getInitials(chat.with.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111111] bg-green-500" />
                  )}
                  {chat.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {chat.unread_count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-5 text-center">
            <p className="text-sm text-white/40">No conversations found</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[380px] flex flex-col bg-[#111111]">
      <div className="p-4 border-b border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer",
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10",
              )}
            >
              {f}
              {f === "Unread" &&
                conversations.some((c) => c.unread_count > 0) && (
                  <span className="ml-1.5 bg-white text-primary rounded-full px-1.5 py-0.5 text-[10px]">
                    {conversations.filter((c) => c.unread_count > 0).length}
                  </span>
                )}
            </button>
          ))}
        </div>

        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 h-10 pl-10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-primary/20"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon src={Search} className="h-4 w-4 opacity-50" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-white/40">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-xs text-red-500">
                Failed to load conversations
              </p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((chat) => {
              const isActive = chat.conversation_id.toString() === active;
              const isOnline = onlineUsers.includes(chat.with.id);
              return (
                <button
                  key={chat.conversation_id}
                  onClick={() => onSelect(chat.conversation_id.toString())}
                  className={cn(
                    "w-full p-4 text-left transition cursor-pointer",
                    isActive
                      ? "bg-[linear-gradient(124deg,#0F0E0E_20%,#C51417_96%,#C51417_98%)] text-white"
                      : "hover:bg-white/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="h-11 w-11 border border-white/10">
                        <AvatarImage
                          src={chat.with.image ?? undefined}
                          alt={chat.with.name}
                        />
                        <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                          {getInitials(chat.with.name)}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111111] bg-green-500 shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white truncate pr-2">
                          {chat.with.name}
                        </p>
                        <span className="text-[10px] text-white whitespace-nowrap">
                          {chat.last_message?.time_ago}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-white/60 truncate flex-1 leading-normal">
                          {getConversationPreview(
                            chat.last_message?.text,
                            chat.last_message?.attachment?.name,
                          )}
                        </p>
                        {chat.unread_count > 0 && (
                          <span className="flex items-center justify-center rounded-full min-w-4 h-4 px-1 text-[10px] font-bold bg-primary text-white">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm text-white/40">No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
