import React, { lazy, Suspense } from "react";
import ConcertForm from "../pages/admin/concert/ConcertForm";

const Loading = (
  <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
    <svg
      className="text-gray-300 animate-spin"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
        d="M32 3C35.8083..."
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
    <p>Loading...</p>
  </div>
);

const TicketAddPage = lazy(() => import("../pages/admin/concert/AdminAddPage"));
const TicketModifyPage = lazy(() =>
  import("../pages/admin/concert/AdminModifyPage")
);
const TicketListPage = lazy(() =>
  import("../pages/admin/concert/AdminListPage")
);

const adminConcertRouter = () => {
  return [
    {
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <TicketAddPage />
        </Suspense>
      ),
    },
    {
      path: "modify/:id",
      element: (
        <Suspense fallback={Loading}>
          <TicketModifyPage />
        </Suspense>
      ),
    },
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <TicketListPage />
        </Suspense>
      ),
    },
    {
      path: "r",
      element: (
        <Suspense fallback={Loading}>
          <ConcertForm />
        </Suspense>
      ),
    },
  ];
};

export default adminConcertRouter;
