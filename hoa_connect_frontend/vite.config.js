// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [
//           ['babel-plugin-react-compiler']],
//       },
//     }),
//     tailwindcss()
//   ],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ DO NOT import @tailwindcss/vite
export default defineConfig({
  plugins: [react()],
})
