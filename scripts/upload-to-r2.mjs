// Uploads public/work/** to the R2 bucket, preserving the same relative path
// as the "work/..." URLs already baked into manual.ts. Content-hashed
// filenames mean nothing here ever changes shape, so every object gets a
// year-long immutable Cache-Control. Safe to re-run: an object already
// present at the same size is skipped, so an interrupted run just resumes.
//
// Usage: node --env-file=.env.local scripts/upload-to-r2.mjs

import { readdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import {
  S3Client,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_S3_ENDPOINT,
} = process.env;

for (const [name, v] of Object.entries({
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_S3_ENDPOINT,
})) {
  if (!v) {
    console.error(`Missing ${name}. Run with: node --env-file=.env.local scripts/upload-to-r2.mjs`);
    process.exit(1);
  }
}

const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const client = new S3Client({
  region: "auto",
  endpoint: R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

async function alreadyUploaded(key, size) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return head.ContentLength === size;
  } catch {
    return false;
  }
}

async function main() {
  const root = path.join(process.cwd(), "public", "work");
  let count = 0;
  let skipped = 0;
  let bytes = 0;

  for await (const file of walk(root)) {
    const key = path.relative(path.join(process.cwd(), "public"), file).split(path.sep).join("/");
    const { size } = await stat(file);

    if (await alreadyUploaded(key, size)) {
      skipped++;
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const upload = new Upload({
      client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: createReadStream(file),
        ContentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      },
    });

    await upload.done();
    count++;
    bytes += size;
    console.log(`uploaded  ${key}  (${(size / 1024 / 1024).toFixed(1)} MB)`);
  }

  console.log(`\nDone. ${count} uploaded (${(bytes / 1024 / 1024).toFixed(0)} MB), ${skipped} already present.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
