"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IncomeExpense, IncomeExpenseType, AppreciationFrequency, AssetLiability, ACCRUAL_FREQUENCIES, APPRECIATION_FREQUENCIES, MONTHS, AccrualFrequency } from '../types';

interface Props {
  onSubmit: (item: IncomeExpense) => void;
  onCancel: () => void;
  editItem?: IncomeExpense;
  assets: AssetLiability[];
  defaultType?:IncomeExpenseType;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

export default function IncomeExpenseForm({ onSubmit, onCancel, editItem, assets, defaultType }: Props) {
  const [name, setName] = useState(editItem?.name || '');
  const [type, setType] = useState<IncomeExpenseType>(editItem?.type || defaultType|| 'Income');
  const [accrualFrequency, setAccrualFrequency] = useState<AccrualFrequency>(editItem?.accrualFrequency || 'monthly');
  const [annualAppreciationPercent, setAnnualAppreciationPercent] = useState(editItem?.annualAppreciationPercent?.toString() || '0');
  const [appreciationFrequency, setAppreciationFrequency] = useState<AppreciationFrequency>(editItem?.appreciationFrequency || 'yearly');
  const [startMonth, setStartMonth] = useState(editItem?.startMonth ?? 0);
  const [startYear, setStartYear] = useState(editItem?.startYear ?? currentYear);
  const [endMonth, setEndMonth] = useState<number | null>(editItem?.endMonth ?? null);
  const [endYear, setEndYear] = useState<number | null>(editItem?.endYear ?? null);
  const [hasEndDate, setHasEndDate] = useState(editItem?.endMonth !== null && editItem?.endYear !== null);
  const [associatedAsset, setAssociatedAsset] = useState(editItem?.associatedAsset || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: editItem?.id || uuidv4(),
      name,
      type,
      accrualFrequency,
      annualAppreciationPercent: parseFloat(annualAppreciationPercent) || 0,
      appreciationFrequency,
      startMonth,
      startYear,
      endMonth: hasEndDate ? endMonth : null,
      endYear: hasEndDate ? endYear : null,
      associatedAsset,
      position: editItem?.position ?? Date.now(),
    });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass = `${inputClass} appearance-none bg-white`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g., Salary, Rent, Groceries"
        />
      </div>

      {/* <div>
        <label className={labelClass}>Type *</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as IncomeExpenseType)}
          className={selectClass}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div> */}

      <div>
        <label className={labelClass}>Accrual Frequency *</label>
        <select
          value={accrualFrequency}
          onChange={(e) => setAccrualFrequency(e.target.value as AccrualFrequency)}
          className={selectClass}
        >
          {ACCRUAL_FREQUENCIES.map((freq) => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Annual Appreciation (%)</label>
          <input
            type="number"
            step="0.01"
            value={annualAppreciationPercent}
            onChange={(e) => setAnnualAppreciationPercent(e.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClass}>Appreciation Frequency</label>
          <select
            value={appreciationFrequency}
            onChange={(e) => setAppreciationFrequency(e.target.value as AppreciationFrequency)}
            className={selectClass}
          >
            {APPRECIATION_FREQUENCIES.map((freq) => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Month *</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(parseInt(e.target.value))}
            className={selectClass}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Start Year *</label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(parseInt(e.target.value))}
            className={selectClass}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasEndDate"
          checked={hasEndDate}
          onChange={(e) => setHasEndDate(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="hasEndDate" className="text-sm text-gray-700">Has end date</label>
      </div>

      {hasEndDate && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>End Month</label>
            <select
              value={endMonth ?? ''}
              onChange={(e) => setEndMonth(parseInt(e.target.value))}
              className={selectClass}
            >
              <option value="">Select</option>
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>End Year</label>
            <select
              value={endYear ?? ''}
              onChange={(e) => setEndYear(parseInt(e.target.value))}
              className={selectClass}
            >
              <option value="">Select</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Associated Asset</label>
        <select
          value={associatedAsset}
          onChange={(e) => setAssociatedAsset(e.target.value)}
          className={selectClass}
        >
          <option value="">None</option>
          {assets.filter(a => a.type === 'Asset').map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {editItem ? 'Update' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}