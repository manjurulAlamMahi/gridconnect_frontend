import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(75,85,99,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(75,85,99,0.1)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"></div>

      {/* Scanning lines effect */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#CD0500]/5 to-transparent animate-[scan_4s_ease-in-out_infinite]"></div>

      <div className="relative flex items-center justify-center min-h-screen p-8 w-full">
        <div className="text-center w-full max-w-none">
          {/* Corner decorations */}
          <div className="relative inline-block">
            <div className="absolute -top-8 -left-8 w-16 h-16 border-l-2 border-t-2 border-[#CD0500]/50"></div>
            <div className="absolute -top-8 -right-8 w-16 h-16 border-r-2 border-t-2 border-[#CD0500]/50"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 border-l-2 border-b-2 border-[#CD0500]/50"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 border-r-2 border-b-2 border-[#CD0500]/50"></div>

            {/* Main 404 display */}
            <div className="relative py-12 px-16">
              <div className="text-[200px] font-bold leading-none tracking-tighter">
                <span className="bg-linear-to-b from-[#CD0500] via-[#a30502] to-[#7a0401] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(205,5,0,0.5)]">
                  404
                </span>
              </div>

              {/* Glitch line effect */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#CD0500] to-transparent opacity-50"></div>
            </div>
          </div>

          {/* Warning label */}
          <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-6 py-2 mb-8">
            <div className="flex gap-1">
              <div className="w-1 h-6 bg-yellow-500 animate-pulse"></div>
              <div className="w-1 h-6 bg-yellow-500 animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1 h-6 bg-yellow-500 animate-pulse [animation-delay:0.4s]"></div>
            </div>
            <span className="text-yellow-500 font-mono text-sm tracking-widest">
              ALERT: RESOURCE NOT FOUND
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-6 bg-yellow-500 animate-pulse"></div>
              <div className="w-1 h-6 bg-yellow-500 animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-1 h-6 bg-yellow-500 animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>

          {/* Main message */}
          <h1 className="text-3xl font-light text-gray-200 mb-4 tracking-[0.3em] uppercase">
            Page Not Found
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#CD0500]"></div>
            <div className="w-2 h-2 rotate-45 border border-[#CD0500]"></div>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#CD0500]"></div>
          </div>

          <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-lg mx-auto">
            The requested resource could not be located in the system registry.
            Please verify your coordinates or return to base operations.
          </p>

          {/* Status panel */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-none p-8 mb-12 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Status indicator 1 */}
              <div className="border border-gray-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-mono tracking-wider">
                    SYSTEM STATUS
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-green-400 font-mono text-sm">
                  OPERATIONAL
                </div>
              </div>

              {/* Status indicator 2 */}
              <div className="border border-gray-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-mono tracking-wider">
                    ERROR CODE
                  </span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-red-400 font-mono text-sm">404</div>
              </div>

              {/* Status indicator 3 */}
              <div className="border border-gray-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-mono tracking-wider">
                    SECURITY
                  </span>
                  <div className="w-2 h-2 bg-[#CD0500] rounded-full animate-pulse"></div>
                </div>
                <div className="text-[#CD0500] font-mono text-sm">SECURE</div>
              </div>
            </div>

            {/* Technical details */}
            <div className="border-t border-gray-700/50 pt-6 text-left">
              <div className="text-xs text-gray-500 font-mono space-y-2">
                <div className="flex justify-between">
                  <span>ERROR_TYPE:</span>
                  <span className="text-gray-400">RESOURCE_NOT_FOUND</span>
                </div>
                <div className="flex justify-between">
                  <span>TIMESTAMP:</span>
                  <span className="text-gray-400">
                    {new Date().toISOString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>REQUEST_ID:</span>
                  <span className="text-gray-400">
                    {Math.random().toString(36).substring(2, 15)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#CD0500] text-accent px-8 py-4 font-mono text-sm tracking-wider transition-all duration-300 group border-2 border-[#a30502] font-bold"
          >
            <span>RETURN TO HOME</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {/* Footer info */}
          <div className="mt-16 flex items-center justify-center gap-8 text-xs text-gray-600 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>ALL_SYSTEMS_NOMINAL</span>
            </div>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#CD0500] rounded-full animate-pulse"></div>
              <span>MONITORING_ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%,
          100% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
