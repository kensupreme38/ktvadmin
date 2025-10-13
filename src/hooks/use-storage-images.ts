"use client";

import { useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export type UploadedImage = {
  path: string;
  url: string;
  name: string;
  contentType: string;
};

async function fileToWebp(file: File, quality = 0.9): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Unsupported file type");
  }
  if (file.type === "image/webp") {
    return file;
  }


  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP conversion failed"))),
      "image/webp",
      quality
    );
  });
}

function generateStoragePath(): string {
  const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `uploads/${id}.webp`;
}

export function useStorageImages() {
  const supabase = useMemo(() => createClient(), []);

  const uploadImages = useCallback(
    async (files: File[]): Promise<{ images: UploadedImage[]; errors: string[] }> => {
      const tasks = files.map(async (file) => {
        try {
          const webpBlob = await fileToWebp(file);
          const path = generateStoragePath();
          const { error } = await supabase.storage
            .from("ktv")
            .upload(path, webpBlob, {
              contentType: "image/webp",
              upsert: false,
              cacheControl: "31536000",
            });
          if (error) throw new Error(error.message);

          const { data } = supabase.storage.from("ktv").getPublicUrl(path);
          const image: UploadedImage = {
            path,
            url: data.publicUrl,
            name: file.name,
            contentType: "image/webp",
          };
          return { image };
        } catch (e: any) {
          return { error: `${file.name}: ${e?.message || "conversion/upload failed"}` };
        }
      });

      const results = await Promise.all(tasks);
      const images: UploadedImage[] = [];
      const errors: string[] = [];
      for (const r of results) {
        if ("image" in r) images.push((r as any).image);
        if ("error" in r) errors.push((r as any).error);
      }
      return { images, errors };
    },
    [supabase]
  );

  const insertImageRecords = useCallback(
    async (publicUrls: string[]) => {
      if (publicUrls.length === 0) return { count: 0, error: null };
      const rows = publicUrls.map((url) => ({ image_url: url }));
      const { error, count } = await supabase.from('images').insert(rows, { count: 'exact' });
      return { count: count || 0, error };
    },
    [supabase]
  );

  const uploadImagesAndCreateRecords = useCallback(
    async (files: File[]) => {
      const { images, errors } = await uploadImages(files);
      const urls = images.map((i) => i.url);
      const { error } = await supabase.from('images').insert(urls.map((u) => ({ image_url: u })));
      return { images, errors, dbError: error?.message };
    },
    [supabase, uploadImages]
  );

  return { uploadImages, insertImageRecords, uploadImagesAndCreateRecords };
}


