import upyun from "upyun";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_NAME = process.env.UPYUN_SERVICE_NAME;
const OPERATOR_NAME = process.env.UPYUN_OPERATOR_NAME;
const OPERATOR_PASSWORD = process.env.UPYUN_OPERATOR_PASSWORD;
const REMOTE_PATH_PREFIX = process.env.UPYUN_REMOTE_PATH || "/";

if (!SERVICE_NAME || !OPERATOR_NAME || !OPERATOR_PASSWORD) {
  console.error(
    "❌ Error: Please configure UPYUN_SERVICE_NAME, UPYUN_OPERATOR_NAME, and UPYUN_OPERATOR_PASSWORD in .env file.",
  );
  process.exit(1);
}

// Initialize UpYun Service
const service = new upyun.Service(
  SERVICE_NAME,
  OPERATOR_NAME,
  OPERATOR_PASSWORD,
);
const client = new upyun.Client(service);

// Build the project
console.log("🚀 Starting build...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build successful!");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}

// Upload logic
const DIST_DIR = path.resolve(__dirname, "../dist");

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function uploadFiles() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Dist directory not found at ${DIST_DIR}`);
    process.exit(1);
  }

  const files = getAllFiles(DIST_DIR);
  console.log(`📦 Found ${files.length} files to upload...`);

  let successCount = 0;
  let failCount = 0;

  for (const filePath of files) {
    const relativePath = path.relative(DIST_DIR, filePath);
    // Normalize path separators to forward slashes for URL/Remote path
    const remotePath = path.posix.join(
      REMOTE_PATH_PREFIX,
      relativePath.split(path.sep).join("/"),
    );

    const fileContent = fs.readFileSync(filePath);

    console.log(`⬆️ Uploading: ${relativePath} -> ${remotePath}`);

    try {
      const result = await client.putFile(remotePath, fileContent);
      if (result) {
        successCount++;
      } else {
        console.error(`⚠️ Upload failed (no result): ${relativePath}`);
        failCount++;
      }
    } catch (error) {
      console.error(`❌ Upload error for ${relativePath}:`, error.message);
      failCount++;
    }
  }

  console.log("\n🎉 Deployment finished!");
  console.log(`✅ Success: ${successCount}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`);
  }
}

uploadFiles().catch((err) => {
  console.error("❌ Unexpected error:", err);
});
