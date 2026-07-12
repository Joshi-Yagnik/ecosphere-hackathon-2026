

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding/Illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-brand-primary to-brand-accent p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">EcoSphere</h1>
          <p className="text-lg opacity-90 max-w-md">
            The modular ESG Management Platform. Track, gamify, and report on your organization's sustainability goals.
          </p>
        </div>
        
        {/* Decorative elements or illustration */}
        <div className="relative z-10 w-full max-w-sm mx-auto mt-12 aspect-square flex items-center justify-center">
          {/* 3D Glass Sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-accent/60 via-white/20 to-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,0.7),inset_0_-15px_30px_rgba(0,0,0,0.4)] border border-white/30 z-20"></div>
          
          {/* Inner glowing core */}
          <div className="w-1/2 aspect-square rounded-full bg-brand-primary/80 blur-3xl absolute z-10 animate-pulse"></div>
          
          {/* Rotating abstract ring */}
          <div className="w-[85%] aspect-square rounded-full border-2 border-white/40 border-dashed animate-[spin_15s_linear_infinite] absolute z-20"></div>
        </div>
        
        <div className="relative z-10 mt-auto text-sm opacity-80">
          © {new Date().getFullYear()} EcoSphere. All rights reserved.
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-brand-primary">EcoSphere</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{subtitle}</p>
          </div>

          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
