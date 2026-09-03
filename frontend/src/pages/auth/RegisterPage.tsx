import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User as UserIcon, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordVal = watch('password', '');

  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(passwordVal);

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerAuth({
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || 'Registration failed. Please check your information.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid-pattern relative">
      <div className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10 my-8"
      >
        <Card className="border border-slate-800 shadow-2xl p-8 backdrop-blur-2xl bg-slate-950/85">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-accent-glow mb-4">
              <ShieldCheck className="h-8 w-8 text-teal-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Create Your Shield Account
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Join AntiHack to detect scams, scan links & report cybercrime
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-950/50 border border-red-800/80 p-3.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alexander Pierce"
              leftIcon={<UserIcon className="h-4 w-4" />}
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alexander@domain.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 019-2834"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone_number?.message}
              {...register('phone_number')}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Password Strength Indicator */}
              {passwordVal && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-200">
                      {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 25
                          ? 'bg-red-500'
                          : strength <= 50
                          ? 'bg-yellow-500'
                          : strength <= 75
                          ? 'bg-blue-500'
                          : 'bg-teal-400'
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Initialize AntiHack Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
