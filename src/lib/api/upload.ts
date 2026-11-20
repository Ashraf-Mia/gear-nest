// Upload the selected image to our API route, which then sends it to ImgBB.
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(data.error || "ImgBB did not return an image URL.");
  }

  return data.url as string;
}
