/**
 * QR Code Generation Utilities for STTIS
 * Generates QR codes for batch traceability
 */

import QRCode from 'qrcode';

export interface QRCodeData {
  batch_id: string;
  batch_number: string;
  product_name: string;
  quantity_kg: number;
  production_date: string;
  origin: string;
  qr_version: string;
}

/**
 * Generate QR code data URL for a batch
 * QR code encodes a URL to the batch traceability page
 */
export async function generateBatchQRCode(
  batchId: string,
  batchNumber: string
): Promise<string> {
  try {
    // Create URL that will be encoded in QR code
    // This would typically be: https://sttis.app/trace/[batchId]
    const traceUrl = `${process.env.NEXT_PUBLIC_STTIS_URL || 'https://sttis.app'}/trace/${batchId}`;

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#10b981', // Emerald green
        light: '#f8f8f8',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('[STTIS] Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code canvas element
 */
export async function generateQRCodeCanvas(
  batchId: string
): Promise<HTMLCanvasElement> {
  try {
    const traceUrl = `${process.env.NEXT_PUBLIC_STTIS_URL || 'https://sttis.app'}/trace/${batchId}`;
    const canvas = document.createElement('canvas');
    
    await QRCode.toCanvas(canvas, traceUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#10b981',
        light: '#f8f8f8',
      },
    });

    return canvas;
  } catch (error) {
    console.error('[STTIS] Error generating QR canvas:', error);
    throw error;
  }
}

/**
 * Generate printable QR code (with batch info)
 */
export async function generatePrintableQRCode(data: QRCodeData): Promise<string> {
  try {
    const traceUrl = `${process.env.NEXT_PUBLIC_STTIS_URL || 'https://sttis.app'}/trace/${data.batch_id}`;

    const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      width: 400,
      color: {
        dark: '#10b981',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('[STTIS] Error generating printable QR:', error);
    throw error;
  }
}

/**
 * Download QR code as image
 */
export async function downloadQRCode(
  batchId: string,
  batchNumber: string
): Promise<void> {
  try {
    const dataUrl = await generateBatchQRCode(batchId, batchNumber);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `STTIS-QR-${batchNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('[STTIS] Error downloading QR code:', error);
    throw error;
  }
}

/**
 * Print QR code label
 */
export function printQRCodeLabel(
  dataUrl: string,
  batchNumber: string
): void {
  try {
    const printWindow = window.open('', '', 'height=400,width=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>STTIS QR Code - ${batchNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .label { text-align: center; padding: 20px; }
            .qr-image { max-width: 300px; margin: 20px 0; }
            .batch-info { margin-top: 20px; font-size: 14px; }
            @media print {
              body { margin: 0; }
              .label { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <h2>STTIS Tea Batch</h2>
            <img src="${dataUrl}" alt="QR Code" class="qr-image" />
            <div class="batch-info">
              <p><strong>Batch Number:</strong> ${batchNumber}</p>
              <p>Scan to view complete traceability</p>
              <p style="font-size: 12px; color: #666;">
                Powered by STTIS - Smart Tea Traceability
              </p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  } catch (error) {
    console.error('[STTIS] Error printing QR code:', error);
  }
}
