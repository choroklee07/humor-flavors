"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createHumorFlavor(formData: FormData) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = createAdminClient();
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  const { data, error } = await (supabase as any)
    .from("humor_flavors")
    .insert({ slug: slug.trim(), description: description.trim() || null, created_by_user_id: user.id, modified_by_user_id: user.id })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/humor-flavors");
  revalidatePath("/");
  redirect(`/humor-flavors/${data.id}`);
}

export async function updateHumorFlavor(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  await (supabase as any)
    .from("humor_flavors")
    .update({ slug: slug.trim(), description: description.trim() || null })
    .eq("id", parseInt(id));

  revalidatePath("/humor-flavors");
  revalidatePath(`/humor-flavors/${id}`);
  revalidatePath("/");
  redirect(`/humor-flavors/${id}`);
}

export async function deleteHumorFlavor(formData: FormData) {
  const supabase = createAdminClient();
  const id = formData.get("id") as string;

  await (supabase as any).from("humor_flavors").delete().eq("id", parseInt(id));

  revalidatePath("/humor-flavors");
  revalidatePath("/");
  redirect("/humor-flavors");
}

export async function createHumorFlavorStep(formData: FormData) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = createAdminClient();
  const humorFlavorId = parseInt(formData.get("humorFlavorId") as string);
  const description = formData.get("description") as string;
  const llmSystemPrompt = formData.get("llmSystemPrompt") as string;
  const llmUserPrompt = formData.get("llmUserPrompt") as string;
  const llmTemperature = formData.get("llmTemperature") as string;
  const llmModelId = formData.get("llmModelId") as string;
  const stepTypeId = formData.get("stepTypeId") as string;
  const inputTypeId = formData.get("inputTypeId") as string;
  const outputTypeId = formData.get("outputTypeId") as string;

  // Get next order_by value
  const { data: existing } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("order_by")
    .eq("humor_flavor_id", humorFlavorId)
    .order("order_by", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].order_by + 1 : 1;

  const { error } = await (supabase as any).from("humor_flavor_steps").insert({
    humor_flavor_id: humorFlavorId,
    order_by: nextOrder,
    description: description.trim() || null,
    llm_system_prompt: llmSystemPrompt.trim() || null,
    llm_user_prompt: llmUserPrompt.trim() || null,
    llm_temperature: llmTemperature ? parseFloat(llmTemperature) : null,
    llm_model_id: llmModelId ? parseInt(llmModelId) : null,
    humor_flavor_step_type_id: stepTypeId ? parseInt(stepTypeId) : null,
    llm_input_type_id: parseInt(inputTypeId),
    llm_output_type_id: parseInt(outputTypeId),
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/humor-flavors/${humorFlavorId}`);
  redirect(`/humor-flavors/${humorFlavorId}`);
}

export async function updateHumorFlavorStep(formData: FormData) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = createAdminClient();
  const stepId = parseInt(formData.get("stepId") as string);
  const humorFlavorId = parseInt(formData.get("humorFlavorId") as string);
  const description = formData.get("description") as string;
  const llmSystemPrompt = formData.get("llmSystemPrompt") as string;
  const llmUserPrompt = formData.get("llmUserPrompt") as string;
  const llmTemperature = formData.get("llmTemperature") as string;
  const llmModelId = formData.get("llmModelId") as string;
  const stepTypeId = formData.get("stepTypeId") as string;
  const inputTypeId = formData.get("inputTypeId") as string;
  const outputTypeId = formData.get("outputTypeId") as string;

  const { error } = await (supabase as any)
    .from("humor_flavor_steps")
    .update({
      description: description.trim() || null,
      llm_system_prompt: llmSystemPrompt.trim() || null,
      llm_user_prompt: llmUserPrompt.trim() || null,
      llm_temperature: llmTemperature ? parseFloat(llmTemperature) : null,
      llm_model_id: llmModelId ? parseInt(llmModelId) : null,
      humor_flavor_step_type_id: stepTypeId ? parseInt(stepTypeId) : null,
      llm_input_type_id: parseInt(inputTypeId),
      llm_output_type_id: parseInt(outputTypeId),
      modified_by_user_id: user.id,
    })
    .eq("id", stepId);

  if (error) throw new Error(error.message);

  revalidatePath(`/humor-flavors/${humorFlavorId}`);
  redirect(`/humor-flavors/${humorFlavorId}`);
}

export async function deleteHumorFlavorStep(formData: FormData) {
  const supabase = createAdminClient();
  const stepId = parseInt(formData.get("stepId") as string);
  const humorFlavorId = parseInt(formData.get("humorFlavorId") as string);

  await (supabase as any).from("humor_flavor_steps").delete().eq("id", stepId);

  // Re-number remaining steps sequentially
  const { data: remaining } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("id")
    .eq("humor_flavor_id", humorFlavorId)
    .order("order_by", { ascending: true });

  if (remaining) {
    for (let i = 0; i < remaining.length; i++) {
      await (supabase as any)
        .from("humor_flavor_steps")
        .update({ order_by: i + 1 })
        .eq("id", remaining[i].id);
    }
  }

  revalidatePath(`/humor-flavors/${humorFlavorId}`);
}

export async function moveStepUp(formData: FormData) {
  const supabase = createAdminClient();
  const stepId = parseInt(formData.get("stepId") as string);
  const humorFlavorId = parseInt(formData.get("humorFlavorId") as string);

  const { data: steps } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("id, order_by")
    .eq("humor_flavor_id", humorFlavorId)
    .order("order_by", { ascending: true });

  if (!steps) return;
  const idx = steps.findIndex((s: any) => s.id === stepId);
  if (idx <= 0) return;

  const curr = steps[idx];
  const prev = steps[idx - 1];

  await (supabase as any).from("humor_flavor_steps").update({ order_by: prev.order_by }).eq("id", curr.id);
  await (supabase as any).from("humor_flavor_steps").update({ order_by: curr.order_by }).eq("id", prev.id);

  revalidatePath(`/humor-flavors/${humorFlavorId}`);
}

export async function moveStepDown(formData: FormData) {
  const supabase = createAdminClient();
  const stepId = parseInt(formData.get("stepId") as string);
  const humorFlavorId = parseInt(formData.get("humorFlavorId") as string);

  const { data: steps } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("id, order_by")
    .eq("humor_flavor_id", humorFlavorId)
    .order("order_by", { ascending: true });

  if (!steps) return;
  const idx = steps.findIndex((s: any) => s.id === stepId);
  if (idx < 0 || idx >= steps.length - 1) return;

  const curr = steps[idx];
  const next = steps[idx + 1];

  await (supabase as any).from("humor_flavor_steps").update({ order_by: next.order_by }).eq("id", curr.id);
  await (supabase as any).from("humor_flavor_steps").update({ order_by: curr.order_by }).eq("id", next.id);

  revalidatePath(`/humor-flavors/${humorFlavorId}`);
}

export async function duplicateHumorFlavor(formData: FormData) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = createAdminClient();
  const sourceId = parseInt(formData.get("sourceId") as string);
  const newSlug = (formData.get("newSlug") as string).trim();

  const { data: source, error: sourceError } = await (supabase as any)
    .from("humor_flavors")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (sourceError || !source) throw new Error("Source flavor not found");

  const { data: newFlavor, error: insertError } = await (supabase as any)
    .from("humor_flavors")
    .insert({ slug: newSlug, description: source.description, created_by_user_id: user.id, modified_by_user_id: user.id })
    .select("id")
    .single();

  if (insertError) throw new Error(insertError.message);

  const { data: steps } = await (supabase as any)
    .from("humor_flavor_steps")
    .select("*")
    .eq("humor_flavor_id", sourceId)
    .order("order_by", { ascending: true });

  if (steps && steps.length > 0) {
    const { error: stepsError } = await (supabase as any).from("humor_flavor_steps").insert(
      steps.map((step: any) => ({
        humor_flavor_id: newFlavor.id,
        order_by: step.order_by,
        description: step.description,
        llm_system_prompt: step.llm_system_prompt,
        llm_user_prompt: step.llm_user_prompt,
        llm_temperature: step.llm_temperature,
        llm_model_id: step.llm_model_id,
        llm_input_type_id: step.llm_input_type_id,
        llm_output_type_id: step.llm_output_type_id,
        humor_flavor_step_type_id: step.humor_flavor_step_type_id,
        created_by_user_id: user.id,
      }))
    );
    if (stepsError) throw new Error(stepsError.message);
  }

  revalidatePath("/humor-flavors");
  revalidatePath("/");
  redirect(`/humor-flavors/${newFlavor.id}`);
}

export async function testHumorFlavor(_prevState: any, formData: FormData) {
  "use server";
  const humorFlavorId = formData.get("humorFlavorId") as string;
  const inputMode = formData.get("inputMode") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const imageFile = formData.get("imageFile") as File | null;

  const sessionClient = await createClient();
  const { data: { session } } = await sessionClient.auth.getSession();
  if (!session?.access_token) return { error: "Not authenticated" };
  const token = session.access_token;

  let imageId: string;

  try {
    if (inputMode === "file") {
      if (!imageFile || imageFile.size === 0) return { error: "Image file is required" };

      // Step 1: Get presigned upload URL from the pipeline
      const presignRes = await fetch("https://api.almostcrackd.ai/pipeline/generate-presigned-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentType: imageFile.type }),
      });

      if (!presignRes.ok) {
        return { error: `Presigned URL generation failed: ${presignRes.status} ${await presignRes.text()}` };
      }

      const { presignedUrl, cdnUrl } = await presignRes.json();

      // Step 2: PUT the file bytes directly to the presigned URL (no auth header)
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": imageFile.type },
        body: await imageFile.arrayBuffer(),
      });

      if (!putRes.ok) {
        return { error: `File upload failed: ${putRes.status} ${await putRes.text()}` };
      }

      // Step 3: Register the CDN URL with the pipeline
      const uploadRes = await fetch("https://api.almostcrackd.ai/pipeline/upload-image-from-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      });

      if (!uploadRes.ok) {
        return { error: `Image registration failed: ${uploadRes.status} ${await uploadRes.text()}` };
      }

      ({ imageId } = await uploadRes.json());
    } else {
      if (!imageUrl?.trim()) return { error: "Image URL is required" };

      // Step 1: Upload image to pipeline to get imageId
      const uploadRes = await fetch("https://api.almostcrackd.ai/pipeline/upload-image-from-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl.trim(), isCommonUse: false }),
      });

      if (!uploadRes.ok) {
        return { error: `Image upload failed: ${uploadRes.status} ${await uploadRes.text()}` };
      }

      ({ imageId } = await uploadRes.json());
    }

    // Step 2: Generate captions using the humor flavor
    const captionRes = await fetch("https://api.almostcrackd.ai/pipeline/generate-captions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId, humorFlavorId: parseInt(humorFlavorId) }),
    });

    if (!captionRes.ok) {
      return { error: `Caption generation failed: ${captionRes.status} ${await captionRes.text()}` };
    }

    const data = await captionRes.json();
    const records: any[] = data.captions ?? (Array.isArray(data) ? data : [data]);
    const captions = records.map((r) => (typeof r === "string" ? r : (r.content ?? JSON.stringify(r))));
    return { captions, imageId };
  } catch (e: any) {
    return { error: e.message ?? "Unknown error" };
  }
}
