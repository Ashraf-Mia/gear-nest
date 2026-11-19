import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ImgBB accepts images up to 32 MB, but 5 MB keeps the form fast.
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // Only logged-in users can upload images.
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return Response.json(
        { error: "You must be logged in to upload an image." },
        { status: 401 },
      );
    }

    // The API key stays on the server. It is never sent to the browser.
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error:
            "Image upload is not configured. Add IMGBB_API_KEY to your .env file.",
        },
        { status: 500 },
      );
    }

    // Read the file from the form data sent by the client.
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Please choose an image file." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image files (JPG, PNG, WEBP, etc.) are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "The image is too large. Please use an image under 5 MB." },
        { status: 400 },
      );
    }

    // ImgBB expects the image as a base64 string.
    const base64Image = Buffer.from(await file.arrayBuffer()).toString(
      "base64",
    );

    const imgbbForm = new FormData();
    imgbbForm.append("image", base64Image);

    // Upload the image to ImgBB.
    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbForm,
      },
    );

    const imgbbData = await imgbbResponse.json();

    if (!imgbbResponse.ok || !imgbbData.success) {
      console.error("ImgBB upload failed:", imgbbData);

      const imgbbMessage =
        typeof imgbbData?.error === "string"
          ? imgbbData.error
          : imgbbData?.error?.message;

      return Response.json(
        { error: imgbbMessage || "ImgBB could not upload this image." },
        { status: 502 },
      );
    }

    // Return the hosted image URL to the form.
    return Response.json({
      url: imgbbData.data.url,
      deleteUrl: imgbbData.data.delete_url,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return Response.json(
      { error: "Something went wrong while uploading the image." },
      { status: 500 },
    );
  }
}
