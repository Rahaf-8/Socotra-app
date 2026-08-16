import { getCurrentAdmin } from "@/lib/auth/admin";
import { deleteOwnedCloudinaryAsset, registerCloudinaryAsset } from "@/lib/images/asset-registry";
import { destroyCloudinaryImage, uploadImage } from "@/lib/images/cloudinary";
import { prisma } from "@/lib/prisma";
import { cloudinaryPublicIdSchema, hasValidImageSignature, imageUploadContextSchema, MAX_IMAGE_UPLOAD_BYTES, validateImageFile } from "@/lib/validation/image-upload";

export const runtime = "nodejs";

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return json({ ok: false, error: "Administrator authentication is required." }, 401);
  if (admin.mustChangePassword) return json({ ok: false, error: "Change your administrator password before uploading images." }, 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false, error: "The upload request origin is invalid." }, 403);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_IMAGE_UPLOAD_BYTES + 1024 * 1024) return json({ ok: false, error: "The upload request is too large." }, 413);

  let formData: FormData;
  try { formData = await request.formData(); }
  catch { return json({ ok: false, error: "The upload request could not be read." }, 400); }
  const context = imageUploadContextSchema.safeParse(formData.get("context"));
  const file = formData.get("file");
  if (!context.success || !(file instanceof File)) return json({ ok: false, error: "Choose an image and a supported upload destination." }, 400);
  const fileError = validateImageFile(file);
  if (fileError) return json({ ok: false, error: fileError }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidImageSignature(bytes.subarray(0, 32), file.type.toLowerCase())) return json({ ok: false, error: "The file contents do not match a supported image format." }, 400);

  let uploaded: Awaited<ReturnType<typeof uploadImage>> | undefined;
  try {
    uploaded = await uploadImage(Buffer.from(bytes), context.data);
    await registerCloudinaryAsset({ publicId: uploaded.publicId, secureUrl: uploaded.secureUrl, context: context.data });
    return json({ ok: true, asset: uploaded }, 201);
  } catch (error) {
    if (uploaded) await destroyCloudinaryImage(uploaded.publicId).catch(() => false);
    const missingConfig = error instanceof Error && error.message === "cloudinary-not-configured";
    return json({ ok: false, error: missingConfig ? "Cloudinary uploads are not configured on this server." : "The image could not be uploaded. Try again." }, missingConfig ? 503 : 502);
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return json({ ok: false, error: "Administrator authentication is required." }, 401);
  if (admin.mustChangePassword) return json({ ok: false, error: "Change your administrator password before managing images." }, 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false, error: "The request origin is invalid." }, 403);
  let input: unknown;
  try { input = await request.json(); } catch { return json({ ok: false, error: "The request could not be read." }, 400); }
  const publicId = cloudinaryPublicIdSchema.safeParse(typeof input === "object" && input ? (input as { publicId?: unknown }).publicId : undefined);
  if (!publicId.success) return json({ ok: false, error: "The image reference is invalid." }, 400);
  const asset = await prisma.cloudinaryAsset.findUnique({ where: { publicId: publicId.data }, select: { claimedAt: true } });
  if (!asset || asset.claimedAt) return json({ ok: false, error: "Only an uncommitted uploaded image can be removed here." }, 409);
  return await deleteOwnedCloudinaryAsset(publicId.data)
    ? json({ ok: true }, 200)
    : json({ ok: false, error: "The uploaded image could not be removed." }, 502);
}
