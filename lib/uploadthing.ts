import { createUploadthing, type FileRouter } from "uploadthing/server"
import { generateReactHelpers } from "@uploadthing/react"

const f = createUploadthing()

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.ufsUrl)
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
