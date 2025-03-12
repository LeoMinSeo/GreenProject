import React from "react";
import { Link } from "react-router-dom";

const AdminMenubar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <Link to={"/"} className="text-black font-bold">
        <img src="/images/mainlogo.png" className="w-24" />
      </Link>
      <br />
      <ul className="space-y-3 flex flex-col flex-grow ">
        <li className="font-bold text-gray-700 hover:text-red-500 cursor-pointer">
          <Link to={"/admin"}>관리자 홈으로</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/add1"}>음악상품 등록</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/add2"}>음악상품 관리</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/modify1"}>문화상품 등록</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/modify2"}>문화상품 관리</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminMenubar;
