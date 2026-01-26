/**
 * SecureSign Pro - PDF Engine
 *
 * Handles PDF document operations including:
 * - Loading and parsing PDF documents
 * - Embedding visible signatures
 * - Adding cryptographic signature metadata
 * - Creating tamper-evident documents
 *
 * Uses pdf-lib for PDF manipulation (pure JavaScript, no native dependencies)
 */

import { PDFDocument, PDFPage, StandardFonts, rgb, PDFImage } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import {
  SignaturePosition,
  SignatureDetails,
  VisibleSignatureOptions,
  DocumentInfo,
  DocumentMetadata,
  SecureSignError,
  ErrorCodes,
} from '../../shared/types';
import { hashFile } from '../crypto/crypto-engine';
import { generateId, generateVerificationId, getCurrentTimestamp, getCurrentTimezone } from '../../shared/utils';
import { SIGNATURE_CONFIG, FILE_LIMITS } from '../../shared/constants';

// ==================== Interfaces ====================

export interface LoadedPdf {
  document: PDFDocument;
  bytes: Uint8Array;
  hash: string;
  pageCount: number;
  metadata: DocumentMetadata;
  filePath: string;
  fileName: string;
  fileSize: number;
}

export interface SignatureEmbedOptions {
  position: SignaturePosition;
  details: SignatureDetails;
  signatureImage?: Buffer;  // PNG or JPEG image
  visualOptions: VisibleSignatureOptions;
  cryptoSignature: string;  // Base64 encoded digital signature
}

export interface EmbedResult {
  pdfBytes: Uint8Array;
  newHash: string;
  signatureIndex: number;
}

// ==================== PDF Engine Class ====================

export class PdfEngine {
  private loadedPdf: LoadedPdf | null = null;

  // ==================== Document Loading ====================

