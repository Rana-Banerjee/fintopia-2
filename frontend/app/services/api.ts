import { AssetLiability, IncomeExpense, Loan } from '../types';
import { toBackendAssetLiability, toBackendIncomeExpense, fromBackendAssetLiability, fromBackendIncomeExpense, toBackendLoan, fromBackendLoan } from '../lib/mappers';

const API_BASE = 'http://localhost:8000/api';

async function fetchWithError(url: string, options?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  } catch (networkError) {
    throw new Error((networkError as Error).message || 'Network request failed');
  }

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text().catch(() => null);
    }

    const body = errorBody as { detail?: string; message?: string };
    const message =
      typeof errorBody === 'string'
        ? errorBody
        : body.detail || body.message || `HTTP ${response.status}`;

    throw new Error(message || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (response.status === 204 || !contentType.includes('application/json')) {
    return null;
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

export async function fetchAssetsLiabilities(): Promise<AssetLiability[]> {
  const response = await fetchWithError(`${API_BASE}/assets-liabilities`);
  return response.map(fromBackendAssetLiability);
}

export async function fetchIncomeExpenses(): Promise<IncomeExpense[]> {
  const response = await fetchWithError(`${API_BASE}/income-expenses`);
  return response.map(fromBackendIncomeExpense);
}

export async function fetchLoans(): Promise<Loan[]> {
  const response = await fetchWithError(`${API_BASE}/loans`);
  return response.map(fromBackendLoan); // add mapper for Loan
}

export async function createLoan(item: Loan): Promise<Loan> {
  const backendData = toBackendLoan(item);
  const response = await fetchWithError(`${API_BASE}/loans`, {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
  return fromBackendLoan(response);
}

export async function updateLoan(item: Loan): Promise<Loan> {
  const backendData = toBackendLoan(item);
  const response = await fetchWithError(`${API_BASE}/loans/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
  });
  return fromBackendLoan(response);
}

export async function deleteLoan(id: string): Promise<void> {
  await fetchWithError(`${API_BASE}/loans/${id}`, {
    method: 'DELETE',
  });
}