import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LogItem {
    id: number;
    command: string;
    status: string;
    color: 'default' | 'green' | 'purple' | 'white';
}

export function ConsoleStatusCard() {
    const [logs, setLogs] = useState<LogItem[]>([]);

    useEffect(() => {
        const allLogs: Omit<LogItem, 'id'>[] = [
            { command: 'route.calendar', status: 'AVAILABLE', color: 'default' },
            { command: 'booked.call', status: 'CONFIRMED', color: 'green' },
            { command: 'system.ready', status: 'ACTIVE', color: 'green' },
            { command: 'ingest.lead', status: 'RECEIVED', color: 'default' },
            { command: 'qualify.intent', status: 'HIGH', color: 'white' },
            { command: 'verify.human', status: 'VERIFIED', color: 'purple' },
            { command: 'sync.crm', status: 'COMPLETE', color: 'green' },
            { command: 'optimize.bid', status: 'UPDATED', color: 'default' },
        ];

        // Initial fill
        setLogs(allLogs.slice(0, 5).map((log, i) => ({ ...log, id: Date.now() + i })));

        let currentIndex = 5;

        const interval = setInterval(() => {
            const nextLog = allLogs[currentIndex % allLogs.length];

            setLogs(prev => {
                const newLogs = [...prev, { ...nextLog, id: Date.now() }];
                // Keep only last 5 items to simulate scrolling
                if (newLogs.length > 5) {
                    return newLogs.slice(newLogs.length - 5);
                }
                return newLogs;
            });

            currentIndex++;
        }, 2000); // New line every 2 seconds for readability

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden lg:block absolute -right-16 top-1/2 -translate-y-1/2 system-card animate-float">
            <div className="system-card-inner min-w-[320px] bg-merkad-bg-tertiary/90 backdrop-blur-sm border border-white/5 shadow-2xl">
                {/* Header */}
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider mb-4 pl-1 flex justify-between items-center">
                    <span>CONSOLE</span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                </div>

                <div className="space-y-3 font-mono text-sm min-h-[160px] flex flex-col justify-end">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <span className="text-merkad-text-muted flex items-center gap-2">
                                <span className="text-merkad-purple-light opacity-50">&gt;</span>
                                <span className={cn(
                                    "opacity-90",
                                    log.color === 'white' && "text-white font-medium"
                                )}>
                                    {log.command}
                                </span>
                            </span>
                            <span className={cn(
                                "font-medium tracking-wide text-xs",
                                log.color === 'default' && "text-merkad-text-muted",
                                log.color === 'green' && "text-merkad-green",
                                log.color === 'purple' && "text-merkad-purple-light",
                                log.color === 'white' && "text-white"
                            )}>
                                {log.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
