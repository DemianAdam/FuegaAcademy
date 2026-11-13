export async function transferFile(
  token: string | null | undefined,
  uploadId: string,
  file?: File,
  enrollmentId?: string,
) {
  if (!token) throw new Error("Ingresá nuevamente.");
  const base = (import.meta.env.VITE_CONVEX_URL as string).replace(
    ".convex.cloud",
    ".convex.site",
  );
  const url = new URL("/private-file", base);
  url.searchParams.set("uploadId", uploadId);
  if (enrollmentId) url.searchParams.set("enrollmentId", enrollmentId);
  const response = await fetch(url, {
    method: file ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(file ? { "Content-Type": file.type } : {}),
    },
    body: file,
  });
  if (!response.ok)
    throw new Error(
      "No se pudo acceder al archivo. Revisá el formato, tamaño y tu inscripción.",
    );
  if (!file) {
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = objectUrl;
    const encodedName = response.headers
      .get("Content-Disposition")
      ?.match(/filename\*=UTF-8''(.+)/)?.[1];
    link.download = encodedName ? decodeURIComponent(encodedName) : "material";
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
