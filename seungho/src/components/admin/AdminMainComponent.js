import React, { useState } from "react";
import SalesPieChart from "./charts/SalesPieChart";
import SalesBarChart from "./charts/SalesBarChart";
import SalesChart from "./charts/SalesChart";
import AdminMenubar from "../menu/AdminMenubar";

const AdminMainComponent = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenubar />
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* 공지사항 */}
        <section className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h3 className="font-semibold text-lg border-b pb-2 mb-2">공지사항</h3>
          <p className="text-gray-500 text-sm">조회된 내역이 없습니다.</p>
        </section>

        {/* 학사일정 */}
        <section className="bg-white p-4 shadow-md rounded-lg mb-6">
          {/* <h3 className="font-semibold text-lg border-b pb-2 mb-2">이건뭘까</h3> */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">날짜</th>
                <th className="p-2">시간</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">2025.03.10~2025.04.10</td>
                <td className="p-2">15:15</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">2025.03.05~2024.05.15</td>
                <td className="p-2">16:23</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Main Content */}
        <section className="bg-white p-4 shadow-md rounded-lg mb-6">
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">쇼핑몰 관리자 대시보드</h1>

            {/* 선형 그래프 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <SalesChart />
              </div>
              <div className="w-full">
                <SalesPieChart className="w-screen" />
              </div>
            </div>
            {/* 막대 그래프 */}
            <br />
            <br />
            <h1 className="text-2xl font-bold mb-4">방문자현황</h1>
            <div className="grid grid-cols-2 gap-4">
              <SalesBarChart />
            </div>
          </main>
        </section>
      </main>
    </div>
  );
};

export default AdminMainComponent;

{
}
