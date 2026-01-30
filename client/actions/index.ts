"use server";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { message: "Nenhum arquivo enviado" };
  }
  const response = await fetch("https://api.uploadthing.com/v6/uploadFiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Uploadthing-Api-Key": process.env.UPLOADTHING_API_KEY!,
    },
    body: JSON.stringify({
      files: [
        {
          name: file.name,
          size: file.size,
          type: file.type,
          customId: null,
        },
      ],
      acl: "public-read",
      contentDisposition: "inline",
    }),
  });
  const data = await response.json();
  const uploadData = data?.data?.[0];
  if (!uploadData?.fileUrl || !uploadData?.fields) {
    return { message: "Erro ao subir o comprovativo" };
  }
  const uploadForm = new FormData();
  Object.entries(uploadData.fields).forEach(([k, v]) =>
    uploadForm.append(k, v as string),
  );
  uploadForm.append("file", file);
  const uploadRes = await fetch(uploadData.url, {
    method: "POST",
    body: uploadForm,
  });
  if (!uploadRes.ok) {
    return { message: "Erro ao subir o comprovativo" };
  }
  return {
    message: "sucesso",
    file: uploadData.fileUrl,
  };
}
