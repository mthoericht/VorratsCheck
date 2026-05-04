import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link as RouterLink } from 'react-router';
import { Box, Stack, Typography, Link as MuiLink } from '@mui/material';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Refrigerator, AlertCircle, Info } from '@/app/lib/icons';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useTranslation } from '../lib/i18n';

export function Signup() 
{
  const { t } = useTranslation();
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    setError('');

    // Validation
    if (username.length < 3) 
    {
      setError(t('auth.usernameMinError'));
      return;
    }

    if (password.length < 6) 
    {
      setError(t('auth.passwordMinError'));
      return;
    }

    if (password !== confirmPassword) 
    {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (!inviteCode) 
    {
      setError(t('auth.inviteCodeMissing'));
      return;
    }

    setIsLoading(true);

    const result = await signup(username, email, password, inviteCode);
    
    if (result.success) 
    {
      navigate('/');
    }
    else 
    {
      setError(result.error || t('auth.signupFailed'));
    }
    
    setIsLoading(false);
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08))'
            : 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(20,184,166,0.10))',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Card className="w-full">
          <CardHeader className="text-center">
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Refrigerator className="w-10 h-10" />
              </Box>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                VorratsCheck
              </Typography>
              <CardDescription>{t('auth.signupSubtitle')}</CardDescription>
            </Stack>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                {t('auth.signupInfo')}
              </AlertDescription>
            </Alert>

            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                {t('auth.inviteCodeHint')} <strong>VORRATSCHECK2026</strong>
              </AlertDescription>
            </Alert>

            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">{t('auth.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <p className="text-xs text-gray-500">{t('auth.usernameMin')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500">{t('auth.passwordMin')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteCode">{t('auth.inviteCode')}</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder={t('auth.inviteCodePlaceholder')}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">{t('auth.inviteCodeRequired')}</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.registering') : t('auth.register')}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                {t('auth.hasAccount')}{' '}
                <MuiLink component={RouterLink} to="/login" underline="hover">
                  {t('auth.loginNow')}
                </MuiLink>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
