const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/features/auth/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix path to components
  content = content.replace(/\.\.\/\.\.\/components\/ui/g, '../../../components/ui');
  // Fix path to lib/utils in AuthLayout
  content = content.replace(/\.\.\/lib\/utils/g, '../../../lib/utils');
  // Fix lib/supabase in SessionManager
  content = content.replace(/\.\.\/\.\.\/lib\/supabase/g, '../../../lib/supabase');
  
  fs.writeFileSync(filePath, content);
}

// Fix LoginForm
const loginFormPath = path.join(dir, 'LoginForm.tsx');
let loginForm = fs.readFileSync(loginFormPath, 'utf8');
loginForm = loginForm.replace('import { Eye, EyeOff, Github, Mail } from "lucide-react";', 'import { Eye, EyeOff, Mail } from "lucide-react";');
loginForm = loginForm.replace('rememberMe: z.boolean().default(false),', 'rememberMe: z.boolean().optional().default(false),');
fs.writeFileSync(loginFormPath, loginForm);

// Fix SignupForm
const signupFormPath = path.join(dir, 'SignupForm.tsx');
let signupForm = fs.readFileSync(signupFormPath, 'utf8');
signupForm = signupForm.replace(
  'termsAccepted: z.literal(true, {\n    errorMap: () => ({ message: "You must accept the terms and conditions" })\n  }),',
  'termsAccepted: z.boolean().refine(val => val === true, {\n    message: "You must accept the terms and conditions"\n  }),'
);
fs.writeFileSync(signupFormPath, signupForm);

// Fix OtpVerification
const otpPath = path.join(dir, 'OtpVerification.tsx');
let otpForm = fs.readFileSync(otpPath, 'utf8');
otpForm = otpForm.replace('import { Button } from "../../../components/ui/button";', 'import { Button } from "../../../components/ui/button";\nimport { Label } from "../../../components/ui/label";');
fs.writeFileSync(otpPath, otpForm);

// Fix AuthProvider
const authProviderPath = path.join(__dirname, 'src/features/auth/AuthProvider.tsx');
let authProvider = fs.readFileSync(authProviderPath, 'utf8');
authProvider = authProvider.replace('import { Session, User } from "@supabase/supabase-js";', 'import type { Session, User } from "@supabase/supabase-js";');
fs.writeFileSync(authProviderPath, authProvider);

// Fix Button
const buttonPath = path.join(__dirname, 'src/components/ui/button.tsx');
let button = fs.readFileSync(buttonPath, 'utf8');
button = button.replace('import { motion, HTMLMotionProps } from "framer-motion"', 'import { motion } from "framer-motion"');
fs.writeFileSync(buttonPath, button);

console.log('Fixed imports and types');
