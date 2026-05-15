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
import { AssetLiability, AssetSubType, SUB_TYPES } from '../types';

interface SortableItemProps {
  id: string;
  item: AssetLiability;
  onEdit: (item: AssetLiability) => void;
  onDelete: (id: string) => void;
}

function SortableAssetItem({ id, item, onEdit, onDelete }: SortableItemProps) {
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
        <div className="text-xs text-gray-500 flex gap-2">
          <span className={item.type === 'Asset' ? 'text-green-600' : 'text-red-600'}>{item.type}</span>
          <span>•</span>
          <span>{item.subType}</span>
          <span>•</span>
          <span>{item.annualAppreciationPercent}% / {item.appreciationFrequency}</span>
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
  items: AssetLiability[];
  onReorder: (items: AssetLiability[]) => void;
  onEdit: (item: AssetLiability) => void;
  onDelete: (id: string) => void;
}

export default function SortableAssetList({ items, onReorder, onEdit, onDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedItems = SUB_TYPES.reduce((acc, subType) => {
    acc[subType] = items.filter((item) => item.subType === subType);
    return acc;
  }, {} as Record<AssetSubType, AssetLiability[]>);

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
          {SUB_TYPES.map((subType) => {
            const groupItems = groupedItems[subType];
            if (groupItems.length === 0) return null;
            return (
              <div key={subType}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                  {subType}
                </h4>
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <SortableAssetItem
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