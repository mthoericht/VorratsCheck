import { Button } from './ui/button';
import { X, Camera } from 'lucide-react';
import { Card } from './ui/card';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps)
{
  const { isScanning, error, startScanning, stopScanning, close, elementId } = useBarcodeScanner({
    onScan,
    onClose,
    autoStart: true,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          <Button variant="ghost" size="sm" onClick={close}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div id={elementId} className="w-full rounded-lg overflow-hidden bg-gray-100" />

          {!isScanning ? (
            <Button onClick={startScanning} className="w-full gap-2">
              <Camera className="w-4 h-4" />
              Kamera starten
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              Scanner stoppen
            </Button>
          )}

          <p className="text-sm text-gray-600 text-center">
            Halten Sie den Barcode in den markierten Bereich
          </p>
        </div>
      </Card>
    </div>
  );
}
