import { Outlet, ScrollRestoration } from "react-router";

const JoinLayout = () => {
  return (
    <main className="text-accent">
      <ScrollRestoration />
      <Outlet />
    </main>
  );
};
export default JoinLayout;
