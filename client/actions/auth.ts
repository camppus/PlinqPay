"use server";

import AuthService from "@/services/auth";
const service = new AuthService();

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
}
