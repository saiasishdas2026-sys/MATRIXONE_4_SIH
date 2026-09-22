import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Search, ArrowRight } from 'lucide-react';
import { DataUploader } from '../components/upload/DataUploader';
import { ProgressTracker } from '../components/upload/ProgressTracker';
import { useMaterialStore } from '../store/materialStore';

export const DataIngestion = () => {
  const { rawMaterials } = useMaterialStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCPSE, setSelectedCPSE] = useState('ALL');

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchesSearch = m.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCPSE = selectedCPSE === 'ALL' || m.cpse === selectedCPSE;
    return matchesSearch && matchesCPSE;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-wide">
            CPSE ERP DATA INGESTION &amp; FEDERATION HUB
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Ingest, normalize and tokenize raw material catalogs from SAP S/4HANA, Oracle EBS, and legacy CPSE ERPs
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs shrink-0">
          <span className="px-3 py-1.5 rounded-md bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/25 font-semibold">
            Ingestion SLA: 1,850 rec/sec
          </span>
        </div>
      </div>

      {/* Top Grid: Uploader + Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DataUploader />
        </div>
        <div className="lg:col-span-5">
          <ProgressTracker />
        </div>
      </div>

      {/* Raw Materials Catalog Explorer */}
      <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-seam-border gap-3">
          <div className="flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-telemetry-cyan" />
            <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
              RAW MATERIAL CATALOG EXPLORER (NORMALIZED TOKEN REGISTRY)
            </h4>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raw codes or descriptions..."
                className="bg-surface-subtle border border-seam-border rounded-md pl-8 pr-3 py-1.5 text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-telemetry-cyan w-56 font-sans shadow-xs"
              />
            </div>

            {/* CPSE Filter */}
            <select
              value={selectedCPSE}
              onChange={(e) => setSelectedCPSE(e.target.value)}
              className="bg-surface-subtle border border-seam-border rounded-md px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-telemetry-cyan shadow-xs"
            >
              <option value="ALL">All CPSEs</option>
              <option value="CPCL">CPCL</option>
              <option value="ONGC">ONGC</option>
              <option value="NTPC">NTPC</option>
              <option value="SAIL">SAIL</option>
              <option value="IOCL">IOCL</option>
              <option value="GAIL">GAIL</option>
              <option value="BHEL">BHEL</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-seam-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle text-ink-secondary text-[11px] border-b border-seam-border">
                <th className="p-3 font-semibold">CPSE</th>
                <th className="p-3 font-semibold">ERP Item Code</th>
                <th className="p-3 font-semibold">Raw Legacy Description</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">UoM</th>
                <th className="p-3 font-semibold">Unit Price</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-seam-border text-[11px]">
              {filteredMaterials.map((item) => (
                <tr key={item.id} className="hover:bg-surface-subtle transition">
                  <td className="p-3 font-bold text-telemetry-cyan">{item.cpse}</td>
                  <td className="p-3 text-ink-primary font-semibold">{item.code}</td>
                  <td className="p-3 text-ink-secondary truncate max-w-xs">{item.desc}</td>
                  <td className="p-3 text-ink-muted">{item.category}</td>
                  <td className="p-3 text-ink-primary font-medium">{item.uom}</td>
                  <td className="p-3 text-ink-primary font-medium">₹{item.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                      item.status === 'MATCHED'
                        ? 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25'
                        : 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to="/matching"
                      className="inline-flex items-center space-x-1 text-telemetry-cyan hover:underline font-semibold"
                    >
                      <span>Match AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataIngestion;
