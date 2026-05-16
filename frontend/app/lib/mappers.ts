import { AssetLiability, AssetLiabilityType, AssetSubType, AppreciationFrequency, IncomeExpense, IncomeExpenseType, AccrualFrequency, Loan } from '../types';

export type BackendAssetLiabilityType = 'asset' | 'liability';
export type BackendAssetSubType = 'liquid' | 'semi_liquid' | 'fixed';
export type BackendAppreciationFrequency = 'monthly' | 'bi_monthly' | 'quarterly' | 'semi_annually' | 'yearly';
export type BackendIncomeExpenseType = 'income' | 'expense';

interface BackendAssetLiabilityResponse {
  asset_liability_id: number;
  name: string;
  type: BackendAssetLiabilityType;
  sub_type: BackendAssetSubType;
  annual_appreciation_percentage: number | null;
  appreciation_frequency: BackendAppreciationFrequency | null;
  is_loan: boolean;
  created_at: string;
  updated_at: string;
}

interface BackendIncomeExpenseResponse {
  income_expense_id: number;
  name: string;
  type: BackendIncomeExpenseType;
  application_frequency: string | null;
  annual_appreciation: number | null;
  appreciation_frequency: BackendAppreciationFrequency | null;
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  associated_asset_id: number | null;
  is_loan: boolean;
  created_at: string;
  updated_at: string;
}

interface BackendLoanResponse {
  loan_id: number;
  name: string;
  interest_rate: number | null;
  emi_start_month: number;
  emi_start_year: number;
  emi_end_month: number | null;
  emi_end_year: number | null;
  emi_value: number | null;
  created_at?: string;
  updated_at?: string;
}

const mapAppreciationFrequency = (freq: AppreciationFrequency | string): BackendAppreciationFrequency => {
  const mapping: Record<AppreciationFrequency, BackendAppreciationFrequency> = {
    'monthly': 'monthly',
    'bi-monthly': 'bi_monthly',
    'quarterly': 'quarterly',
    'semi-annually': 'semi_annually',
    'yearly': 'yearly',
  };
  return mapping[freq as AppreciationFrequency] || 'yearly';
};

const reverseMapAppreciationFrequency = (freq: BackendAppreciationFrequency): AppreciationFrequency => {
  const mapping: Record<BackendAppreciationFrequency, AppreciationFrequency> = {
    'monthly': 'monthly',
    'bi_monthly': 'bi-monthly',
    'quarterly': 'quarterly',
    'semi_annually': 'semi-annually',
    'yearly': 'yearly',
  };
  return mapping[freq] || 'yearly';
};

export const toBackendAssetLiability = (item: AssetLiability) => {
  const typeMap: Record<AssetLiabilityType, BackendAssetLiabilityType> = {
    'Asset': 'asset',
    'Liability': 'liability',
  };

  const subTypeMap: Record<AssetSubType, BackendAssetSubType> = {
    'Liquid': 'liquid',
    'Semi-Liquid': 'semi_liquid',
    'Fixed': 'fixed',
  };

  return {
    name: item.name,
    type: typeMap[item.type],
    sub_type: subTypeMap[item.subType],
    annual_appreciation_percentage: item.annualAppreciationPercent ?? null,
    appreciation_frequency: item.appreciationFrequency ? mapAppreciationFrequency(item.appreciationFrequency) : null,
    is_loan: false,
  };
};

export const toBackendIncomeExpense = (item: IncomeExpense) => {
  const typeMap: Record<IncomeExpenseType, BackendIncomeExpenseType> = {
    'Income': 'income',
    'Expense': 'expense',
  };

  return {
    name: item.name,
    type: typeMap[item.type],
    application_frequency: item.accrualFrequency ?? null,
    annual_appreciation: item.annualAppreciationPercent ?? null,
    appreciation_frequency: item.appreciationFrequency ? mapAppreciationFrequency(item.appreciationFrequency) : null,
    start_month: item.startMonth,
    start_year: item.startYear,
    end_month: item.endMonth,
    end_year: item.endYear,
    associated_asset_id: item.associatedAsset ? parseInt(item.associatedAsset, 10) : null,
    is_loan: false,
  };
};

export const fromBackendAssetLiability = (data: BackendAssetLiabilityResponse): AssetLiability => {
  const typeMap: Record<BackendAssetLiabilityType, AssetLiabilityType> = {
    'asset': 'Asset',
    'liability': 'Liability',
  };

  const subTypeMap: Record<BackendAssetSubType, AssetSubType> = {
    'liquid': 'Liquid',
    'semi_liquid': 'Semi-Liquid',
    'fixed': 'Fixed',
  };

  return {
    id: data.asset_liability_id.toString(),
    name: data.name,
    type: typeMap[data.type],
    subType: subTypeMap[data.sub_type],
    annualAppreciationPercent: data.annual_appreciation_percentage ?? 0,
    appreciationFrequency: data.appreciation_frequency ? reverseMapAppreciationFrequency(data.appreciation_frequency) : 'yearly',
    position: data.asset_liability_id,
  };
};

export const fromBackendIncomeExpense = (data: BackendIncomeExpenseResponse): IncomeExpense => {
  const typeMap: Record<BackendIncomeExpenseType, IncomeExpenseType> = {
    'income': 'Income',
    'expense': 'Expense',
  };

  return {
    id: data.income_expense_id.toString(),
    name: data.name,
    type: typeMap[data.type],
    accrualFrequency: (data.application_frequency as AccrualFrequency) || 'monthly',
    annualAppreciationPercent: data.annual_appreciation ?? 0,
    appreciationFrequency: data.appreciation_frequency ? reverseMapAppreciationFrequency(data.appreciation_frequency) : 'yearly',
    startMonth: data.start_month,
    startYear: data.start_year,
    endMonth: data.end_month,
    endYear: data.end_year,
    associatedAsset: data.associated_asset_id?.toString() ?? '',
    position: data.income_expense_id,
  };
};

export const fromBackendLoan = (data: BackendLoanResponse): Loan => {
  return {
    id: data.loan_id.toString(),
    name: data.name,
    interestRate: data.interest_rate ?? 0,
    emiStartMonth: data.emi_start_month,
    emiStartYear: data.emi_start_year,
    emiEndMonth: data.emi_end_month ?? 0,
    emiEndYear: data.emi_end_year ?? 0,
    emiValue: data.emi_value ?? 0,
    position: data.loan_id,
  };
};

export const toBackendLoan = (item: Loan) => {
  return {
    name: item.name,
    interest_rate: item.interestRate ?? null,
    emi_start_month: item.emiStartMonth,
    emi_start_year: item.emiStartYear,
    emi_end_month: item.emiEndMonth ?? null,
    emi_end_year: item.emiEndYear ?? null,
    emi_value: item.emiValue ?? null,
  };
};