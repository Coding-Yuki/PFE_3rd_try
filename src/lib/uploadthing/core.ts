import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  postFile: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // This code runs on your server before upload
      console.log("Pinged UploadThing Middleware");
      return {};
    })
    .onUploadComplete(() => {
      // This code runs on your server after upload
    }),
};

export type OurFileRouter = typeof uploadRouter;
