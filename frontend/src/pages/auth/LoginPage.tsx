import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' 
        ? detail 
        : err.message || 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
    }
  };

  const handleDemoLogin = (email: string) => {
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', 'Password123!', { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid-pattern relative">
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border border-slate-800 shadow-2xl p-8 backdrop-blur-2xl bg-slate-950/85">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500 border border-blue-500/40 shadow-cyber-glow mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Welcome to <span className="cyber-gradient-text">AntiHack</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Enterprise Cyber Threat Prevention & Fraud Detection Platform
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-950/50 border border-red-800/80 p-3.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@antihack.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Sign In to Security Hub
            </Button>
          </form>

          {/* Quick Demo Login Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Demo Auto-Fill
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleDemoLogin('user@antihack.com')}
                className="px-3 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                User Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@antihack.com')}
                className="px-3 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-teal-500/50 hover:text-teal-400 transition-all"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Create AntiHack Account
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
