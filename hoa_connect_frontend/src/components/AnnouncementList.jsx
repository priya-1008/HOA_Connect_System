const AnnouncementList = ({ announcements }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-3">Latest Announcements</h3>
    <ul className="space-y-2">
      {announcements.map((a) => (
        <li key={a._id} className="text-sm text-gray-700">
          📢 {a.title}
        </li>
      ))}
    </ul>
  </div>
);

export default AnnouncementList;