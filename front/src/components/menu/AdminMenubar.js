import React from "react";
import { Link } from "react-router-dom";

const AdminMenubar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col flex-shrink-0">
      <Link to={"/"} className="text-black font-bold">
        <img src="/images/mainlogo.png" className="w-24" />
      </Link>
      <br />
      <ul className="space-y-3 flex flex-col flex-grow ">
        <li className="font-bold text-gray-700 hover:text-red-500 cursor-pointer">
          <Link to={"/admin"}>관리자 설정</Link>
        </li>

        {/* <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/modify/ProductsMusicModify"}>음원 상품 관리</Link>
        </li> */}
        {/* <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/list/TicketList"}>공연 티켓 목록</Link>
        </li> */}
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/products/add"}>음원 상품 등록</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/products/list"}>음악 상품 관리</Link>
        </li>

        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/concert/add"}>공연 티켓 등록</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/concert/list"}>공연 티켓 관리</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/products/order/list"}>상품 주문 관리</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/concert/order/list"}>티켓 주문 관리</Link>
        </li>
        <li className="font-bold text-gray-500 hover:text-red-500 cursor-pointer">
          <Link to={"/admin/user"}>가입 유저 목록</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminMenubar;
