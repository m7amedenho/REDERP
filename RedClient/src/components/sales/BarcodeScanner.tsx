"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconCamera, IconX, IconRefresh } from "@tabler/icons-react";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("لا يمكن الوصول إلى الكاميرا. تأكد من السماح بالوصول إليها.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Handle barcode detection using ZXing library
  // Note: In production, you would use a library like @zxing/browser or quagga2
  const detectBarcode = () => {
    // This is a placeholder for barcode detection
    // In a real implementation, you would use a library like:
    // - @zxing/browser
    // - quagga2
    // - react-barcode-reader

    // For now, we'll use a manual input approach
    console.log("Barcode detection would happen here");
  };

  // Cleanup on unmount or when dialog closes
  useEffect(() => {
    if (!open) {
      stopCamera();
      setScannedCode("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualInput = (code: string) => {
    setScannedCode(code);
  };

  const handleConfirm = () => {
    if (scannedCode.trim()) {
      onScan(scannedCode.trim());
      setScannedCode("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconCamera className="h-5 w-5" />
            مسح الباركود
          </DialogTitle>
          <DialogDescription>
            استخدم الكاميرا لمسح الباركود أو أدخل الرمز يدوياً
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {!scanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startCamera} size="lg">
                  <IconCamera className="ml-2 h-5 w-5" />
                  تشغيل الكاميرا
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Scanning Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-32">
                    {/* Scanning frame corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>

                    {/* Scanning line animation */}
                    <div className="absolute inset-x-0 h-0.5 bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Stop Camera Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={stopCamera}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              أو أدخل الباركود يدوياً
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => handleManualInput(e.target.value)}
                placeholder="أدخل رمز الباركود..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirm();
                  }
                }}
              />
              {scannedCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScannedCode("")}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
            <p className="font-medium">تعليمات الاستخدام:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>وجه الكاميرا نحو الباركود</li>
              <li>تأكد من وضوح الإضاءة</li>
              <li>احتفظ بالكاميرا مستقرة</li>
              <li>يمكنك الإدخال اليدوي في حالة عدم نجاح المسح</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleConfirm} disabled={!scannedCode.trim()}>
            تأكيد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Note for implementation:
// To use actual barcode scanning, install one of these libraries:
// 1. npm install @zxing/browser
// 2. npm install quagga2
// 3. npm install react-barcode-reader

// Example with @zxing/browser:
/*
import { BrowserMultiFormatReader } from '@zxing/browser';

const codeReader = new BrowserMultiFormatReader();

const startScanning = async () => {
  try {
    const result = await codeReader.decodeFromVideoDevice(
      undefined, // Use default camera
      videoRef.current,
      (result, err) => {
        if (result) {
          setScannedCode(result.getText());
          onScan(result.getText());
          stopCamera();
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
};
*/
