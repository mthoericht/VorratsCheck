import React from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Package, ListChecks, Heart, TrendingDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export function Dashboard() 
{
  const inventory = useInventoryStore((s) => s.items);
  const mustHaveList = useMustHaveStore((s) => s.items);
  const wishList = useWishlistStore((s) => s.items);

  // Calculate expiring soon items (within 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const expiringSoon = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= sevenDaysFromNow && expiryDate >= today;
  });

  const expired = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate < today;
  });

  // Mock low stock items based on must-have list
  const lowStockItems = mustHaveList.filter((mustHave) => 
  {
    const inventoryItems = inventory.filter((item) =>
      item.name.toLowerCase().includes(mustHave.name.toLowerCase())
    );
    const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity < mustHave.minQuantity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Übersicht über Ihren Vorrat</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Artikel</CardTitle>
            <Package className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-gray-600 mt-1">Im Vorrat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Läuft bald ab</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringSoon.length}</div>
            <p className="text-xs text-gray-600 mt-1">Nächste 7 Tage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Niedrige Bestände</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-gray-600 mt-1">Nachkaufen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wunschliste</CardTitle>
            <Heart className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishList.length}</div>
            <p className="text-xs text-gray-600 mt-1">Artikel</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expired Items */}
        {expired.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="w-5 h-5" />
                Abgelaufene Artikel
              </CardTitle>
              <CardDescription>Diese Artikel sind bereits abgelaufen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expired.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Abgelaufen: {item.expiryDate}</p>
                    </div>
                    <Badge variant="destructive">Abgelaufen</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expiring Soon */}
        {expiringSoon.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertTriangle className="w-5 h-5" />
                Läuft bald ab
              </CardTitle>
              <CardDescription>Bitte bald verbrauchen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiringSoon.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">MHD: {item.expiryDate}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-600 text-orange-600">
                      Bald fällig
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Stock */}
        {lowStockItems.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <ListChecks className="w-5 h-5" />
                Niedriger Bestand
              </CardTitle>
              <CardDescription>Diese Must-Have Artikel sollten nachgekauft werden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Min. Menge: {item.minQuantity}</p>
                    </div>
                    <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                      Nachkaufen
                    </Badge>
                  </div>
                ))}
              </div>
              <Link to="/must-have">
                <Button variant="outline" className="w-full mt-4">
                  Zur Must-Have Liste
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
          <CardDescription>Häufig verwendete Funktionen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/inventory">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="w-4 h-4" />
                Artikel hinzufügen
              </Button>
            </Link>
            <Link to="/recipes">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ListChecks className="w-4 h-4" />
                Rezepte finden
              </Button>
            </Link>
            <Link to="/deals">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Heart className="w-4 h-4" />
                Angebote ansehen
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
