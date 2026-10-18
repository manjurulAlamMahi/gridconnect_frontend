import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChatSidebar from "./_components/ChatSidebar";
import ChatContainer from "./_components/ChatContainer";
import { useEffect, useState } from "react";
import echo from "@/lib/echo";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/use-seo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetAvailableTokensQuery } from "@/redux/endpoints/token/token.api";

const Messages = () => {
  useSEO({
    title: "Messages",
    description: "Communicate with drivers about opportunities.",
  });

  const { data: tokensData } = useGetAvailableTokensQuery({ role: "team" });
  const totalTokens = tokensData?.data?.total_tokens ?? 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [showMobileList, setShowMobileList] = useState(false);
  const isMobile = useIsMobile();
  const activeChat = searchParams.get("conversation_id") || "";

  useEffect(() => {
    const channel = echo.join("presence-chat");

    channel.here((users: { id: number }[]) => {
      setOnlineUsers(users.map((user) => user.id));
    });

    channel.joining((user: { id: number }) => {
      setOnlineUsers((prev) => [...new Set([...prev, user.id])]);
    });

    channel.leaving((user: { id: number }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== user.id));
    });

    return () => {
      echo.leave("presence-chat");
    };
  }, []);

  const setActiveChat = (id: string) => {
    setSearchParams({ conversation_id: id });
  };

  useEffect(() => {
    if (!isMobile) {
      setShowMobileList(false);
      return;
    }

    // On mobile, show the list by default until a conversation is selected.
    setShowMobileList(!activeChat);
  }, [activeChat, isMobile]);

  const shouldShowSidebar = !isMobile || showMobileList;
  const shouldShowChat = !isMobile || !showMobileList;

  return (
    <section className="space-y-6">
      <div className="flex gap-4">
        {/* {isMobile && activeChat && !showMobileList && (
          <button className="lg:hidden" onClick={() => setShowMobileList(true)}>
            <Menu className="h-6 w-6" />
          </button>
        )} */}
        <p className="flex gap-2.5">
          <span>
            <ChevronLeft className="h-6 w-6 rounded-[6px] border-2 border-[#CCD2D8]" />
          </span>{" "}
          <span>
            <ChevronRight className="h-6 w-6 rounded-[6px] border-2 border-[#CCD2D8]" />
          </span>
        </p>
        <p className="text-sm font-medium">Messages</p>
      </div>

      <div className="flex items-center justify-between rounded-3xl">
        <p className="text-base text-white/60">
          Connect with racing teams •  {totalTokens} tokens remaining
        </p>
        {/* <Button className="h-10 bg-linear-to-b from-primary to-primary/70 px-5 text-sm font-semibold text-white shadow hover:brightness-110">
          <Icon src={FlyIcon} />
          New Conversation
        </Button> */}
      </div>

      <div className="flex flex-col lg:flex-row border rounded-[14px] overflow-hidden relative mb-20 md:mb-8">
        {shouldShowSidebar && (
          <div
            className={cn(
              "w-full lg:w-[380px]",
              !isMobile && "border-r border-white/10",
            )}
          >
            <ChatSidebar
              active={activeChat}
              onSelect={(id) => {
                setActiveChat(id);
                if (isMobile) {
                  setShowMobileList(false);
                }
              }}
              onlineUsers={onlineUsers}
              autoSelectFirst={!isMobile}
            />
          </div>
        )}

        {shouldShowChat && (
          <div className="flex-1">
            <ChatContainer
              activeChatId={activeChat}
              onlineUsers={onlineUsers}
              onBack={isMobile ? () => setShowMobileList(true) : undefined}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Messages;
