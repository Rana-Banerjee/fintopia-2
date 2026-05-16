"use client";

import { useState, useEffect } from 'react';
import { AssetLiability, IncomeExpense, Loan } from './types';
import AssetLiabilityForm from './components/AssetLiabilityForm';
import IncomeExpenseForm from './components/IncomeExpenseForm';
import LoanForm from './components/LoanForm';
import SortableAssetList from './components/SortableList';
import SortableIncomeExpenseList from './components/SortableIncomeExpenseList';
import SortableLoanList from './components/SortableLoanList';
import {
  createAssetLiability,
  updateAssetLiability,
  deleteAssetLiability,
  createIncomeExpense,
  updateIncomeExpense,
  createLoan,
  updateLoan,
  deleteLoan,
  fetchAssetsLiabilities,
  fetchIncomeExpenses,
  fetchLoans,
} from './services/api';

const TABS = ["Assets", "Liabilities", "Incomes", "Expenses", "Loans"] as const;

type TabType = typeof TABS[number];

type EditableItem = AssetLiability | IncomeExpense | Loan | null;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Assets");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableItem>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [assetsLiabilities, setAssetsLiabilities] = useState<AssetLiability[]>([]);
  const [incomesExpenses, setIncomesExpenses] = useState<IncomeExpense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  const currentAssets = assetsLiabilities.filter((a) => a.type === 'Asset');
  const currentLiabilities = assetsLiabilities.filter((a) => a.type === 'Liability');

  useEffect(() => {
    async function loadData() {
      const assets = await fetchAssetsLiabilities();
      const incomes = await fetchIncomeExpenses();
      const loansData = await fetchLoans();
      setAssetsLiabilities(assets);
      setIncomesExpenses(incomes);
      setLoans(loansData);
    }
    loadData().catch(console.error);
  }, []);

  const handleAssetLiabilitySubmit = async (item: AssetLiability) => {
    setApiError(null);
    try {
      if (editingItem) {
        await updateAssetLiability(item);
      } else {
        await createAssetLiability(item);
      }
      // refresh list from backend after mutation
      const assets = await fetchAssetsLiabilities();
      setAssetsLiabilities(assets);
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setApiError(message);
      // show UI error/notification as needed
    }
  };

  const handleIncomeExpenseSubmit = async (item: IncomeExpense) => {
    setApiError(null);
    try {
      if (editingItem) {
        await updateIncomeExpense(item);
      } else {
        await createIncomeExpense(item);
      }
      // refresh list from backend after mutation
      const incomes = await fetchIncomeExpenses();
      setIncomesExpenses(incomes);
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Income/Expense submit failed', err);
      setApiError('Income/Expense submit failed');
    }
  };

  const handleLoanSubmit = async (item: Loan) => {
    setApiError(null);
    try {
      if (editingItem) {
        await updateLoan(item);
      } else {
        await createLoan(item);
      }
      const loansData = await fetchLoans();
      setLoans(loansData);
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Loan submit failed', err);
      setApiError('Loan submit failed');
    }
  };

  const handleEdit = (item: EditableItem) => {
    if (item) {
      setEditingItem(item);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      if (type === 'asset-liability') {
        await deleteAssetLiability(id);
        const assets = await fetchAssetsLiabilities();
        setAssetsLiabilities(assets);
      } else if (type === 'income-expense') {
        // if you implement deleteIncomeExpense, do same pattern:
        // await deleteIncomeExpense(id);
        const incomes = await fetchIncomeExpenses();
        setIncomesExpenses(incomes);
      } else if (type === 'loan') {
        await deleteLoan(id);
        const loansData = await fetchLoans();
        setLoans(loansData);
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleReorder = (type: string, items: AssetLiability[] | IncomeExpense[] | Loan[]) => {
    if (type === 'asset-liability') {
      setAssetsLiabilities(items as AssetLiability[]);
    } else if (type === 'income-expense') {
      setIncomesExpenses(items as IncomeExpense[]);
    } else if (type === 'loan') {
      setLoans(items as Loan[]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowForm(false);
    setEditingItem(null);
  };

  const listSection = <T extends AssetLiability | IncomeExpense | Loan>(
    title: string,
    items: T[],
    type: string
  ) => (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2"></h3>
      {type === 'asset-liability' && (
        <SortableAssetList
          items={items as AssetLiability[]}
          onReorder={(newItems) => handleReorder('asset-liability', newItems)}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id, 'asset-liability')}
        />
      )}
      {type === 'income-expense' && (
        <SortableIncomeExpenseList
          items={items as IncomeExpense[]}
          onReorder={(newItems) => handleReorder('income-expense', newItems)}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id, 'income-expense')}
        />
      )}
      {type === 'loan' && (
        <SortableLoanList
          items={items as Loan[]}
          onReorder={(newItems) => handleReorder('loan', newItems)}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id, 'loan')}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    if (showForm) {
      switch (activeTab) {
        case 'Assets':
        case 'Liabilities':
          return (
            <AssetLiabilityForm
              onSubmit={handleAssetLiabilitySubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              editItem={editingItem as AssetLiability | undefined}
              defaultType={activeTab === 'Assets' ? 'Asset' : 'Liability'}
            />
          );
        case 'Incomes':
        case 'Expenses':
          return (
            <IncomeExpenseForm
              onSubmit={handleIncomeExpenseSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              editItem={editingItem as IncomeExpense | undefined}
              assets={currentAssets}
              defaultType={activeTab === 'Incomes' ? 'Income' : 'Expense'}
            />
          );
        case 'Loans':
          return (
            <LoanForm
              onSubmit={handleLoanSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              editItem={editingItem as Loan | undefined}
            />
          );
      }
    }

    switch (activeTab) {
      case 'Assets':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"></h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            {listSection('Assets', currentAssets, 'asset-liability')}
          </div>
        );
      case 'Liabilities':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"></h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            {listSection('Liabilities', currentLiabilities, 'asset-liability')}
          </div>
        );
      case 'Incomes':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"></h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            {listSection('Incomes', incomesExpenses.filter(i => i.type === 'Income'), 'income-expense')}
          </div>
        );
      case 'Expenses':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"></h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            {listSection('Expenses', incomesExpenses.filter(i => i.type === 'Expense'), 'income-expense')}
          </div>
        );
      case 'Loans':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"></h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            {listSection('Loans', loans, 'loan')}
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="relative max-w-4xl mx-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-0 right-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-900">Fintopia</h1>
        <p className="text-gray-600 mt-2">Your personal finance dashboard</p>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="border-b bg-white">
              <div className="flex overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab
                        ? "text-blue-600 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}
      {apiError && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-red-700">Error</h3>
            <p className="mt-3 text-sm text-gray-700">{apiError}</p>
            <button
              onClick={() => setApiError(null)}
              className="mt-6 inline-flex justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}