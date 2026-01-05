import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImageLightboxProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * ImageLightbox - Clickable image that opens in a fullscreen dialog
 */
export function ImageLightbox({ src, alt, className = '' }: ImageLightboxProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`cursor-zoom-in overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-merkad-purple focus:ring-offset-2 focus:ring-offset-merkad-bg-primary ${className}`}
                >
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
