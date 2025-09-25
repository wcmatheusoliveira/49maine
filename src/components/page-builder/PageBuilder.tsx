"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Save, Undo, Redo, Eye, Laptop, Tablet, Smartphone, ArrowLeft } from "lucide-react";
import ComponentLibrary from "./ComponentLibrary";
import PropertyPanel from "./PropertyPanel";
import { sectionTemplates } from "./section-templates";
import { useHotkeys } from "react-hotkeys-hook";
import Link from "next/link";

interface Section {
  id: string;
  type: string;
  name: string;
  order: number;
  isVisible: boolean;
  data: any;
}

interface PageBuilderProps {
  pageId: string;
  initialSections: Section[];
  onSave: (sections: Section[]) => void;
}

// Sortable Section Component
function SortableSection({ section, isSelected, onSelect, onUpdate }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(section)}
    >
      <div
        {...listeners}
        className="absolute left-2 top-2 z-10 p-2 bg-white rounded-lg shadow-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      <div className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{section.name}</h3>
          <span className="text-sm text-gray-500">{section.type}</span>
        </div>

        {/* Section Preview */}
        <div className="bg-gray-50 rounded p-4 min-h-[100px]">
          {renderSectionPreview(section)}
        </div>
      </div>
    </div>
  );
}

// Render section preview based on type
function renderSectionPreview(section: Section) {
  const data = typeof section.data === 'string' ? JSON.parse(section.data) : section.data;

  switch (section.type) {
    case 'hero':
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{data.headline || 'Hero Section'}</h2>
          <p className="text-gray-600">{data.tagline || 'Tagline goes here'}</p>
        </div>
      );
    case 'menu':
      return (
        <div>
          <h3 className="font-semibold mb-2">{data.title || 'Menu'}</h3>
          <p className="text-sm text-gray-600">Dynamic menu from database</p>
        </div>
      );
    case 'content':
      return (
        <div>
          <h3 className="font-semibold mb-2">{data.title || 'Content Section'}</h3>
          <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: data.content || '<p>Content goes here</p>' }} />
        </div>
      );
    case 'location':
      return (
        <div>
          <h3 className="font-semibold mb-2">{data.title || 'Location'}</h3>
          <p className="text-sm text-gray-600">Map and business hours</p>
        </div>
      );
    case 'cta':
      return (
        <div className="text-center">
          <h3 className="font-semibold mb-2">{data.title || 'Call to Action'}</h3>
          <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">
            {data.button?.text || 'Button'}
          </button>
        </div>
      );
    default:
      return (
        <div className="text-gray-500">
          <p>Section: {section.type}</p>
        </div>
      );
  }
}

export default function PageBuilder({ pageId, initialSections, onSave }: PageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [history, setHistory] = useState<Section[][]>([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Add to history when sections change
  const addToHistory = (newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasChanges(true);
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  // Keyboard shortcuts
  useHotkeys('cmd+z, ctrl+z', undo);
  useHotkeys('cmd+shift+z, ctrl+shift+z', redo);
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault();
    handleSave();
  });

  // Handle drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, index) => ({
        ...s,
        order: index
      }));

      setSections(newSections);
      addToHistory(newSections);
    }

    setActiveId(null);
  };

  // Add new section
  const addSection = (templateId: string) => {
    const template = sectionTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: template.type,
      name: template.name,
      order: sections.length,
      isVisible: true,
      data: template.defaultData
    };

    const newSections = [...sections, newSection];
    setSections(newSections);
    addToHistory(newSections);
    setSelectedSection(newSection);
  };

  // Update section
  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const newSections = sections.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    );
    setSections(newSections);
    addToHistory(newSections);

    if (selectedSection?.id === sectionId) {
      setSelectedSection({ ...selectedSection, ...updates });
    }
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    const newSections = sections.filter(s => s.id !== sectionId).map((s, index) => ({
      ...s,
      order: index
    }));
    setSections(newSections);
    addToHistory(newSections);
    setSelectedSection(null);
  };

  // Duplicate section
  const duplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newSection: Section = {
      ...section,
      id: `section-${Date.now()}`,
      name: `${section.name} (Copy)`,
      order: sections.length
    };

    const newSections = [...sections, newSection];
    setSections(newSections);
    addToHistory(newSections);
  };

  // Save changes
  const handleSave = () => {
    onSave(sections);
    setHasChanges(false);
  };

  // Get preview container classes based on device view
  const getPreviewClasses = () => {
    switch (deviceView) {
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'mobile':
        return 'max-w-sm mx-auto';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">Page Builder</h1>
            {hasChanges && <span className="text-sm text-orange-500">• Unsaved changes</span>}
          </div>

          <div className="flex items-center gap-4">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border-r pr-4">
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Cmd+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Device View */}
            <div className="flex items-center gap-1 border-r pr-4">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-2 rounded ${deviceView === 'desktop' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`p-2 rounded ${deviceView === 'tablet' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-2 rounded ${deviceView === 'mobile' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Mode */}
            <button
              onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode === 'edit' ? 'Preview' : 'Edit'}
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Library */}
        {previewMode === 'edit' && (
          <ComponentLibrary onAddSection={addSection} />
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className={`${getPreviewClasses()} bg-white rounded-lg shadow-lg min-h-full`}>
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-6 space-y-4">
                  {sections.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                      <p className="text-lg mb-2">No sections yet</p>
                      <p className="text-sm">Drag components from the left sidebar to get started</p>
                    </div>
                  ) : (
                    sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isSelected={selectedSection?.id === section.id}
                        onSelect={setSelectedSection}
                        onUpdate={updateSection}
                      />
                    ))
                  )}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
                    <p className="font-semibold">Moving section...</p>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Property Panel */}
        {previewMode === 'edit' && selectedSection && (
          <PropertyPanel
            section={selectedSection}
            onUpdate={(updates) => updateSection(selectedSection.id, updates)}
            onDelete={() => deleteSection(selectedSection.id)}
            onDuplicate={() => duplicateSection(selectedSection.id)}
            onClose={() => setSelectedSection(null)}
          />
        )}
      </div>
    </div>
  );
}