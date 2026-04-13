import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
<<<<<<< HEAD
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://10.195.250.155:5000",
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })




export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://10.195.250.155:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})

=======
export default defineConfig({
  plugins: [react()],
})
>>>>>>> origin/main
