import React from "react";
import ListComponent from "../../components/products/ListComponent";

const ProductListPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      <ProductsListComponent />
    </div>
  );
};

export default ProductListPage;
