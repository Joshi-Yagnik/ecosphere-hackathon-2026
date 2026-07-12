

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Left Panel - Branding/Illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-[#2f655d] to-[#1c384e] p-16 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-[32px] font-bold mb-4">EcoSphere</h1>
          <p className="text-[17px] leading-relaxed text-white/90 max-w-sm">
            The modular ESG Management Platform. Track, gamify, and report on your organization's sustainability goals.
          </p>
        </div>
        
        {/* Decorative elements or illustration */}
        <div className="relative z-10 w-full max-w-sm mx-auto mt-4 aspect-square flex items-center justify-center">
          {/* 3D Glass Sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_4px_14px_rgba(255,255,255,0.4),inset_0_-10px_20px_rgba(0,0,0,0.2)] border border-white/20 z-20"></div>
          
          {/* Inner ring */}
          <div className="w-[85%] aspect-square rounded-full border border-white/30 border-dashed absolute z-20"></div>
        </div>
        
        <div className="relative z-10 mt-auto text-sm text-white/80">
          © {new Date().getFullYear()} EcoSphere. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#fafafa]">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#1e3a5f]">EcoSphere</h1>
          </div>
          
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-bold text-[#0f172a]">{title}</h2>
            <p className="mt-2 text-[15px] text-slate-500">{subtitle}</p>
          </div>

          <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-xl border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
