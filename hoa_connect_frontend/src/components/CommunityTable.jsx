import React from "react";

const CommunityTable = ({ communities, onEdit, onDelete }) => (
  <table className="min-w-full border bg-white rounded-lg overflow-hidden">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Location</th>
        <th className="p-3 text-left">Admin</th>
        <th className="p-3 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {communities.map((c) => (
        <tr key={c._id} className="border-t hover:bg-gray-50">
          <td className="p-3">{c.name}</td>
          <td className="p-3">{c.location}</td>
          <td className="p-3">{c.admin?.name || "—"}</td>
          <td className="p-3 flex gap-2">
            <button onClick={() => onEdit(c)} className="text-blue-600 hover:underline">
              Edit
            </button>
            <button onClick={() => onDelete(c._id)} className="text-red-600 hover:underline">
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CommunityTable;