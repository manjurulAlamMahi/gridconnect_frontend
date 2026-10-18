import Icon from "@/components/shared/Icon";
import MessageIcon from "@/assets/Icons/message_dash.svg";
import { MoveRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetRecentMessagesQuery } from "@/redux/endpoints/chatApi";
import { Link } from "react-router";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

const RecentMessages = () => {
  const { data, isLoading, error } = useGetRecentMessagesQuery();

  if (isLoading) {
    return (
      <section className="rounded-[20px] sm:rounded-[28px] text-white">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-base sm:text-lg font-semibold">
            <span className="text-primary">
              <Icon src={MessageIcon} className="h-5 w-5" />
            </span>
            Recent Messages
          </div>
          <Link
            to="/team/dashboard/search-driver"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/70 transition hover:text-primary cursor-pointer self-start sm:self-auto"
          >
            Search All Drivers
            <MoveRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="mt-4 sm:mt-5 space-y-3">
          {[...Array(3)].map((_, index) => (
            <article
              key={index}
              className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/5 bg-[#0f0b0b] px-3 sm:px-4 py-3 shadow-inner shadow-black/40"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-3 w-12 shrink-0" />
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[20px] sm:rounded-[28px] text-white">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-base sm:text-lg font-semibold">
            <span className="text-primary">
              <Icon src={MessageIcon} className="h-5 w-5" />
            </span>
            Recent Messages
          </div>
          <Link
            to="/team/dashboard/search-driver"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/70 transition hover:text-primary cursor-pointer self-start sm:self-auto"
          >
            Search All Drivers
            <MoveRight className="h-4 w-4" />
          </Link>
        </header>
        <div className="mt-4 sm:mt-5">
          <p className="text-white/60">Failed to load recent messages.</p>
        </div>
      </section>
    );
  }

  const messages =
    data?.data?.recent_messages?.map((message) => ({
      id: message.conversation_id.toString(),
      name: message.from.name,
      avatar: message.from.image,
      snippet: message.message,
      timeAgo: message.time_ago,
      unread: !message.is_read,
    })) || [];

  return (
    <section className="rounded-[20px] sm:rounded-[28px] text-white">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-base sm:text-lg font-semibold">
          <span className="text-primary">
            <Icon src={MessageIcon} className="h-5 w-5" />
          </span>
          Recent Messages
        </div>
        <Link
          to="/team/dashboard/search-driver"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/70 transition hover:text-primary cursor-pointer self-start sm:self-auto"
        >
          Search All Drivers
          <MoveRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="mt-4 sm:mt-5 space-y-3">
        {messages.map(({ id, name, avatar, snippet, timeAgo, unread }) => (
          <article
            key={id}
            className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/5 bg-[#0f0b0b] px-3 sm:px-4 py-3 shadow-inner shadow-black/40"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatar ?? undefined} alt={name} />
                  <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                {unread && (
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#D7181F] ring-2 ring-[#0f0b0b]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {name}
                </p>
                <p className="text-xs text-white/70 truncate">{snippet}</p>
              </div>
            </div>

            <span className="text-xs text-white/50 shrink-0">{timeAgo}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentMessages;
