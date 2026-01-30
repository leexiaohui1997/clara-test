import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "./clara-test/", // 设为相对路径，适配 GitHub Pages 非根目录部署
  plugins: [vue()],
});
