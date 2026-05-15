"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loan, MONTHS } from '../types';

interface Props {
  onSubmit: (item: Loan) => void;
  onCancel: () => void;
  editItem?: Loan;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

export default function LoanForm({ onSubmit, onCancel, editItem }: Props) {
  const [name, setName] = useState(editItem?.name || '');
  const [interestRate, setInterestRate] = useState(editItem?.interestRate?.toString() || '0');
  const [emiStartMonth, setEmiStartMonth] = useState(editItem?.emiStartMonth ?? 0);
  const [emiStartYear, setEmiStartYear] = useState(editItem?.emiStartYear ?? currentYear);
  const [emiEndMonth, setEmiEndMonth] = useState(editItem?.emiEndMonth ?? 0);
  const [emiEndYear, setEmiEndYear] = useState(editItem?.emiEndYear ?? currentYear + 1);
  const [emiValue, setEmiValue] = useState(editItem?.emiValue?.toString() || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: editItem?.id || uuidv4(),
      name,
      interestRate: parseFloat(interestRate) || 0,
      emiStartMonth,
      emiStartYear,
      emiEndMonth,
      emiEndYear,
      emiValue: parseFloat(emiValue) || 0,
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
          placeholder="e.g., Home Loan, Car Loan"
        />
      </div>

      <div>
        <label className={labelClass}>Interest Rate (%) *</label>
        <input
          type="number"
          step="0.01"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g., 8.5"
        />
      </div>

      <div>
        <label className={labelClass}>EMI Start Month *</label>
        <select
          value={emiStartMonth}
          onChange={(e) => setEmiStartMonth(parseInt(e.target.value))}
          className={selectClass}
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>EMI Start Year *</label>
        <select
          value={emiStartYear}
          onChange={(e) => setEmiStartYear(parseInt(e.target.value))}
          className={selectClass}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>EMI End Month *</label>
        <select
          value={emiEndMonth}
          onChange={(e) => setEmiEndMonth(parseInt(e.target.value))}
          className={selectClass}
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>EMI End Year *</label>
        <select
          value={emiEndYear}
          onChange={(e) => setEmiEndYear(parseInt(e.target.value))}
          className={selectClass}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>EMI Value *</label>
        <input
          type="number"
          step="0.01"
          value={emiValue}
          onChange={(e) => setEmiValue(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g., 25000"
        />
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