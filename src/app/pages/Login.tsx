import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link as RouterLink } from 'react-router';
import { Box, Stack, Typography, Link as MuiLink } from '@mui/material';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Refrigerator, AlertCircle } from '@/app/lib/icons';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useTranslation } from '../lib/i18n';

export function Login() 
{
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) 
    {
      navigate('/');
    }
    else 
    {
      setError(result.error || t('auth.loginFailed'));
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
      <Box sx={{ width: '100%', maxWidth: 420 }}>
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
              <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
            </Stack>
          </CardHeader>
          <CardContent>
            <Stack component="form" onSubmit={handleSubmit} spacing={2}>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.loggingIn') : t('auth.login')}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                {t('auth.noAccount')}{' '}
                <MuiLink component={RouterLink} to="/signup" underline="hover">
                  {t('auth.registerNow')}
                </MuiLink>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
