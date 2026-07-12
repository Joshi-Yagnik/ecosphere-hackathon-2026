'use client';
export default function Page() {
  return (
    <div className="animate-fade-in">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title">Categories</h1>
          <p className="eco-page-subtitle">Full implementation arriving in Phase 8.</p>
        </div>
      </div>
      <div className="eco-card p-12 flex flex-col items-center justify-center text-center mt-4">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Categories</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Data tables, forms, search, filters and full CRUD arrive in Phase 8.
        </p>
      </div>
    </div>
  );
}
