"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AssetLiability, AssetLiabilityType, AssetSubType, AppreciationFrequency, SUB_TYPES, APPRECIATION_FREQUENCIES } from '../types';

interface Props {
  onSubmit: (item: AssetLiability) => void;
  onCancel: () => void;
  editItem?: AssetLiability;
  defaultType?: AssetLiabilityType;
}

export default function AssetLiabilityForm({ onSubmit, onCancel, editItem, defaultType}: Props) {
  const [name, setName] = useState(editItem?.name || '');
  const [type, setType] = useState<AssetLiabilityType>(editItem?.type || defaultType|| 'Asset');
  const [subType, setSubType] = useState<AssetSubType>(editItem?.subType || 'Liquid');
  const [annualAppreciationPercent, setAnnualAppreciationPercent] = useState(editItem?.annualAppreciationPercent?.toString() || '0');
  const [appreciationFrequency, setAppreciationFrequency] = useState<AppreciationFrequency>(editItem?.appreciationFrequency || 'yearly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: editItem?.id || uuidv4(),
      name,
      type,
      subType,
      annualAppreciationPercent: parseFloat(annualAppreciationPercent) || 0,
      appreciationFrequency,
      position: editItem?.position ?? Date.now(),
    });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

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
          placeholder="e.g., Savings Account, Car Loan"
        />
      </div>

      {/* <div>
        <label className={labelClass}>Type *</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AssetLiabilityType)}
          className={inputClass}
        >
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
        </select>
      </div> */}

      <div>
        <label className={labelClass}>Sub-Type *</label>
        <select
          value={subType}
          onChange={(e) => setSubType(e.target.value as AssetSubType)}
          className={inputClass}
        >
          {SUB_TYPES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

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
          className={inputClass}
        >
          {APPRECIATION_FREQUENCIES.map((freq) => (
            <option key={freq} value={freq}>{freq}</option>
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