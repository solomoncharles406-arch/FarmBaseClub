import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  MapPin,
  TrendingUp,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { LiveAssistanceActivity } from '../types';
import { INITIAL_LIVE_ASSISTANCE_ACTIVITIES } from '../data/initialData';

interface UploadLandingFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: LiveAssistanceActivity[];
  onSaveActivities: (newActivities: LiveAssistanceActivity[]) => void;
}

export const UploadLandingFeedModal: React.FC<UploadLandingFeedModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSaveActivities,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'manage'>('upload');
  const [items, setItems] = useState<LiveAssistanceActivity[]>(activities);
  const [pasteText, setPasteText] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Single entry form state
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'RENDERED' | 'GOT'>('RENDERED');
  const [newLocation, setNewLocation] = useState('Kaduna');
  const [newSector, setNewSector] = useState('Mechanized Grain Milling');
  const [newTimeAgo, setNewTimeAgo] = useState('Just now');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Parser helper function for CSV / text lines
  const parsePastedContent = (text: string): LiveAssistanceActivity[] => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    const parsedItems: LiveAssistanceActivity[] = [];

    lines.forEach((line, index) => {
      // Split by comma or tab or semicolon
      const parts = line.split(/[,;\t]+/).map((p) => p.trim());
      if (parts.length === 0) return;

      const name = parts[0];
      if (!name) return;

      // Clean amount: remove non-digits
      const rawAmt = parts[1] ? parts[1].replace(/[^0-9]/g, '') : '';
      const amount = rawAmt ? parseInt(rawAmt, 10) : 100000;

      // Detect type
      let type: 'RENDERED' | 'GOT' = index % 2 === 0 ? 'RENDERED' : 'GOT';
      const thirdPart = (parts[2] || '').toLowerCase();
      if (thirdPart.includes('got') || thirdPart.includes('redeem') || thirdPart.includes('payout')) {
        type = 'GOT';
      } else if (thirdPart.includes('render') || thirdPart.includes('support') || thirdPart.includes('pledge')) {
        type = 'RENDERED';
      }

      const location = parts[3] || 'Nigeria';
      const sector = parts[4] || (type === 'RENDERED' ? 'Agricultural Seed Fund' : 'Harvest Dividend Payout');

      parsedItems.push({
        id: `custom-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`,
        personName: name,
        amount: isNaN(amount) || amount <= 0 ? 100000 : amount,
        type,
        location,
        sectorOrCoop: sector,
        timeAgo: 'Just now',
        note: type === 'RENDERED'
          ? 'Mechanized farming assistance pledged'
          : 'Agricultural assistance payout disbursed',
      });
    });

    return parsedItems;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;

        // Try JSON first
        if (file.name.endsWith('.json')) {
          const jsonParsed = JSON.parse(content);
          if (Array.isArray(jsonParsed)) {
            const mapped: LiveAssistanceActivity[] = jsonParsed.map((entry, idx) => ({
              id: entry.id || `custom-json-${Date.now()}-${idx}`,
              personName: entry.personName || entry.name || 'Anonymous Farmer',
              amount: Number(entry.amount) || 100000,
              type: entry.type === 'GOT' ? 'GOT' : 'RENDERED',
              timeAgo: entry.timeAgo || 'Just now',
              location: entry.location || entry.state || 'Nigeria',
              sectorOrCoop: entry.sectorOrCoop || entry.sector || 'Agricultural Cluster',
              note: entry.note || (entry.type === 'GOT' ? 'Payout disbursed' : 'Assistance pledged'),
            }));

            setItems((prev) => [...mapped, ...prev]);
            setSaveNotice(`Successfully imported ${mapped.length} records from JSON!`);
            setActiveTab('manage');
            return;
          }
        }

        // CSV or TXT
        const parsed = parsePastedContent(content);
        if (parsed.length === 0) {
          setParseError('Could not find valid names and amounts in the file.');
          return;
        }

        setItems((prev) => [...parsed, ...prev]);
        setSaveNotice(`Successfully loaded ${parsed.length} entries from ${file.name}!`);
        setActiveTab('manage');
      } catch (err: any) {
        setParseError(`Error reading file: ${err.message || 'Invalid format'}`);
      }
    };

    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle paste text append
  const handleAppendPasted = () => {
    setParseError(null);
    if (!pasteText.trim()) {
      setParseError('Please paste at least one line with a Name and Amount.');
      return;
    }

    const parsed = parsePastedContent(pasteText);
    if (parsed.length === 0) {
      setParseError('Unable to parse valid records. Format: Name, Amount, Type, State, Sector');
      return;
    }

    setItems((prev) => [...parsed, ...prev]);
    setPasteText('');
    setSaveNotice(`Added ${parsed.length} new records to list.`);
    setActiveTab('manage');
  };

  // Handle paste text replace all
  const handleReplaceWithPasted = () => {
    setParseError(null);
    if (!pasteText.trim()) {
      setParseError('Please paste at least one line with a Name and Amount.');
      return;
    }

    const parsed = parsePastedContent(pasteText);
    if (parsed.length === 0) {
      setParseError('Unable to parse valid records. Format: Name, Amount, Type, State, Sector');
      return;
    }

    setItems(parsed);
    setPasteText('');
    setSaveNotice(`Replaced display list with ${parsed.length} new records.`);
    setActiveTab('manage');
  };

  // Handle single manual entry add
  const handleAddSingleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const numAmt = parseInt(newAmount.replace(/[^0-9]/g, ''), 10) || 50000;

    const newActivity: LiveAssistanceActivity = {
      id: `manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      personName: newName.trim(),
      amount: numAmt,
      type: newType,
      location: newLocation.trim() || 'Nigeria',
      sectorOrCoop: newSector.trim() || 'Mechanized Agro Cluster',
      timeAgo: newTimeAgo.trim() || 'Just now',
      note: newType === 'RENDERED'
        ? 'Assistance rendered to agricultural farming belt'
        : 'Assistance cycle dividend credited successfully',
    };

    setItems((prev) => [newActivity, ...prev]);
    setNewName('');
    setNewAmount('');
    setSaveNotice(`Added ${newActivity.personName} (₦${numAmt.toLocaleString()})!`);
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset to initial preset
  const handleResetToPreset = () => {
    setItems(INITIAL_LIVE_ASSISTANCE_ACTIVITIES);
    setSaveNotice('Restored standard agricultural peer activities list.');
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all display names and amounts?')) {
      setItems([]);
      setSaveNotice('All landing display names cleared.');
    }
  };

  // Save to parent & localStorage
  const handleSaveAndPublish = () => {
    onSaveActivities(items);
    setSaveNotice('Landing page movable names and amounts successfully updated and published!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Export current list to CSV
  const handleExportCSV = () => {
    if (items.length === 0) return;
    const header = 'Name,Amount,Type,Location,Sector,TimeAgo\n';
    const rows = items
      .map(
        (i) =>
          `"${i.personName}",${i.amount},"${i.type}","${i.location || ''}","${i.sectorOrCoop || ''}","${i.timeAgo}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `farmbase_landing_names_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderedCount = items.filter((i) => i.type === 'RENDERED').length;
  const gotCount = items.filter((i) => i.type === 'GOT').length;
  const totalAmount = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/60">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Landing Page Movable Names & Amounts Manager
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Admin Desk
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload custom names, amounts, and states for the public landing page live ticker (independent from registered user database).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-black border-b border-neutral-850 text-xs">
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Active Names on Display</span>
            <span className="text-lg font-black text-white font-mono">{items.length} records</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-emerald-400 text-[11px] block flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Newly Rendered
            </span>
            <span className="text-lg font-black text-emerald-300 font-mono">{renderedCount} items</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-amber-400 text-[11px] block flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Got Assistance
            </span>
            <span className="text-lg font-black text-amber-300 font-mono">{gotCount} items</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Total Stream Capital</span>
            <span className="text-lg font-black text-white font-mono">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Notification Toast */}
        {saveNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveNotice}</span>
            </div>
            <button
              onClick={() => setSaveNotice(null)}
              className="text-emerald-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-neutral-850">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Bulk Upload & Paste</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Name</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'manage'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>View & Edit List ({items.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: BULK UPLOAD & PASTE */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* File upload drag drop zone */}
              <div className="p-6 rounded-2xl bg-black border-2 border-dashed border-neutral-700 hover:border-emerald-500 transition text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-emerald-400 mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Upload CSV, TXT, or JSON File</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Upload a file containing names and amounts to automatically feed into the landing ticker.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="feed-file-upload"
                />

                <label
                  htmlFor="feed-file-upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose File from Computer</span>
                </label>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300">
                    Or Paste Names & Amounts Directly:
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Format: Name, Amount, Type (Rendered/Got), Location, Purpose
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={pasteText}
                  onChange={(e) => {
                    setPasteText(e.target.value);
                    setParseError(null);
                  }}
                  placeholder={`Mallam Kabir Bello, ₦250,000, Rendered, Sokoto, Wheat Irrigation Cluster\nMrs. Folashade Adeleke, ₦450,000, Got, Benue, Soybean Processing Hub\nAlhaji Sani Zaria, ₦500,000, Rendered, Kaduna, Hybrid Maize Seeds\nChidi Okonjo, ₦180,000, Got, Enugu, Cassava Starch Depot\nDr. Fola Awolowo, ₦300,000, Rendered, Ogun, Tractor Mechanization`}
                  className="w-full p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono transition leading-relaxed"
                />

                {parseError && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{parseError}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAppendPasted}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Append to Current List</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReplaceWithPasted}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replace Entire List</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPasteText(
                        `Alhaji Musa Danbaba, 350000, Rendered, Kano, Sesame Harvest\nMrs. Ngozi Ekwueme, 280000, Got, Anambra, Rice Cluster Dividend\nEngr. Babatunde Jinadu, 600000, Rendered, Oyo, Greenhouse Irrigation\nHajia Fatima Yusuf, 420000, Got, Kebbi, Wheat Processing Payout\nChief Raymond Clark, 750000, Rendered, Delta, Palm Oil Mill Support`
                      );
                    }}
                    className="text-xs text-neutral-400 hover:text-emerald-400 underline cursor-pointer"
                  >
                    Insert Demo Format Lines
                  </button>
                </div>
              </div>

              {/* Format Guide */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-1.5">
                <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Supported Formats & Tips:
                </span>
                <p>
                  • <strong>Simple mode:</strong> Just enter <code>Name, Amount</code> (e.g., <code>Mallam Sani, 250000</code>). The system will automatically format it with appropriate states and alternating Rendered/Got assistance.
                </p>
                <p>
                  • <strong>Full mode:</strong> <code>Name, Amount, Type (Rendered or Got), State, Farming Sector</code>.
                </p>
                <p>
                  • Currency signs (₦, commas) are automatically cleaned and formatted.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ADD SINGLE ENTRY */}
          {activeTab === 'manual' && (
            <form onSubmit={handleAddSingleEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Member / Participant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alhaji Shehu Danladi"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Assistance Amount (₦) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 250,000"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Activity Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'RENDERED' | 'GOT')}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RENDERED">RENDERED ASSISTANCE (Offering Support)</option>
                    <option value="GOT">GOT ASSISTANCE (Received Payout)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    State / Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Kaduna, Benue, Sokoto, Ogun"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Agricultural Sector / Purpose
                  </label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    placeholder="e.g. Mechanized Rice Milling Hub"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Time Ago Display Tag
                  </label>
                  <input
                    type="text"
                    value={newTimeAgo}
                    onChange={(e) => setNewTimeAgo(e.target.value)}
                    placeholder="e.g. Just now, 12m ago, 45m ago"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Movable Feed List</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MANAGE CURRENT DISPLAY LIST */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800">
                <span className="text-xs text-neutral-400">
                  Showing <strong>{items.length}</strong> items configured to appear on the landing page ticker:
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Export list as CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToPreset}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Reset to default seed list"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reset to Preset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-red-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Clear entire display stream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                  <p className="text-sm text-neutral-400 font-semibold">
                    No display names are currently in the movable list.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Upload a file, paste lines, or click below to restore sample names.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetToPreset}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Load Default Agricultural Seed List
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {items.map((item, idx) => {
                    const isRender = item.type === 'RENDERED';
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                          isRender
                            ? 'bg-[#061209] border-emerald-900/70 hover:border-emerald-600'
                            : 'bg-[#150d03] border-amber-900/70 hover:border-amber-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                              isRender
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-700/60'
                                : 'bg-amber-950 text-amber-400 border-amber-700/60'
                            }`}
                          >
                            {isRender ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-white truncate max-w-[130px] sm:max-w-[170px]">
                                {item.personName}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                  isRender
                                    ? 'bg-emerald-950 text-emerald-300'
                                    : 'bg-amber-950 text-amber-300'
                                }`}
                              >
                                {isRender ? 'RENDERED' : 'GOT'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                              <span
                                className={`font-mono font-bold ${
                                  isRender ? 'text-emerald-400' : 'text-amber-400'
                                }`}
                              >
                                ₦{item.amount.toLocaleString()}
                              </span>
                              {item.location && (
                                <span className="text-neutral-400 text-[10px] flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {item.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition shrink-0 cursor-pointer"
                          title="Delete this entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-t border-neutral-800">
          <div className="text-xs text-neutral-400">
            <span>Changes will apply directly to the landing page live movable feed.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndPublish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-950/80 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish to Landing Page</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
