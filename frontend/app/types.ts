export type AppreciationFrequency = 'monthly' | 'bi-monthly' | 'quarterly' | 'semi-annually' | 'yearly';
export type AssetSubType = 'Liquid' | 'Semi-Liquid' | 'Fixed';
export type AssetLiabilityType = 'Asset' | 'Liability';
export type IncomeExpenseType = 'Income' | 'Expense';
export type AccrualFrequency = 'monthly' | 'bi-monthly' | 'quarterly' | 'semi-annually' | 'yearly';

export interface AssetLiability {
  id: string;
  name: string;
  type: AssetLiabilityType;
  subType: AssetSubType;
  annualAppreciationPercent: number;
  appreciationFrequency: AppreciationFrequency;
  position: number;
}

export interface IncomeExpense {
  id: string;
  name: string;
  type: IncomeExpenseType;
  accrualFrequency: AccrualFrequency;
  annualAppreciationPercent: number;
  appreciationFrequency: AppreciationFrequency;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  associatedAsset: string;
  position: number;
}

export interface Loan {
  id: string;
  name: string;
  interestRate: number;
  emiStartMonth: number;
  emiStartYear: number;
  emiEndMonth: number;
  emiEndYear: number;
  emiValue: number;
  position: number;
}

export interface AppData {
  assetsLiabilities: AssetLiability[];
  incomesExpenses: IncomeExpense[];
  loans: Loan[];
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const SUB_TYPES: AssetSubType[] = ['Liquid', 'Semi-Liquid', 'Fixed'];
export const APPRECIATION_FREQUENCIES: AppreciationFrequency[] = [
  'monthly', 'bi-monthly', 'quarterly', 'semi-annually', 'yearly'
];
export const ACCRUAL_FREQUENCIES: AccrualFrequency[] = [
  'monthly', 'bi-monthly', 'quarterly', 'semi-annually', 'yearly'
];