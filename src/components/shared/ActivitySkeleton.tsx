const ActivitySkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary/30" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-1/4 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          {i !== 4 && <div className="mt-4 border-t border-white/5" />}
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
