import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Mail, Phone, Lock, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone_number: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Current password required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone_number: user?.phone_number || '',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    setProfileMsg(null);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      setProfileMsg('Profile details updated successfully.');
    } catch (err: any) {
      setProfileMsg('Failed to update profile.');
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setPasswordMsg(null);
    setPasswordErr(null);
    try {
      await api.post('/users/change-password', data);
      setPasswordMsg('Password changed successfully.');
      resetPasswordForm();
    } catch (err: any) {
      setPasswordErr(err.response?.data?.detail || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-400" /> Account Security & Profile Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your security preferences and user details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-100 pb-2 border-b border-slate-800">
            Personal Profile
          </h2>

          {profileMsg && (
            <div className="flex items-center gap-2 p-3 text-xs bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <Input
              label="Email Address (Read-only)"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Full Name"
              leftIcon={<UserIcon className="h-4 w-4" />}
              error={profileErrors.full_name?.message}
              {...regProfile('full_name')}
            />

            <Input
              label="Phone Number"
              leftIcon={<Phone className="h-4 w-4" />}
              error={profileErrors.phone_number?.message}
              {...regProfile('phone_number')}
            />

            <Button type="submit" variant="primary" size="md" isLoading={isProfileSubmitting}>
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-100 pb-2 border-b border-slate-800">
            Security & Password
          </h2>

          {passwordMsg && (
            <div className="flex items-center gap-2 p-3 text-xs bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordErr && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-xl">
              {passwordErr}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              leftIcon={<Lock className="h-4 w-4" />}
              error={passwordErrors.current_password?.message}
              {...regPassword('current_password')}
            />

            <Input
              label="New Password"
              type="password"
              leftIcon={<Lock className="h-4 w-4" />}
              error={passwordErrors.new_password?.message}
              {...regPassword('new_password')}
            />

            <Button type="submit" variant="accent" size="md" isLoading={isPasswordSubmitting}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
