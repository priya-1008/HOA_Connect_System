// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const Navbar = ({ title }) => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <header className="bg-white shadow-sm flex items-center justify-between px-6 py-3">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <div className="flex items-center gap-4">
//         <span className="text-gray-600 text-sm">{user?.name || "Super Admin"}</span>
//         <button
//           onClick={logout}
//           className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
// const DashboardCard = ({ title, value }) => (
//   <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
//     <h3 className="text-gray-500">{title}</h3>
//     <p className="text-3xl font-bold">{value}</p>
//   </div>
// );

// export default DashboardCard;

export default function DashboardCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-md text-white ${color}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}
