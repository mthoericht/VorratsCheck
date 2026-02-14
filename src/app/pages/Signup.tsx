import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Package, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export function Signup() 
{
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
      setError('Username muss mindestens 3 Zeichen lang sein');
      return;
    }

    if (password.length < 6) 
    {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    if (password !== confirmPassword) 
    {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (!inviteCode) 
    {
      setError('Bitte geben Sie das Einladungspasswort ein');
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
      setError(result.error || 'Registrierung fehlgeschlagen');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">VorratsCheck</CardTitle>
          <CardDescription>Erstellen Sie Ihr Konto</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-sm">
              Registrierung erfolgt über das Express-Backend.
            </AlertDescription>
          </Alert>

          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Einladungspasswort: <strong>VORRATSCHECK2026</strong>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="ihr_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
              <p className="text-xs text-gray-500">Mindestens 3 Zeichen</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500">Mindestens 6 Zeichen</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
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
              <Label htmlFor="inviteCode">Einladungspasswort</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Einladungspasswort eingeben"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Erforderlich für die Registrierung</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Wird registriert...' : 'Registrieren'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Bereits ein Konto? </span>
              <Link to="/login" className="text-emerald-600 hover:underline">
                Jetzt anmelden
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
