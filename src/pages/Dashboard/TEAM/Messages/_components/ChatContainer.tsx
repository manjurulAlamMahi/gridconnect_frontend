import { useRef, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  Paperclip,
  Send,
  X,
  Loader2,
  Check,
  ChevronLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetConversationsQuery,
  useMarkMessagesReadMutation,
} from "@/redux/endpoints/chatApi";
import { toast } from "sonner";
import echo from "@/lib/echo";
import {
  getChatAttachmentName,
  getChatAttachmentUrl,
  isChatAttachmentImage,
} from "@/lib/chat";

type ChatContainerProps = {
  activeChatId: string;
  onlineUsers?: number[];
  onBack?: () => void;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

const ChatContainer = ({
  activeChatId,
  onlineUsers = [],
  onBack,
}: ChatContainerProps) => {
  const { data: conversationsResponse } = useGetConversationsQuery();
  const {
    data: messagesResponse,
    isLoading: isMessagesLoading,
    refetch,
  } = useGetMessagesQuery(
    { conversationId: activeChatId },
    {
      skip: !activeChatId,
      pollingInterval: activeChatId ? 3000 : 0,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markMessagesRead] = useMarkMessagesReadMutation();
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversation = conversationsResponse?.data?.conversations?.find(
    (c) => c.conversation_id.toString() === activeChatId,
  );

  const isOnline = conversation
    ? onlineUsers.includes(conversation.with.id)
    : false;

  const messages = useMemo(
    () => messagesResponse?.data?.messages || [],
    [messagesResponse?.data?.messages],
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle file preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Real-time listener
  useEffect(() => {
    if (!activeChatId) return;

    const channelName = `conversation.${activeChatId}`;
    echo.private(channelName).listen(".message.sent", () => {
      // Since RTK Query handles caching, we can just refetch
      // or manually update the cache if we want more performance.
      refetch();
    });

    return () => {
      echo.leave(channelName);
    };
  }, [activeChatId, refetch]);

  useEffect(() => {
    if (!activeChatId || !conversation) return;
    if (conversation.unread_count !== 0) {
      markMessagesRead({ conversationId: activeChatId }).catch(() => {});
    }
  }, [activeChatId, conversation, markMessagesRead]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || !activeChatId || isSending)
      return;

    try {
      const formData = new FormData();
      formData.append("conversation_id", activeChatId);
      if (messageText.trim()) {
        formData.append("message", messageText.trim());
      }
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const response = await sendMessage(formData).unwrap();

      if (response.status === "success") {
        setMessageText("");
        setSelectedFile(null);
        setPreviewUrl(null);
        refetch(); // Ensure local list is up to date
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to send message");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (!activeChatId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#1A1A1A] text-white/40">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-[#1A1A1A] h-[calc(100vh-120px)]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="lg:hidden rounded-lg border border-white/10 p-1.5 text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage
                src={conversation?.with.image ?? undefined}
                alt={conversation?.with.name || "Conversation user"}
              />
              <AvatarFallback className="bg-white/10 text-sm font-semibold text-white">
                {getInitials(conversation?.with.name || "?")}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 rounded-full p-1",
                isOnline
                  ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : "bg-primary",
              )}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {conversation?.with.name || "Loading..."}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/60">
              {conversation?.unread_count !== undefined &&
                conversation.unread_count > 0 && (
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-[10px] text-primary"
                  >
                    {conversation.unread_count} New Messages
                  </Badge>
                )}
              <span>• {conversation?.last_message?.time_ago || "Active"}</span>
            </div>
          </div>
        </div>
        <button className="text-xs text-white/60 hover:text-primary transition-colors duration-300 cursor-pointer">
          <EllipsisVertical />
        </button>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 px-6 py-4">
          {isMessagesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => {
              const attachmentUrl = getChatAttachmentUrl(message.attachment);
              const attachmentName =
                getChatAttachmentName(message.attachment) || "View Attachment";
              const isImageAttachment = isChatAttachmentImage(
                message.attachment,
              );

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full",
                    message.sent_by_me ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed text-white shadow relative group",
                      message.sent_by_me
                        ? "rounded-br-none bg-primary"
                        : "rounded-bl-none border border-white/10 bg-transparent",
                    )}
                  >
                    {message.message && <p>{message.message}</p>}

                    {attachmentUrl && (
                      <div className="mt-2">
                        {isImageAttachment ? (
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block overflow-hidden rounded-lg border border-white/10 bg-black/20"
                          >
                            <img
                              src={attachmentUrl}
                              alt={attachmentName}
                              className="max-h-60 w-full object-contain"
                            />
                          </a>
                        ) : (
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl bg-black/30 p-3 text-xs transition-colors hover:bg-black/40 border border-white/5"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                              <Paperclip className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate font-medium text-white/90">
                                {attachmentName}
                              </span>
                              <span className="text-[10px] text-white/50 lowercase">
                                Document/File
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    <p
                      className={cn(
                        "mt-1 text-[10px] text-white/70",
                        message.sent_by_me ? "text-right" : "text-left",
                      )}
                    >
                      {message.time_ago}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-white/30">
              <p>No messages yet. Say hello!</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <footer className="border-t border-white/10 p-5">
        {selectedFile && (
          <div className="mb-4 flex items-center justify-between">
            {previewUrl ? (
              <div className="relative group">
                <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-primary/50 bg-black/50 shadow-lg">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="mt-1 block text-[10px] text-white/40 truncate w-20">
                  {selectedFile.name}
                </span>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between rounded-xl bg-black/40 px-4 py-3 border border-white/5 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm text-white/90 font-medium">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-white/40">
                      {Math.round(selectedFile.size / 1024)} KB
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 hover:bg-white/5 hover:text-red-500 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-white/70 hover:text-primary transition-colors cursor-pointer p-1"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />

          <Button
            type="submit"
            disabled={isSending || (!messageText.trim() && !selectedFile)}
            size="icon"
            className="h-10 w-10 flex cursor-pointer items-center justify-center text-white hover:bg-primary bg-primary/80 transition-all duration-300 rounded-lg shadow-md hover:shadow-primary/20"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </footer>
    </section>
  );
};

export default ChatContainer;
