interface DashboardHeaderProps {
  router: {
    push: (path: string) => void;
  };
  handleLogout: () => Promise<void>;
}

export const DashboardHeader = ({
  router,
  handleLogout,
}: DashboardHeaderProps) => {
  return (
    <section className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm opacity-80 font-bold text-black">
              ContactKaro Management System
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="rounded-lg border-2 border-black text-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
