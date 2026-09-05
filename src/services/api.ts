import { mockProperties } from '../data/mockProperties';
import type { InquiryPayload, InquiryRecord, Property, User } from '../types';

const STORAGE_KEY_PROPERTIES = 'raja_custom_properties';
const STORAGE_KEY_DELETED = 'raja_deleted_properties';

function getCustomProperties(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    return raw ? (JSON.parse(raw) as Property[]) : [];
  } catch {
    return [];
  }
}

function saveCustomProperties(props: Property[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(props));
  } catch (err) {
    console.error('Failed to save properties to localStorage', err);
  }
}

function getDeletedPropertyIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveDeletedPropertyId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedPropertyIds();
    if (!current.includes(id)) {
      localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify([...current, id]));
    }
  } catch (err) {
    console.error('Failed to save deleted property to localStorage', err);
  }
}

export async function apiFetchProperties(): Promise<Property[]> {
  try {
    const res = await fetch('/api/properties');
    if (res.ok) {
      const data = await res.json();
      const deletedIds = getDeletedPropertyIds();
      const custom = getCustomProperties();

      const mergedMap = new Map<string, Property>();
      [...data, ...custom].forEach((p) => mergedMap.set(p.id, p));

      return Array.from(mergedMap.values()).filter((p) => !deletedIds.includes(p.id));
    }
  } catch (e) {
    // Client-side fallback
  }

  const custom = getCustomProperties();
  const deletedIds = getDeletedPropertyIds();
  return [...custom, ...mockProperties].filter((p) => !deletedIds.includes(p.id));
}

export async function apiFetchPropertyById(id: string): Promise<Property> {
  try {
    const res = await fetch(`/api/properties/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Client-side fallback
  }

  const custom = getCustomProperties();
  const deletedIds = getDeletedPropertyIds();
  const allProperties = [...custom, ...mockProperties].filter((p) => !deletedIds.includes(p.id));
  const found = allProperties.find((p) => p.id === id);
  if (!found) {
    return Promise.reject({ message: 'Property not found.' });
  }
  return found;
}

export async function apiAddProperty(payload: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
  const newProp: Property = {
    ...payload,
    id: `p-custom-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const serverProp = await res.json();
      const custom = getCustomProperties();
      saveCustomProperties([serverProp, ...custom]);
      return serverProp;
    }
  } catch (e) {
    // Fallback to local persistence
  }

  const custom = getCustomProperties();
  saveCustomProperties([newProp, ...custom]);
  return newProp;
}

export async function apiDeleteProperty(id: string): Promise<string> {
  saveDeletedPropertyId(id);

  try {
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
  } catch (e) {
    // Fallback
  }

  const custom = getCustomProperties();
  const updatedCustom = custom.filter((p) => p.id !== id);
  saveCustomProperties(updatedCustom);

  return id;
}

export async function apiLogin(email: string, password: string): Promise<User> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    return Promise.reject({ message: errData.message || 'Incorrect credentials' });
  } catch (e) {
    if (email.toLowerCase() === 'owner@rajaconstruction.com' && password === 'ownerpassword123') {
      return { id: 'u-owner', name: 'Raja Property Owner', email: 'owner@rajaconstruction.com', role: 'owner' };
    }
    return { id: 'u-demo', name: 'Demo Client', email: 'demo@rajaconstruction.com', role: 'client' };
  }
}

export async function apiSignup(name: string, email: string, password: string, role: 'client' | 'owner' = 'client'): Promise<User> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback
  }
  return { id: `u-${Date.now()}`, name, email, role };
}

export async function apiSubmitInquiry(payload: InquiryPayload): Promise<InquiryRecord> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback
  }
  return {
    ...payload,
    id: `inq-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
}
