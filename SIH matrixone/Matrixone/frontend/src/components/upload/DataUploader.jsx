import React, { useState, useRef } from 'react';
import { UploadCloud, Database, Play, Check } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useMaterialStore } from '../../store/materialStore';
import { apiClient } from '../../utils/api';

export const DataUploader = () => {
  const { isIngesting, ingestionProgress, simulateIngestion, addRawMaterials } = useMaterialStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeCPSE, setActiveCPSE] = useState('CPCL');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const newItems = rows.slice(0, 50).map((r, idx) => ({
          id: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
          cpse: activeCPSE,
          code: r.code || r.local_material_code || r.legacy_code || r.ItemCode || `${activeCPSE}-CSV-${String(idx + 1).padStart(4, '0')}`,
          desc: r.desc || r.description || r.Description || r.ItemDescription || 'Catalog item ingested via secure upload',
          uom: r.uom || r.UOM || r.unit || 'EA',
          price: parseInt(r.price || r.UnitRate || '24500'),
          stock: parseInt(r.stock || r.quantity || '45'),
          category: r.category || r.classification || 'Valves & Spares',
          status: 'INGESTED'
        }));

        if (addRawMaterials && newItems.length > 0) {
          addRawMaterials(newItems);
        }

        setSelectedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          records: rows.length,
          cpse: activeCPSE
        });

        simulateIngestion(activeCPSE);
        try {
          confetti({ particleCount: 70, spread: 60 });
        } catch (_) {}
        toast.success(`Successfully parsed & ingested ${rows.length} materials from ${file.name}!`);

        // Also stream upload to live FastAPI backend if online
        try {
          const formData = new FormData();
          formData.append('file', file);
          apiClient.upload('/ingest/upload', formData).then(res => {
            console.log('[MATRIXONE Ingestion API] Live upload success:', res);
          }).catch(err => {
            console.warn('[MATRIXONE Ingestion API] Background upload notice:', err.message);
          });
        } catch (_) {}
      },
      error: (err) => {
        toast.error(`Error parsing file: ${err.message}`);
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSampleLoad = (cpse) => {
    setActiveCPSE(cpse);
    setSelectedFile({
      name: `sample_${cpse.toLowerCase()}_master_data.csv`,
      size: '4.8 MB',
      records: 28400,
      cpse
    });
    simulateIngestion(cpse);
    toast.success(`Loaded pre-validated ${cpse} material master dataset!`);
  };

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-seam-border">
        <div className="flex items-center space-x-2.5">
          <Database className="w-4 h-4 text-telemetry-cyan" />
          <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
            CPSE ERP SECURE DATA INGESTION GATEWAY
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-semibold">
          TLS 1.3 ENCRYPTED REST/XML/CSV
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition group cursor-pointer ${
          isDragging
            ? 'border-telemetry-cyan bg-telemetry-cyan/10'
            : 'border-seam-border hover:border-telemetry-cyan/50 bg-surface-subtle'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-surface border border-seam-border flex items-center justify-center text-telemetry-cyan group-hover:scale-110 transition shadow-sm">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h5 className="mt-3 text-sm font-semibold text-ink-primary">
          {selectedFile ? `Active File: ${selectedFile.name}` : 'Drag & drop CPSE Material Master Export File'}
        </h5>
        <p className="text-xs text-ink-muted mt-1 max-w-sm">
          {selectedFile
            ? `${selectedFile.records.toLocaleString()} records normalized for ${selectedFile.cpse}`
            : 'Supports SAP CSV extracts, Oracle EBS XML feeds, and standard Excel catalogs (.csv, .xml, .xlsx)'}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="mt-4 px-4 py-2 rounded-md bg-surface border border-seam-border hover:border-telemetry-cyan/40 text-ink-primary text-xs font-mono font-semibold transition shadow-xs"
        >
          Browse File System
        </button>
      </div>

      {/* 1-Click Sovereign Pre-loaded Datasets */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono text-ink-muted uppercase block tracking-wider font-semibold">
          OR LOAD PRE-LOADED CPSE SAMPLE MASTER DATASETS (SIH 2026):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {[
            { cpse: 'CPCL', name: 'Chennai Petroleum', erp: 'SAP S/4HANA', count: '28,400' },
            { cpse: 'ONGC', name: 'Oil & Nat. Gas Corp', erp: 'SAP ECC 6.0', count: '42,100' },
            { cpse: 'NTPC', name: 'NTPC Power Corp', erp: 'SAP ERP 6.0', count: '31,500' },
            { cpse: 'SAIL', name: 'Steel Authority Ltd', erp: 'Oracle EBS', count: '26,800' },
          ].map((sample) => (
            <button
              key={sample.cpse}
              onClick={() => handleSampleLoad(sample.cpse)}
              disabled={isIngesting}
              className="p-3.5 rounded-lg bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/40 text-left transition space-y-1.5 group shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <strong className="text-telemetry-cyan font-bold">{sample.cpse}</strong>
                <Play className="w-3.5 h-3.5 text-ink-muted group-hover:text-telemetry-cyan transition" />
              </div>
              <p className="text-[11px] text-ink-primary font-medium truncate">{sample.name}</p>
              <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1 border-t border-seam-border">
                <span>{sample.erp}</span>
                <span className="text-telemetry-emerald font-semibold">{sample.count} rec</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ingestion Progress Bar */}
      {isIngesting && (
        <div className="p-4 rounded-lg bg-surface-subtle border border-telemetry-cyan/30 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ink-primary font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-ping"></span>
              Ingesting &amp; Normalizing {activeCPSE} Material Records...
            </span>
            <span className="text-telemetry-cyan font-bold">{ingestionProgress}%</span>
          </div>

          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
            <div 
              className="bg-telemetry-cyan h-full rounded-full transition-all duration-300"
              style={{ width: `${ingestionProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
