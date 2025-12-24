

// export const ENDPOINTS = {
//   AUTH: {
//     LOGIN: "/auth/login",
//     REGISTER: "/auth/register",
//   },
//   SUPERADMIN: {
//     COMMUNITIES: "/communities",
//     ADMINS: "/users/admins",
//     PAYMENTS: "/payments",
//     NOTIFICATIONS: "/announcements/latest",
//   },
// };
const BASE_URL = "http://localhost:5000";

const ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  DASHBOARD: `${BASE_URL}/dashboard/superadmin`,
  NOTIFICATIONS: `${BASE_URL}/superadmin/addnotifications`,
  AMENITIES: `${BASE_URL}/amenities`,
  COMMUNITY: `${BASE_URL}/superadmin`,
};

export default ENDPOINTS;
