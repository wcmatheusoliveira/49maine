"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Copy, Trash2, Settings, Palette, Type } from "lucide-react";
import { ChromePicker } from "react-color";

interface PropertyPanelProps {
  section: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export default function PropertyPanel({
  section,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose
}: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const data = typeof section.data === 'string' ? JSON.parse(section.data) : section.data;

  const handleDataChange = (key: string, value: any) => {
    const newData = { ...data, [key]: value };
    onUpdate({ data: newData });
  };

  const handleArrayItemChange = (arrayKey: string, index: number, field: string, value: any) => {
    const newArray = [...(data[arrayKey] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    handleDataChange(arrayKey, newArray);
  };

  const addArrayItem = (arrayKey: string, defaultItem: any) => {
    const newArray = [...(data[arrayKey] || []), defaultItem];
    handleDataChange(arrayKey, newArray);
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    const newArray = data[arrayKey].filter((_: any, i: number) => i !== index);
    handleDataChange(arrayKey, newArray);
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="text"
                value={data.logo || ''}
                onChange={(e) => handleDataChange('logo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Navigation Items</label>
              {(data.navItems || []).map((item: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name || ''}
                    onChange={(e) => handleArrayItemChange('navItems', index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Link to section"
                    value={item.to || ''}
                    onChange={(e) => handleArrayItemChange('navItems', index, 'to', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeArrayItem('navItems', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('navItems', { name: 'New Item', to: 'section' })}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + Add Navigation Item
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.showCallButton || false}
                  onChange={(e) => handleDataChange('showCallButton', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Call Button</span>
              </label>
            </div>

            {data.showCallButton && (
              <div>
                <label className="block text-sm font-medium mb-1">Call Button Text</label>
                <input
                  type="text"
                  value={data.callButtonText || ''}
                  onChange={(e) => handleDataChange('callButtonText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Sticky Behavior</label>
              <select
                value={data.stickyBehavior || 'none'}
                onChange={(e) => handleDataChange('stickyBehavior', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="none">Regular (Not Fixed)</option>
                <option value="sticky">Always Sticky</option>
                <option value="reveal">Reveal on Scroll Up</option>
              </select>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline (supports HTML)</label>
              <textarea
                value={data.headline || ''}
                onChange={(e) => handleDataChange('headline', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subheadline</label>
              <input
                type="text"
                value={data.subheadline || ''}
                onChange={(e) => handleDataChange('subheadline', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={data.tagline || ''}
                onChange={(e) => handleDataChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Special Announcement</label>
              <input
                type="text"
                value={data.specialAnnouncement || ''}
                onChange={(e) => handleDataChange('specialAnnouncement', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Tonight's Special: Half-Price Wings After 8PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Value Props</label>
              {(data.valueProps || []).map((prop: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={prop}
                    onChange={(e) => {
                      const newProps = [...(data.valueProps || [])];
                      newProps[index] = e.target.value;
                      handleDataChange('valueProps', newProps);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      const newProps = data.valueProps.filter((_: any, i: number) => i !== index);
                      handleDataChange('valueProps', newProps);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleDataChange('valueProps', [...(data.valueProps || []), 'New Value Prop'])}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + Add Value Prop
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.showOpenStatus || false}
                  onChange={(e) => handleDataChange('showOpenStatus', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Open Status</span>
              </label>

              {data.showOpenStatus && (
                <input
                  type="text"
                  value={data.openStatusText || ''}
                  onChange={(e) => handleDataChange('openStatusText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g., Open Now • Closes at 10PM"
                />
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.showLocallyOwned || false}
                  onChange={(e) => handleDataChange('showLocallyOwned', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Locally Owned</span>
              </label>

              {data.showLocallyOwned && (
                <input
                  type="text"
                  value={data.locallyOwnedText || ''}
                  onChange={(e) => handleDataChange('locallyOwnedText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g., Locally Owned & Operated"
                />
              )}
            </div>

            {data.backgroundVideo !== undefined && (
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <input
                  type="text"
                  value={data.backgroundVideo || ''}
                  onChange={(e) => handleDataChange('backgroundVideo', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            {data.backgroundImage !== undefined && (
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={data.backgroundImage || ''}
                  onChange={(e) => handleDataChange('backgroundImage', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            {data.ctaButtons && (
              <div>
                <label className="block text-sm font-medium mb-2">CTA Buttons</label>
                {data.ctaButtons.map((button: any, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Button text"
                      value={button.text || ''}
                      onChange={(e) => handleArrayItemChange('ctaButtons', index, 'text', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={button.url || ''}
                      onChange={(e) => handleArrayItemChange('ctaButtons', index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={() => removeArrayItem('ctaButtons', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('ctaButtons', { text: 'New Button', url: '#' })}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  + Add Button
                </button>
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => handleDataChange('content', e.target.value)}
                placeholder="Enter your content..."
                className="w-full px-3 py-2 border rounded-lg min-h-[200px]"
              />
            </div>

            {data.image !== undefined && (
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={data.image || ''}
                  onChange={(e) => handleDataChange('image', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Features</label>
              {(data.features || []).map((feature: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 mb-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Icon"
                        value={feature.icon || ''}
                        onChange={(e) => handleArrayItemChange('features', index, 'icon', e.target.value)}
                        className="w-20 px-3 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={feature.title || ''}
                        onChange={(e) => handleArrayItemChange('features', index, 'title', e.target.value)}
                        className="flex-1 px-3 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeArrayItem('features', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={feature.description || ''}
                      onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
                      className="w-full px-3 py-1 border rounded text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('features', { icon: '⭐', title: 'Feature', description: 'Description' })}
                className="text-sm text-blue-500 hover:text-blue-600"
                >
                + Add Feature
              </button>
            </div>
          </div>
        );

      case 'menu':
      case 'menu-featured':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {data.subtitle !== undefined && (
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => handleDataChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            {section.type === 'menu' && (
              <>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.showPrices || false}
                      onChange={(e) => handleDataChange('showPrices', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Prices</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.showDescriptions || false}
                      onChange={(e) => handleDataChange('showDescriptions', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Descriptions</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Layout</label>
                  <select
                    value={data.layout || 'grid'}
                    onChange={(e) => handleDataChange('layout', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                    <option value="cards">Cards</option>
                  </select>
                </div>
              </>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Columns</label>
              <select
                value={data.columns || 3}
                onChange={(e) => handleDataChange('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              {(data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={image.url || ''}
                    onChange={(e) => handleArrayItemChange('images', index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={image.alt || ''}
                    onChange={(e) => handleArrayItemChange('images', index, 'alt', e.target.value)}
                    className="w-32 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeArrayItem('images', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('images', { url: '', alt: '' })}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + Add Image
              </button>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Main Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Come Find Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => handleDataChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Worth the trip, easy to find"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hours Section Title</label>
              <input
                type="text"
                value={data.hoursTitle || ''}
                onChange={(e) => handleDataChange('hoursTitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Section Title</label>
              <input
                type="text"
                value={data.contactTitle || ''}
                onChange={(e) => handleDataChange('contactTitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Contact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Get Directions Button Text</label>
              <input
                type="text"
                value={data.directionsButtonText || ''}
                onChange={(e) => handleDataChange('directionsButtonText', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Get Directions"
              />
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Note:</p>
              <p>Location data like address, hours, and contact info are managed in the Business Info settings.</p>
            </div>
          </div>
        );

      case 'cta':
      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => handleDataChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {section.type === 'cta' && data.button && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Button</label>
                <input
                  type="text"
                  placeholder="Button text"
                  value={data.button.text || ''}
                  onChange={(e) => handleDataChange('button', { ...data.button, text: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Button URL"
                  value={data.button.url || ''}
                  onChange={(e) => handleDataChange('button', { ...data.button, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            {section.type === 'newsletter' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={data.placeholder || ''}
                    onChange={(e) => handleDataChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input
                    type="text"
                    value={data.buttonText || ''}
                    onChange={(e) => handleDataChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            <p>No content editor available for this section type</p>
          </div>
        );
    }
  };

  const renderStyleEditor = () => {
    return (
      <div className="space-y-4">
        {data.backgroundColor !== undefined && (
          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <div className="relative">
              <div
                className="w-full h-10 rounded-lg border cursor-pointer flex items-center px-3"
                style={{ backgroundColor: data.backgroundColor || '#ffffff' }}
                onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
              >
                <span className="text-sm">{data.backgroundColor || '#ffffff'}</span>
              </div>
              {showColorPicker === 'bg' && (
                <div className="absolute z-10 mt-2">
                  <div className="fixed inset-0" onClick={() => setShowColorPicker(null)} />
                  <ChromePicker
                    color={data.backgroundColor || '#ffffff'}
                    onChange={(color) => handleDataChange('backgroundColor', color.hex)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {data.textColor !== undefined && (
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <div className="relative">
              <div
                className="w-full h-10 rounded-lg border cursor-pointer flex items-center px-3"
                style={{ backgroundColor: data.textColor || '#000000' }}
                onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
              >
                <span className="text-sm" style={{ color: data.textColor === '#000000' ? '#ffffff' : '#000000' }}>
                  {data.textColor || '#000000'}
                </span>
              </div>
              {showColorPicker === 'text' && (
                <div className="absolute z-10 mt-2">
                  <div className="fixed inset-0" onClick={() => setShowColorPicker(null)} />
                  <ChromePicker
                    color={data.textColor || '#000000'}
                    onChange={(color) => handleDataChange('textColor', color.hex)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {data.overlayOpacity !== undefined && (
          <div>
            <label className="block text-sm font-medium mb-1">Overlay Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={data.overlayOpacity || 0.5}
              onChange={(e) => handleDataChange('overlayOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{data.overlayOpacity || 0.5}</span>
          </div>
        )}

        {data.imagePosition !== undefined && (
          <div>
            <label className="block text-sm font-medium mb-1">Image Position</label>
            <select
              value={data.imagePosition || 'right'}
              onChange={(e) => handleDataChange('imagePosition', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Properties</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Info */}
        <div className="text-sm text-gray-600 mb-3">
          <p className="font-medium text-gray-900">{section.name}</p>
          <p>Type: {section.type}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ isVisible: !section.isVisible })}
            className={`flex-1 px-3 py-2 border rounded-lg text-sm flex items-center justify-center gap-2 ${
              section.isVisible ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {section.isVisible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={onDuplicate}
            className="flex-1 px-3 py-2 border rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          <Type className="w-4 h-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'style' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          <Palette className="w-4 h-4" />
          Style
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && renderContentEditor()}
        {activeTab === 'style' && renderStyleEditor()}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section Name</label>
              <input
                type="text"
                value={section.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Section ID</label>
              <input
                type="text"
                value={section.id}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                value={section.order}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}