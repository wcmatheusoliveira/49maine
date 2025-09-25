"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Save, Undo, Redo, Eye, Laptop, Tablet, Smartphone, ArrowLeft, Plus, Settings, Trash2, Copy, GripVertical } from "lucide-react";
import DynamicSection from "../dynamic/DynamicSection";
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

interface VisualPageBuilderProps {
  pageId: string;
  initialSections: Section[];
  menuCategories?: any[];
  businessInfo?: any;
  onSave: (sections: Section[]) => void;
}

// Sortable Section Wrapper
function SortableSection({
  section,
  isSelected,
  onSelect,
  children,
  onDelete,
  onDuplicate,
  onToggleVisibility
}: any) {
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
      onClick={(e) => {
        e.stopPropagation();
        onSelect(section);
      }}
    >
      {/* Edit Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 border-2 border-transparent group-hover:border-blue-400 transition-all rounded-lg">
        {/* Section Controls */}
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-1.5">
            <button
              {...listeners}
              className="p-1 hover:bg-gray-100 rounded cursor-move"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-medium text-gray-700">{section.name}</span>
            <span className="text-xs text-gray-500">({section.type})</span>
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(section.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title={section.isVisible ? "Hide" : "Show"}
            >
              <Eye className={`w-4 h-4 ${section.isVisible ? 'text-gray-600' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(section);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(section.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Duplicate"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(section.id);
              }}
              className="p-1 hover:bg-red-100 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Actual Component */}
      <div className={`${!section.isVisible ? 'opacity-50' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default function VisualPageBuilder({
  pageId,
  initialSections,
  menuCategories,
  businessInfo,
  onSave
}: VisualPageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showLibrary, setShowLibrary] = useState(false);
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
    setShowLibrary(false);
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

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const newSections = sections.map(s =>
      s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">Visual Page Builder</h1>
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

            {/* Add Section */}
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
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
        {/* Component Library Sidebar */}
        {showLibrary && previewMode === 'edit' && (
          <ComponentLibrary onAddSection={addSection} />
        )}

        {/* Visual Canvas */}
        <div className="flex-1 overflow-auto">
          <div className={`${getPreviewClasses()} min-h-full`}>
            {/* Website Background */}
            <div style={{ backgroundColor: "#FBF8EB" }}>
              <div className={previewMode === 'edit' ? 'px-2 lg:px-12 py-8' : 'px-2 lg:px-12 py-8'}>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={previewMode === 'preview'}
                  >
                    {sections.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm p-24 text-center">
                        <p className="text-lg mb-2 text-gray-700">No sections yet</p>
                        <p className="text-sm text-gray-500 mb-4">Click "Add Section" to get started</p>
                        <button
                          onClick={() => setShowLibrary(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Add Your First Section
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Find footer section (last CTA) */}
                        {(() => {
                          const footerSection = sections
                            .filter(s => s.type === 'cta' || s.type === 'footer')
                            .sort((a, b) => b.order - a.order)[0];

                          const navigationAndHero = sections
                            .filter(s => s.type === 'navigation' || s.type === 'hero')
                            .sort((a, b) => a.order - b.order);

                          const contentSections = sections
                            .filter(s =>
                              s.type !== 'navigation' &&
                              s.type !== 'hero' &&
                              s.id !== footerSection?.id
                            )
                            .sort((a, b) => a.order - b.order);

                          return (
                            <>
                              {/* Render navigation and hero outside the white container */}
                              {navigationAndHero.map((section) => (
                            previewMode === 'edit' ? (
                              <SortableSection
                                key={section.id}
                                section={section}
                                isSelected={selectedSection?.id === section.id}
                                onSelect={setSelectedSection}
                                onDelete={deleteSection}
                                onDuplicate={duplicateSection}
                                onToggleVisibility={toggleSectionVisibility}
                              >
                                <DynamicSection
                                  section={section}
                                  menuCategories={menuCategories}
                                  businessInfo={businessInfo}
                                />
                              </SortableSection>
                            ) : (
                              <DynamicSection
                                key={section.id}
                                section={section}
                                menuCategories={menuCategories}
                                businessInfo={businessInfo}
                              />
                            )
                          ))}

                              {/* White Content Container for content sections */}
                              {contentSections.length > 0 && (
                                <div className="relative z-10 bg-white md:rounded-t-[40px] px-4 rounded-t-2xl sm:px-6 py-16 sm:py-20 lg:px-12 -mt-10 sm:-mt-20">
                                  {contentSections.map((section) =>
                                    previewMode === 'edit' ? (
                                      <SortableSection
                                        key={section.id}
                                        section={section}
                                        isSelected={selectedSection?.id === section.id}
                                        onSelect={setSelectedSection}
                                        onDelete={deleteSection}
                                        onDuplicate={duplicateSection}
                                        onToggleVisibility={toggleSectionVisibility}
                                      >
                                        <DynamicSection
                                          section={section}
                                          menuCategories={menuCategories}
                                          businessInfo={businessInfo}
                                        />
                                      </SortableSection>
                                    ) : (
                                      <DynamicSection
                                        key={section.id}
                                        section={section}
                                        menuCategories={menuCategories}
                                        businessInfo={businessInfo}
                                      />
                                    )
                                  )}
                                </div>
                              )}

                              {/* Footer CTA - Outside the white container */}
                              {footerSection && (
                                <div className="mt-8">
                                  {previewMode === 'edit' ? (
                                    <SortableSection
                                      section={footerSection}
                                      isSelected={selectedSection?.id === footerSection.id}
                                      onSelect={setSelectedSection}
                                      onDelete={deleteSection}
                                      onDuplicate={duplicateSection}
                                      onToggleVisibility={toggleSectionVisibility}
                                    >
                                      <DynamicSection
                                        section={footerSection}
                                        menuCategories={menuCategories}
                                        businessInfo={businessInfo}
                                      />
                                    </SortableSection>
                                  ) : (
                                    <DynamicSection
                                      section={footerSection}
                                      menuCategories={menuCategories}
                                      businessInfo={businessInfo}
                                    />
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    )}
                  </SortableContext>

                  <DragOverlay>
                    {activeId ? (
                      <div className="bg-white border-2 border-blue-500 rounded-lg p-8 shadow-2xl opacity-90">
                        <p className="font-semibold text-blue-600">Moving section...</p>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>
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