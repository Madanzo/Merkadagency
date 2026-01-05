import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
}

/**
 * VideoPlayer - Custom styled video player with controls
 */
export function VideoPlayer({ src, poster, className = '' }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div className={`relative group rounded-xl overflow-hidden bg-merkad-bg-tertiary ${className}`}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
                onClick={togglePlay}
                playsInline
            />

            {/* Play button overlay - shown when paused */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:opacity-100"
                    aria-label="Play video"
                >
                    <div className="w-16 h-16 rounded-full bg-merkad-purple/90 flex items-center justify-center shadow-lg shadow-merkad-purple/30 transition-transform hover:scale-110">
                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                </button>
            )}

            {/* Controls bar - shown on hover or when playing */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                {/* Progress bar */}
                <div
                    className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3"
                    onClick={handleProgressClick}
                >
                    <div
                        className="h-full bg-merkad-purple rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white" />
                            )}
                        </button>
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={handleFullscreen}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Fullscreen"
                    >
                        <Maximize className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
