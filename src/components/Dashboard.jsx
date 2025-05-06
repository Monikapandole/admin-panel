import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaHome } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";

const barData = [
  { name: "Jan", uv: 4000 },
  { name: "Feb", uv: 3000 },
  { name: "Mar", uv: 2000 },
  { name: "Apr", uv: 2780 },
  { name: "May", uv: 1890 },
  { name: "Jun", uv: 2390 },
  { name: "Jul", uv: 3490 },
];

const pieData = [
  { name: "Search Engines", value: 30, color: "#8884d8" },
  { name: "Direct", value: 50, color: "#8dd1e1" },
  { name: "Social Media", value: 20, color: "#82ca9d" },
];

const statCards = [
  {
    title: "Weekly Sales",
    value: "$15,000",
    bg: "bg-gradient-to-r from-purple-500 to-pink-500  col-span-2",
  },
  {
    title: "Total Orders",
    value: "45,634",
    bg: "bg-gradient-to-r from-green-400 to-blue-500 col-span-2",
  },
  {
    title: "Total Sales",
    value: "$95,741",
    bg: "bg-gradient-to-r from-yellow-400 to-red-500 col-span-2",
  },
  {
    title: "Downloads",
    value: "1,236",
    bg: "bg-gradient-to-r from-indigo-400 to-purple-600 col-span-2",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f4f2f9] p-6 font-inter  pt-[80px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 text-white p-3 rounded-lg">
            <FaHome size={18} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="text-sm">Overview</span>
          <BsInfoCircle size={16} className="text-purple-500" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.bg} p-6 rounded-2xl text-white shadow-lg`}
          >
            <p className="text-sm mb-2">{card.title}</p>
            <h3 className="text-2xl font-bold">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uv" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
