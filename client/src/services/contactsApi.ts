import type { Contact, ContactPayload } from "../types/contact";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function safeParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const rawBody = await response.text();

  let data: unknown = rawBody;
  if (isJson && rawBody) {
    data = safeParseJson(rawBody);
    if (data === null && response.ok) {
      throw new Error("Invalid server response.");
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : typeof data === "string" && data.trim().length > 0
          ? data
          : undefined;
    throw new Error(message || response.statusText || "Request failed.");
  }

  if (data === null || data === "") {
    return undefined as T;
  }

  return data as T;
}

export async function getContacts() {
  const response = await fetch(`${API_BASE_URL}/api/contacts`);
  return parseResponse<Contact[]>(response);
}

export async function createContact(payload: ContactPayload) {
  const response = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<Contact>(response);
}

export async function updateContact(id: number, payload: ContactPayload) {
  const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<Contact>(response);
}

export async function deleteContact(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
    method: "DELETE"
  });

  await parseResponse<void>(response);
}
