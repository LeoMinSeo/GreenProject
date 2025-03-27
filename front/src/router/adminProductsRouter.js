import React, { lazy, Suspense } from "react";

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

const MusicAddPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicAddPage")
);
const MusicModifyPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicModifyPage")
);
const MusicListPage = lazy(() =>
  import("../pages/admin/products/AdminProductsMusicListPage")
);
const ProductOrderPage = lazy(() =>
  import("../pages/admin/orders/ProductOrderPage")
);
const ProductOrderDetailPage = lazy(() =>
  import("../pages/admin/orders/ProductOrderDetailPage")
);

const adminProductsRouter = () => {
  return [
    {
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <MusicAddPage />
        </Suspense>
      ),
    },
    {
      path: "modify/:pno",
      element: (
        <Suspense fallback={Loading}>
          <MusicModifyPage />
        </Suspense>
      ),
    },
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <MusicListPage />
        </Suspense>
      ),
    },
    {
      path: "order/list",
      element: (
        <Suspense fallback={Loading}>
          <ProductOrderPage />
        </Suspense>
      ),
    },
    {
      path: "order/detail/:orderNum",
      element: (
        <Suspense fallback={Loading}>
          <ProductOrderDetailPage />
        </Suspense>
      ),
    },
  ];
};

export default adminProductsRouter;
