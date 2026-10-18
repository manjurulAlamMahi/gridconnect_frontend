import { Card, CardContent } from "@/components/ui/card";
import BellIcon from "@/assets/Icons/Bell.svg";
import Icon from "@/components/shared/Icon";
import { useGetRecentActivityQuery } from "@/redux/endpoints/notificationApi";
import { formatDistanceToNow } from "date-fns";
import useModal from "../Modal/useModal";
import { X } from "lucide-react";
import ActivitySkeleton from "./ActivitySkeleton";

const RecentActivity = () => {
  const { data, isLoading } = useGetRecentActivityQuery();
  const activities = data?.notifications || [];
  const { Modal, open, close } = useModal();

  const activityList =
    activities.length > 0 ? (
      activities.map((activity, index) => (
        <div key={activity.id}>
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium leading-tight">
                {activity.message}
              </p>
              <p className="text-xs text-white/60">
                {formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {index !== activities.length - 1 && (
            <div className="mt-4 border-t border-white/5" />
          )}
        </div>
      ))
    ) : (
      <div className="text-sm text-center text-white/40 py-4">
        No recent activity
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-accent flex gap-2 items-center pb-4">
          <Icon className="h-4 w-4" src={BellIcon} /> RECENT ACTIVITY
        </h2>
      </div>
      <Card className="rounded-[12px] border text-accent/80 bg-[#1A1A1A] -py-9 -mt-3">
        <CardContent className="p-4 sm:p-5">
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <ActivitySkeleton />
            ) : (
              // Show only first 5 activities in the sidebar
              activities.slice(0, 5).map((activity, index, array) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {activity.message}
                      </p>
                      <p className="text-xs text-white/60">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {index !== array.length - 1 && (
                    <div className="mt-4 border-t border-white/5" />
                  )}
                </div>
              ))
            )}
            {!isLoading && activities.length === 0 && (
              <div className="text-sm text-center text-white/40 py-4">
                No recent activity
              </div>
            )}
          </div>

          <button
            onClick={() => open([{ modalId: "view", openId: "all-activity" }])}
            className="mt-6 w-full cursor-pointer text-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View All Activity
          </button>
        </CardContent>
      </Card>

      <Modal
        modalId="view"
        openId="all-activity"
        showCloseButton={false}
        className="max-w-[500px] w-[95%] bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col h-[80vh] max-h-[600px]">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Icon className="h-5 w-5" src={BellIcon} />
              All Notifications
            </h3>
            <button
              onClick={() => close(["view"])}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {activityList}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default RecentActivity;
