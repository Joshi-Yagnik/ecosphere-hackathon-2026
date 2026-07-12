import { useState, useEffect } from 'react';

export type PasswordStrength = {
  score: number; // 0 to 4
  label: string;
  color: string;
};

export function usePasswordStrength(password: string): PasswordStrength {
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: 'Weak', color: 'bg-red-500' });

  useEffect(() => {
    let score = 0;
    
    if (!password) {
      setStrength({ score: 0, label: 'None', color: 'bg-slate-200' });
      return;
    }

    if (password.length > 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;

    let label = 'Weak';
    let color = 'bg-red-500';

    if (score === 2) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-500';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-green-500';
    }

    setStrength({ score, label, color });
  }, [password]);

  return strength;
}
