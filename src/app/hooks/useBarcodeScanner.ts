import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useTranslation } from '../lib/i18n';

const BARCODE_READER_ID = 'barcode-reader';

export interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  /** If true, start the camera automatically when the hook mounts. Default true. */
  autoStart?: boolean;
  /** Called after scanning has stopped when closing the scanner (e.g. to unmount the modal). */
  onClose?: () => void;
}

export function useBarcodeScanner({ onScan, autoStart = true, onClose }: UseBarcodeScannerOptions)
{
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanning = () =>
  {
    const scanner = scannerRef.current;
    if (!scanner) return Promise.resolve();
    scannerRef.current = null;
    return scanner.stop().then(() => setIsScanning(false)).catch(() =>
    {
      setIsScanning(false);
    });
  };

  const startScanning = async () =>
  {
    try
    {
      setError(null);
      const scanner = new Html5Qrcode(BARCODE_READER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
          disableFlip: false,
        },
        (decodedText) =>
        {
          setIsScanning(false);
          onScan(decodedText);
        },
        () =>
        {
          // Ignore scanning errors during normal operation
        }
      );

      setIsScanning(true);
    }
    catch (err)
    {
      setError(t('barcode.cameraError'));
      console.error('Error starting scanner:', err);
    }
  };

  useEffect(() =>
  {
    if (autoStart) startScanning();
    return () =>
    {
      const scanner = scannerRef.current;
      if (scanner)
      {
        scannerRef.current = null;
        scanner.stop().catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const close = () =>
  {
    stopScanning().then(() => onClose?.());
  };

  return {
    isScanning,
    error,
    startScanning,
    stopScanning,
    close,
    elementId: BARCODE_READER_ID,
  };
}
