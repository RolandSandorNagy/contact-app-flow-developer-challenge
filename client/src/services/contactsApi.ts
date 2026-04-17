import type { Contact, ContactPayload } from "../types/contact";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : undefined;
    throw new Error(message || "Request failed.");
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
