import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from './ui/button';
import { X, Camera } from 'lucide-react';
import { Card } from './ui/card';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) 
{
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => 
  {
    return () => 
    {
      if (scannerRef.current) 
      {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => 
  {
    try 
    {
      setError(null);
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => 
        {
          scanner.stop();
          setIsScanning(false);
          onScan(decodedText);
        },
        (errorMessage) => 
        {
          // Ignore scanning errors during normal operation
        }
      );

      setIsScanning(true);
    }
    catch (err) 
    {
      setError('Kamera konnte nicht gestartet werden. Bitte überprüfen Sie die Berechtigungen.');
      console.error('Error starting scanner:', err);
    }
  };

  const stopScanning = () => 
  {
    if (scannerRef.current) 
    {
      scannerRef.current.stop().then(() => 
      {
        setIsScanning(false);
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => 
            {
              stopScanning();
              onClose();
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div id="barcode-reader" className="w-full rounded-lg overflow-hidden bg-gray-100" />

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