  /**
   * Load a PDF document from file path
   */
  async loadDocument(filePath: string): Promise<LoadedPdf> {
    if (!fs.existsSync(filePath)) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        `File not found: ${filePath}`
      );
    }

    const stats = fs.statSync(filePath);
    if (stats.size > FILE_LIMITS.MAX_PDF_SIZE_MB * 1024 * 1024) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_INVALID_FORMAT,
        `File too large. Maximum size: ${FILE_LIMITS.MAX_PDF_SIZE_MB}MB`
      );
    }

    try {
      const bytes = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(bytes);
      const hash = await hashFile(bytes);

      const pdfDoc = await PDFDocument.load(uint8Array, {
        ignoreEncryption: false,
      });

      const metadata = await this.extractMetadata(pdfDoc);

      this.loadedPdf = {
        document: pdfDoc,
        bytes: uint8Array,
        hash,
        pageCount: pdfDoc.getPageCount(),
        metadata,
        filePath,
        fileName: path.basename(filePath),
        fileSize: stats.size,
      };

      return this.loadedPdf;
    } catch (error) {
      if (error instanceof SecureSignError) {
        throw error;
      }
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_READ_ERROR,
        `Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load PDF from buffer
   */
  async loadFromBuffer(buffer: Buffer, fileName: string = 'document.pdf'): Promise<LoadedPdf> {
    try {
      const uint8Array = new Uint8Array(buffer);
      const hash = await hashFile(buffer);

      const pdfDoc = await PDFDocument.load(uint8Array);
      const metadata = await this.extractMetadata(pdfDoc);

      this.loadedPdf = {
        document: pdfDoc,
        bytes: uint8Array,
        hash,
        pageCount: pdfDoc.getPageCount(),
        metadata,
        filePath: '',
        fileName,
        fileSize: buffer.length,
      };

      return this.loadedPdf;
    } catch (error) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_READ_ERROR,
        `Failed to load PDF from buffer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get currently loaded PDF
   */
  getLoadedPdf(): LoadedPdf | null {
    return this.loadedPdf;
  }

  /**
   * Unload current PDF
   */
  unload(): void {
    this.loadedPdf = null;
  }

  // ==================== Document Info ====================

  /**
   * Get document information
   */
  async getDocumentInfo(filePath?: string): Promise<DocumentInfo> {
    const pdf = filePath ? await this.loadDocument(filePath) : this.loadedPdf;

    if (!pdf) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        'No document loaded'
      );
    }

    // Check for existing signatures
    const existingSignatures = await this.getExistingSignatures(pdf.document);

    return {
      id: generateId(),
      fileName: pdf.fileName,
      filePath: pdf.filePath,
      fileHash: pdf.hash,
      fileSize: pdf.fileSize,
      pageCount: pdf.pageCount,
      isSigned: existingSignatures.length > 0,
      signatureCount: existingSignatures.length,
      signatures: existingSignatures,
      metadata: pdf.metadata,
      firstOpened: new Date(),
      lastAccessed: new Date(),
    };
  }

  /**
   * Extract PDF metadata
   */
  private async extractMetadata(pdfDoc: PDFDocument): Promise<DocumentMetadata> {
    return {
      title: pdfDoc.getTitle() || undefined,
      author: pdfDoc.getAuthor() || undefined,
      subject: pdfDoc.getSubject() || undefined,
      creator: pdfDoc.getCreator() || undefined,
      producer: pdfDoc.getProducer() || undefined,
      creationDate: pdfDoc.getCreationDate() || undefined,
      modificationDate: pdfDoc.getModificationDate() || undefined,
    };
  }

  /**
   * Get page dimensions
   */
  getPageDimensions(pageNumber: number): { width: number; height: number } {
    if (!this.loadedPdf) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        'No document loaded'
      );
    }

    if (pageNumber < 1 || pageNumber > this.loadedPdf.pageCount) {
      throw new SecureSignError(
        ErrorCodes.INVALID_INPUT,
        `Invalid page number: ${pageNumber}`
      );
    }

    const page = this.loadedPdf.document.getPage(pageNumber - 1);
    const { width, height } = page.getSize();

    return { width, height };
  }

  // ==================== Signature Embedding ====================

  /**
   * Embed visible signature into PDF
   */
  async embedSignature(options: SignatureEmbedOptions): Promise<EmbedResult> {
    if (!this.loadedPdf) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        'No document loaded'
      );
    }

    try {
      const pdfDoc = this.loadedPdf.document;
      const page = pdfDoc.getPage(options.position.page - 1);

      // Draw visible signature
      await this.drawVisibleSignature(page, options);

      // Add signature metadata to PDF
      await this.addSignatureMetadata(pdfDoc, options);

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,  // Better compatibility
      });

      const newHash = await hashFile(Buffer.from(pdfBytes));

      return {
        pdfBytes,
        newHash,
        signatureIndex: await this.countSignatures(pdfDoc),
      };
    } catch (error) {
      if (error instanceof SecureSignError) {
        throw error;
      }
      throw new SecureSignError(
        ErrorCodes.SIGNATURE_FAILED,
        `Failed to embed signature: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Draw the visible signature appearance
   */
  private async drawVisibleSignature(
    page: PDFPage,
    options: SignatureEmbedOptions
  ): Promise<void> {
    const { position, details, signatureImage, visualOptions } = options;

    // Get fonts
    const helveticaFont = await page.doc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await page.doc.embedFont(StandardFonts.HelveticaBold);

    // Calculate positions
    const boxX = position.x;
    const boxY = page.getHeight() - position.y - position.height;  // PDF coordinates are bottom-up
    const boxWidth = position.width;
    const boxHeight = position.height;

    // Draw signature box background
    const bgColor = this.hexToRgb(visualOptions.backgroundColor || '#FFFFFF');
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(bgColor.r, bgColor.g, bgColor.b),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Draw signature image if provided
    let imageHeight = 0;
    if (signatureImage && visualOptions.showImage) {
      try {
        let image: PDFImage;

        // Detect image type and embed
        if (this.isPng(signatureImage)) {
          image = await page.doc.embedPng(signatureImage);
        } else {
          image = await page.doc.embedJpg(signatureImage);
        }

        // Scale image to fit
        const maxImageWidth = boxWidth - 20;
        const maxImageHeight = boxHeight * 0.4;
        const scaleFactor = Math.min(
          maxImageWidth / image.width,
          maxImageHeight / image.height
        );

        const scaledWidth = image.width * scaleFactor;
        const scaledHeight = image.height * scaleFactor;

        page.drawImage(image, {
          x: boxX + (boxWidth - scaledWidth) / 2,
          y: boxY + boxHeight - scaledHeight - 5,
          width: scaledWidth,
          height: scaledHeight,
        });

        imageHeight = scaledHeight + 10;
      } catch (e) {
        // Continue without image if embedding fails
        console.error('Failed to embed signature image:', e);
      }
    }

    // Draw text content
    const fontSize = visualOptions.fontSize || 8;
    const lineHeight = fontSize + 2;
    const textColor = this.hexToRgb(visualOptions.textColor || '#000000');
    let currentY = boxY + boxHeight - imageHeight - lineHeight - 5;

    // Signer name
    if (visualOptions.showSignerName) {
      page.drawText(`Digitally signed by: ${details.signerName}`, {
        x: boxX + 5,
        y: currentY,
        size: fontSize,
        font: helveticaBold,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      currentY -= lineHeight;
    }

    // Email
    if (visualOptions.showEmail && details.signerEmail) {
      page.drawText(`Email: ${details.signerEmail}`, {
        x: boxX + 5,
        y: currentY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      currentY -= lineHeight;
    }

    // Date
    if (visualOptions.showDate) {
      const dateStr = new Date(details.timestamp).toLocaleString();
      page.drawText(`Date: ${dateStr}`, {
        x: boxX + 5,
        y: currentY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      currentY -= lineHeight;
    }

    // Reason
    if (visualOptions.showReason && details.reason) {
      const reasonText = `Reason: ${details.reason}`;
      const truncatedReason = reasonText.length > 50
        ? reasonText.substring(0, 47) + '...'
        : reasonText;
      page.drawText(truncatedReason, {
        x: boxX + 5,
        y: currentY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(textColor.r, textColor.g, textColor.b),
      });
      currentY -= lineHeight;
    }

    // Verification ID
    if (visualOptions.showVerificationId) {
      page.drawText(`ID: ${details.verificationId}`, {
        x: boxX + 5,
        y: currentY,
        size: fontSize - 1,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  /**
   * Add signature metadata to PDF
   */
  private async addSignatureMetadata(
    pdfDoc: PDFDocument,
    options: SignatureEmbedOptions
  ): Promise<void> {
    const { details, cryptoSignature } = options;

    // Get existing custom metadata or create new
    const existingMetadata = this.getCustomMetadata(pdfDoc);
    const signatures = existingMetadata.secureSignatures || [];

    // Add new signature entry
    signatures.push({
      index: signatures.length + 1,
      verificationId: details.verificationId,
      signerName: details.signerName,
      signerEmail: details.signerEmail,
      signerId: details.signerId,
      reason: details.reason,
      location: details.location,
      timestamp: details.timestamp,
      timezone: details.timezone,
      algorithm: details.algorithm,
      certificateFingerprint: details.certificateFingerprint,
      signature: cryptoSignature,
      isTimestamped: details.isTimestamped,
      timestampToken: details.timestampToken,
    });

    // Store in PDF metadata (using Keywords field for compatibility)
    const metadataJson = JSON.stringify({
      secureSignPro: true,
      version: '1.0',
      signatures,
    });

    pdfDoc.setKeywords([`SECURESIGN_METADATA:${Buffer.from(metadataJson).toString('base64')}`]);

    // Also update modification date
    pdfDoc.setModificationDate(new Date());
  }

  /**
   * Get custom SecureSign metadata from PDF
   */
  private getCustomMetadata(pdfDoc: PDFDocument): {
    secureSignatures?: Array<{
      index: number;
      verificationId: string;
      signerName: string;
      signerEmail?: string;
      signerId?: string;
      reason: string;
      location?: string;
      timestamp: string;
      timezone: string;
      algorithm: string;
      certificateFingerprint: string;
      signature: string;
      isTimestamped: boolean;
      timestampToken?: string;
    }>;
  } {
    try {
      const keywords = pdfDoc.getKeywords();
      if (!keywords) return {};

      const metadataKeyword = keywords.split(',').find(k => k.trim().startsWith('SECURESIGN_METADATA:'));
      if (!metadataKeyword) return {};

      const base64Data = metadataKeyword.split(':')[1];
      const jsonStr = Buffer.from(base64Data, 'base64').toString('utf8');
      return JSON.parse(jsonStr);
    } catch {
      return {};
    }
  }

  /**
   * Get existing signatures from PDF
   */
  private async getExistingSignatures(pdfDoc: PDFDocument): Promise<Array<{
    signatureIndex: number;
    signerName: string;
    signedAt: string;
    reason?: string;
    verificationId: string;
  }>> {
    const metadata = this.getCustomMetadata(pdfDoc);
    if (!metadata.secureSignatures) return [];

    return metadata.secureSignatures.map(sig => ({
      signatureIndex: sig.index,
      signerName: sig.signerName,
      signedAt: sig.timestamp,
      reason: sig.reason,
      verificationId: sig.verificationId,
    }));
  }

  /**
   * Count signatures in document
   */
  private async countSignatures(pdfDoc: PDFDocument): Promise<number> {
    const signatures = await this.getExistingSignatures(pdfDoc);
    return signatures.length;
  }

  // ==================== Save Operations ====================

  /**
   * Save signed PDF to file
   */
  async savePdf(pdfBytes: Uint8Array, outputPath: string): Promise<string> {
    try {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write atomically
      const tempPath = `${outputPath}.tmp`;
      fs.writeFileSync(tempPath, pdfBytes);
      fs.renameSync(tempPath, outputPath);

      return outputPath;
    } catch (error) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_WRITE_ERROR,
        `Failed to save PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get PDF bytes without saving
   */
  async getPdfBytes(): Promise<Uint8Array> {
    if (!this.loadedPdf) {
      throw new SecureSignError(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        'No document loaded'
      );
    }

    return await this.loadedPdf.document.save();
  }

  // ==================== Utility Methods ====================

  /**
   * Check if buffer is PNG format
   */
  private isPng(buffer: Buffer): boolean {
    return buffer[0] === 0x89 &&
           buffer[1] === 0x50 &&
           buffer[2] === 0x4e &&
           buffer[3] === 0x47;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 1, b: 1 };
  }

  /**
   * Validate PDF signature position
   */
  validateSignaturePosition(position: SignaturePosition): boolean {
    if (!this.loadedPdf) {
      return false;
    }

    if (position.page < 1 || position.page > this.loadedPdf.pageCount) {
      return false;
    }

    const pageDims = this.getPageDimensions(position.page);

    // Check bounds
    if (position.x < 0 || position.y < 0) return false;
    if (position.x + position.width > pageDims.width) return false;
    if (position.y + position.height > pageDims.height) return false;

    // Check minimum size
    if (position.width < SIGNATURE_CONFIG.VISUAL.MIN_WIDTH) return false;
    if (position.height < SIGNATURE_CONFIG.VISUAL.MIN_HEIGHT) return false;

    return true;
  }
}

// ==================== Factory Function ====================

let pdfEngineInstance: PdfEngine | null = null;

export function getPdfEngine(): PdfEngine {
  if (!pdfEngineInstance) {
    pdfEngineInstance = new PdfEngine();
  }
  return pdfEngineInstance;
}

export function createPdfEngine(): PdfEngine {
  return new PdfEngine();
}
