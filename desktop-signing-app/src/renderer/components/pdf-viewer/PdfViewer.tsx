/**
 * SecureSign Pro - PDF Viewer Component
 *
 * Displays PDF documents and allows signature placement.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DocumentInfo } from '../../../shared/types';
import { useAppStore } from '../../store/useAppStore';

interface PdfViewerProps {
  document: DocumentInfo | null;
  onOpenFile: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ document, onOpenFile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setSignaturePosition, signaturePosition } = useAppStore();

  // Handle page navigation
  const goToPage = (page: number) => {
    if (document && page >= 1 && page <= document.pageCount) {
      setCurrentPage(page);
    }
  };

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.25), 4));
  };

  // Handle signature placement click
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPlacingSignature || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      setSignaturePosition({
        page: currentPage,
        x,
        y,
        width: 200,
        height: 80,
      });

      setIsPlacingSignature(false);
    },
    [isPlacingSignature, currentPage, zoom, setSignaturePosition]
  );

  // Render placeholder for signature position
  const renderSignatureOverlay = () => {
    if (!signaturePosition || signaturePosition.page !== currentPage) return null;

    return (
      <div
        className="signature-overlay"
        style={{
          left: signaturePosition.x * zoom,
          top: signaturePosition.y * zoom,
          width: signaturePosition.width * zoom,
          height: signaturePosition.height * zoom,
        }}
      >
        <div className="signature-overlay-label">Signature Area</div>
        <button
          className="signature-overlay-remove"
          onClick={() => setSignaturePosition(null)}
        >
          ×
        </button>
      </div>
    );
  };

  if (!document) {
    return (
      <div className="pdf-viewer pdf-viewer-empty">
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h2>No Document Open</h2>
          <p>Open a PDF document to view and sign it.</p>
          <button className="btn btn-primary" onClick={onOpenFile}>
            Open PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <div className="toolbar-group">
          <button
            className="btn btn-icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            ◀
          </button>
          <span className="page-info">
            Page {currentPage} of {document.pageCount}
          </span>
          <button
            className="btn btn-icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= document.pageCount}
          >
            ▶
          </button>
        </div>

        <div className="toolbar-group">
          <button className="btn btn-icon" onClick={() => handleZoom(-0.25)}>
            −
          </button>
          <span className="zoom-info">{Math.round(zoom * 100)}%</span>
          <button className="btn btn-icon" onClick={() => handleZoom(0.25)}>
            +
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className={`btn ${isPlacingSignature ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsPlacingSignature(!isPlacingSignature)}
          >
            {isPlacingSignature ? 'Cancel Placement' : 'Place Signature'}
          </button>
        </div>
      </div>

      <div
        className={`pdf-container ${isPlacingSignature ? 'placing-signature' : ''}`}
        ref={containerRef}
      >
        <div
          className="pdf-page-wrapper"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* In production, this would render actual PDF content using pdfjs-dist */}
          <canvas
            ref={canvasRef}
            className="pdf-canvas"
            width={612}
            height={792}
            onClick={handleCanvasClick}
          />

          {/* Placeholder for demo */}
          <div className="pdf-placeholder">
            <p className="doc-name">{document.fileName}</p>
            <p className="doc-info">
              {document.pageCount} page{document.pageCount !== 1 ? 's' : ''} •{' '}
              {(document.fileSize / 1024).toFixed(1)} KB
            </p>
            {document.isSigned && (
              <p className="doc-signed">
                ✅ This document has {document.signatureCount} signature
                {document.signatureCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {renderSignatureOverlay()}
        </div>
      </div>

      {isPlacingSignature && (
        <div className="placement-hint">
          Click on the document to place your signature
        </div>
      )}
    </div>
  );
};
