import { useRef, useEffect, useCallback, useState } from 'react';

interface SignaturePadProps {
    width?: number;
    height?: number;
    onSignatureChange?: (isEmpty: boolean) => void;
}

export interface SignaturePadRef {
    toBase64: () => string;
    clear: () => void;
    isEmpty: () => boolean;
}

export function SignaturePad({ width = 500, height = 200, onSignatureChange }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Get position relative to canvas
    const getPos = useCallback((e: MouseEvent | TouchEvent): { x: number; y: number } => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY,
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }, []);

    const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e);
        lastPointRef.current = pos;
        setIsDrawing(true);

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    }, [getPos]);

    const draw = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();

        const pos = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !lastPointRef.current) return;

        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastPointRef.current = pos;

        if (!hasDrawn) {
            setHasDrawn(true);
            onSignatureChange?.(false);
        }
    }, [isDrawing, getPos, hasDrawn, onSignatureChange]);

    const endDraw = useCallback(() => {
        setIsDrawing(false);
        lastPointRef.current = null;
    }, []);

    // Attach event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseDown = (e: MouseEvent) => startDraw(e);
        const handleMouseMove = (e: MouseEvent) => draw(e);
        const handleMouseUp = () => endDraw();
        const handleTouchStart = (e: TouchEvent) => startDraw(e);
        const handleTouchMove = (e: TouchEvent) => draw(e);
        const handleTouchEnd = () => endDraw();

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [startDraw, draw, endDraw]);

    const clear = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setHasDrawn(false);
        onSignatureChange?.(true);
    }, [onSignatureChange]);

    const toBase64 = useCallback((): string => {
        return canvasRef.current?.toDataURL('image/png') || '';
    }, []);

    const isEmpty = useCallback((): boolean => {
        return !hasDrawn;
    }, [hasDrawn]);

    // Expose methods via a global ref pattern
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            (canvas as any).__signaturePad = { toBase64, clear, isEmpty };
        }
    }, [toBase64, clear, isEmpty]);

    return (
        <div className="space-y-3">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    style={{ width: '100%', height: `${height}px`, touchAction: 'none', cursor: 'crosshair' }}
                />
                {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-gray-400 text-sm">Sign here — draw your signature</p>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    {hasDrawn ? '✓ Signature captured' : 'Draw your signature above'}
                </p>
                <button
                    type="button"
                    onClick={clear}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                    Clear signature
                </button>
            </div>
        </div>
    );
}

// Helper to get signature pad methods from canvas element
export function getSignaturePadFromCanvas(canvas: HTMLCanvasElement | null): SignaturePadRef | null {
    if (!canvas) return null;
    return (canvas as any).__signaturePad || null;
}
