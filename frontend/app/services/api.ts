import { AssetLiability, IncomeExpense } from '../types';
import { toBackendAssetLiability, toBackendIncomeExpense, fromBackendAssetLiability, fromBackendIncomeExpense } from '../lib/mappers';

const API_BASE = 'http://localhost:8000/api';

async function fetchWithError(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function createAssetLiability(item: AssetLiability): Promise<AssetLiability> {
  const backendData = toBackendAssetLiability(item);
  const response = await fetchWithError(`${API_BASE}/assets-liabilities`, {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
  return fromBackendAssetLiability(response);
}

export async function updateAssetLiability(item: AssetLiability): Promise<AssetLiability> {
  const backendData = toBackendAssetLiability(item);
  const response = await fetchWithError(`${API_BASE}/assets-liabilities/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
  });
  return fromBackendAssetLiability(response);
}

export async function deleteAssetLiability(id: string): Promise<void> {
  await fetchWithError(`${API_BASE}/assets-liabilities/${id}`, {
    method: 'DELETE',
  });
}

export async function createIncomeExpense(item: IncomeExpense): Promise<IncomeExpense> {
  const backendData = toBackendIncomeExpense(item);
  const response = await fetchWithError(`${API_BASE}/income-expenses`, {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
  return fromBackendIncomeExpense(response);
}

export async function updateIncomeExpense(item: IncomeExpense): Promise<IncomeExpense> {
  const backendData = toBackendIncomeExpense(item);
  const response = await fetchWithError(`${API_BASE}/income-expenses/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
  });
  return fromBackendIncomeExpense(response);
}

export async function deleteIncomeExpense(id: string): Promise<void> {
  await fetchWithError(`${API_BASE}/income-expenses/${id}`, {
    method: 'DELETE',
  });
}