"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IncomeExpense, IncomeExpenseType, MONTHS } from '../types';

interface SortableItemProps {
  id: string;
  item: IncomeExpense;
  onEdit: (item: IncomeExpense) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ id, item, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDateRange = () => {
    const start = `${MONTHS[item.startMonth].slice(0, 3)} ${item.startYear}`;
    if (item.endMonth !== null && item.endYear !== null) {
      return `${start} - ${MONTHS[item.endMonth].slice(0, 3)} ${item.endYear}`;
    }
    return `${start} - Present`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{item.name}</div>
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
          <span className={item.type === 'Income' ? 'text-green-600' : 'text-red-600'}>{item.type}</span>
          <span>•</span>
          <span>{item.accrualFrequency}</span>
          <span>•</span>
          <span>{item.annualAppreciationPercent}% / {item.appreciationFrequency}</span>
          <span>•</span>
          <span>{formatDateRange()}</span>
        </div>
      </div>
      <button
        onClick={() => onEdit(item)}
        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(id)}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

interface Props {
  items: IncomeExpense[];
  onReorder: (items: IncomeExpense[]) => void;
  onEdit: (item: IncomeExpense) => void;
  onDelete: (id: string) => void;
}

export default function SortableIncomeExpenseList({ items, onReorder, onEdit, onDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedItems = ['Income', 'Expense'].reduce((acc, type) => {
    acc[type as IncomeExpenseType] = items.filter((item) => item.type === type);
    return acc;
  }, {} as Record<IncomeExpenseType, IncomeExpense[]>);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      position: idx,
    }));
    onReorder(newItems);
  };

  const allIds = items.map((i) => i.id);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No items yet. Add one above.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {(['Income', 'Expense'] as IncomeExpenseType[]).map((type) => {
            const groupItems = groupedItems[type];
            if (groupItems.length === 0) return null;
            return (
              <div key={type}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                  {type === 'Income' ? 'Incomes' : 'Expenses'}
                </h4>
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      item={item}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}