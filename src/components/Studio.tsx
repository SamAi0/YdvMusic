import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Zap, Download, Music, Mic2, Activity, Volume2, RefreshCw, CheckCircle, BarChart3, Users, IndianRupee, Globe2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import toast from 'react-hot-toast';

const DEMO_BPM = 128;
const DEMO_KEY = 'C# Major';
const DEMO_ENERGY = 87;
const DEMO_MOOD = 'Energetic';

// Mock Data for Analytics
const playHistoryData = [
    { name: 'Mon', plays: 4000 },
    { name: 'Tue', plays: 3000 },
    { name: 'Wed', plays: 5000 },
    { name: 'Thu', plays: 2780 },
    { name: 'Fri', plays: 8890 },
    { name: 'Sat', plays: 12390 },
    { name: 'Sun', plays: 9490 },
];

const demographicData = [
    { name: 'India', value: 65, color: '#ec4899' },
    { name: 'US', value: 15, color: '#a855f7' },
    { name: 'UK', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 10, color: '#6366f1' },
];

const Studio: React.FC = () => {
    // Current Active Tab
    const [activeTab, setActiveTab] = useState<'analytics' | 'ai_tools'>('analytics');

    // AI Tools State
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [demoRunning, setDemoRunning] = useState(false);
    const [demoComplete, setDemoComplete] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [bpm, setBpm] = useState(0);
    const [detectedKey, setDetectedKey] = useState('');
    const [energy, setEnergy] = useState(0);
    const [mood, setMood] = useState('');

    const waveCanvas1 = useRef<HTMLCanvasElement>(null);
    const waveCanvas2 = useRef<HTMLCanvasElement>(null);
    const animRef1 = useRef<number>(0);
    const animRef2 = useRef<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Waveform animation for canvas 1 (input waveform)
    const drawWave1 = useCallback((phase: number) => {
        const canvas = waveCanvas1.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { width: w, height: h } = canvas;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#0d0d14';
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (h / 8) * i);
            ctx.lineTo(w, (h / 8) * i);
            ctx.stroke();
        }

        // Waveform
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, '#00d4aa');
        gradient.addColorStop(0.5, '#4ade80');
        gradient.addColorStop(1, '#00d4aa');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;

        for (let x = 0; x < w; x++) {
            const t = (x / w) * Math.PI * 14 + phase;
            const amp = 0.35 + 0.15 * Math.sin(x / 40 + phase * 0.3);
            const y = h / 2 + Math.sin(t) * amp * h + Math.sin(t * 2.3 + 1) * 0.08 * h;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Fill under waveform
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 212, 170, 0.06)';
        ctx.fill();
    }, []);

    // Waveform animation for canvas 2 (processed waveform)
    const drawWave2 = useCallback((phase: number) => {
        const canvas = waveCanvas2.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { width: w, height: h } = canvas;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0d0d14';
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (h / 8) * i);
            ctx.lineTo(w, (h / 8) * i);
            ctx.stroke();
        }

        // Frequency bars
        const bars = 80;
        const barW = w / bars - 1;
        for (let i = 0; i < bars; i++) {
            const t = (i / bars) * Math.PI * 4 + phase * 1.5;
            const barH = (0.2 + 0.6 * Math.abs(Math.sin(t)) * (0.5 + 0.5 * Math.sin(i * 0.3 + phase))) * h;

            const grad = ctx.createLinearGradient(0, h, 0, h - barH);
            grad.addColorStop(0, '#8b5cf6');
            grad.addColorStop(0.5, '#a855f7');
            grad.addColorStop(1, '#ec4899');

            ctx.fillStyle = grad;
            ctx.fillRect(i * (barW + 1), h - barH, barW, barH);
        }
    }, []);

    // Run animations when demo is active
    useEffect(() => {
        if (!demoRunning && !demoComplete) {
            cancelAnimationFrame(animRef1.current);
            cancelAnimationFrame(animRef2.current);
            return;
        }

        let phase = 0;
        const tick = () => {
            phase += 0.05;
            drawWave1(phase);
            drawWave2(phase);
            animRef1.current = requestAnimationFrame(tick);
        };
        animRef1.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animRef1.current);
        };
    }, [demoRunning, demoComplete, drawWave1, drawWave2, activeTab]);

    const runDemo = () => {
        if (demoRunning) return;
        setDemoRunning(true);
        setDemoComplete(false);
        setAnalysisProgress(0);
        setBpm(0);
        setDetectedKey('');
        setEnergy(0);
        setMood('');

        const stages = [
            { label: 'Loading audio buffer...', target: 20 },
            { label: 'Detecting tempo...', target: 45, action: () => setBpm(DEMO_BPM) },
            { label: 'Analyzing key signature...', target: 65, action: () => setDetectedKey(DEMO_KEY) },
            { label: 'Computing energy levels...', target: 80, action: () => setEnergy(DEMO_ENERGY) },
            { label: 'Predicting mood...', target: 95, action: () => setMood(DEMO_MOOD) },
            { label: 'Finalizing...', target: 100 },
        ];

        let stageIdx = 0;
        const interval = setInterval(() => {
            setAnalysisProgress(p => {
                const next = p + 1;
                if (stageIdx < stages.length && next >= stages[stageIdx].target) {
                    stages[stageIdx].action?.();
                    stageIdx++;
                }
                if (next >= 100) {
                    clearInterval(interval);
                    setDemoRunning(false);
                    setDemoComplete(true);
                    toast.success('Analysis complete! ??');
                }
                return Math.min(next, 100);
            });
        }, 40);
    };

    const exportWav = () => {
        try {
            const sampleRate = 44100;
            const seconds = 3;
            const numSamples = sampleRate * seconds;
            const numChannels = 2;
            const bitsPerSample = 16;
            const buffer = new ArrayBuffer(44 + numSamples * numChannels * (bitsPerSample / 8));
            const view = new DataView(buffer);

            const writeString = (offset: number, str: string) => {
                for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
            };

            writeString(0, 'RIFF');
            view.setUint32(4, 36 + numSamples * numChannels * 2, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * numChannels * 2, true);
            view.setUint16(32, numChannels * 2, true);
            view.setUint16(34, bitsPerSample, true);
            writeString(36, 'data');
            view.setUint32(40, numSamples * numChannels * 2, true);

            const freqs = [277.18, 349.23, 415.30];
            let offset = 44;
            for (let i = 0; i < numSamples; i++) {
                const t = i / sampleRate;
                let sample = 0;
                for (const f of freqs) {
                    sample += (Math.sin(2 * Math.PI * f * t) * 0.25);
                }
                const attack = 0.1, decay = 0.3, sustain = 0.6, release = 0.4;
                let env = 1;
                if (t < attack) env = t / attack;
                else if (t < attack + decay) env = 1 - (1 - sustain) * ((t - attack) / decay);
                else if (t < seconds - release) env = sustain;
                else env = sustain * ((seconds - t) / release);

                const s16 = Math.max(-32767, Math.min(32767, sample * env * 32767));
                view.setInt16(offset, s16, true);
                view.setInt16(offset + 2, s16, true);
                offset += 4;
            }

            const blob = new Blob([buffer], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `playstudio_${DEMO_KEY.replace(' ', '_')}_${DEMO_BPM}bpm.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('WAV file downloaded! ??');
        } catch (err) {
            console.error('WAV export error:', err);
            toast.error('Export failed. Try again.');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav'))) {
            setUploadedFile(file);
            toast.success(`Loaded: ${file.name}`);
        } else {
            toast.error('Please drop an audio file (MP3, WAV, etc.)');
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            toast.success(`Loaded: ${file.name}`);
        }
    };

    const resetDemo = () => {
        setDemoComplete(false);
        setDemoRunning(false);
        setAnalysisProgress(0);
        setBpm(0);
        setDetectedKey('');
        setEnergy(0);
        setMood('');
    };

    // --- Sub-components for Tabs ---

    const renderAnalyticsTab = () => (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Total Streams (7d)</h3>
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-pink-400" />
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">45.5k</span>
                        <span className="text-sm font-medium text-green-400">+12%</span>
                    </div>
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Unique Listeners</h3>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">12.1k</span>
                        <span className="text-sm font-medium text-green-400">+5%</span>
                    </div>
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Fan Tipping Revenue</h3>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <IndianRupee className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">? 14,500</span>
                        <span className="text-sm font-medium text-green-400">+24%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Graph */}
                <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Stream History</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={playHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="plays" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorPlays)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demographics */}
                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Top Geographies</h3>
                        <Globe2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-[250px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={demographicData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#999" axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {demographicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );

    const renderAiToolsTab = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Upload Zone */}
            <section>
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragging
                        ? 'border-purple-400 bg-purple-500/10 scale-[1.02]'
                        : uploadedFile
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-gray-700 bg-gray-800/30 hover:border-purple-500/50 hover:bg-purple-500/5'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,.mp3,.wav,.flac,.ogg,.aac"
                        className="hidden"
                        onChange={handleFileInput}
                    />

                    {uploadedFile ? (
                        <div className="space-y-3">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                            <div>
                                <p className="text-green-400 font-semibold">{uploadedFile.name}</p>
                                <p className="text-gray-400 text-sm mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <p className="text-gray-500 text-xs">Click to replace</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto">
                                <Music className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Drop your audio file here</p>
                                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                            </div>
                            <p className="text-gray-600 text-xs">Supports MP3, WAV, FLAC, OGG, AAC</p>
                        </div>
                    )}

                    {/* Pulse ring when dragging */}
                    {isDragging && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 animate-ping opacity-50" />
                    )}
                </div>
            </section>

            {/* Try Demo Button */}
            <section className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={runDemo}
                    disabled={demoRunning}
                    className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${demoRunning
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:scale-105 shadow-lg shadow-yellow-500/20'
                        }`}
                >
                    <Zap className={`w-6 h-6 ${demoRunning ? '' : 'animate-pulse'}`} />
                    <span>{demoRunning ? 'Analyzing...' : '? Try Demo'}</span>
                </button>

                {(uploadedFile) && (
                    <button
                        onClick={runDemo}
                        disabled={demoRunning}
                        className="flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all hover:scale-105 disabled:opacity-50"
                    >
                        <Activity className="w-5 h-5" />
                        <span>Analyze My Track</span>
                    </button>
                )}

                {demoComplete && (
                    <button
                        onClick={resetDemo}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-4"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Reset</span>
                    </button>
                )}
            </section>

            {/* Analysis Progress */}
            {(demoRunning || demoComplete) && (
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400 font-medium">
                            {demoComplete ? 'Analysis Complete' : 'Analyzing...'}
                        </span>
                        <span className="text-sm text-purple-400 font-bold">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                            style={{ width: `${analysisProgress}%` }}
                        />
                    </div>
                </section>
            )}

            {/* Waveform Canvases */}
            <div className={`space-y-4 ${!(demoRunning || demoComplete) ? 'hidden' : ''}`}>
                <h2 className="text-lg font-bold flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Waveform Analysis</span>
                </h2>

                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Input Waveform</p>
                    <canvas
                        ref={waveCanvas1}
                        width={800}
                        height={120}
                        className="w-full rounded-lg"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Frequency Spectrum</p>
                    <canvas
                        ref={waveCanvas2}
                        width={800}
                        height={120}
                        className="w-full rounded-lg"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                </div>
            </div>

            {/* Analysis Results */}
            {demoComplete && (
                <section className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>Detection Results</span>
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* BPM */}
                        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/20 rounded-2xl p-5 text-center">
                            <div className="text-4xl font-black text-green-400 mb-1">{bpm}</div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest">BPM</div>
                            <div className="text-gray-500 text-xs mt-1">Tempo</div>
                        </div>

                        {/* Key */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/20 border border-purple-500/20 rounded-2xl p-5 text-center">
                            <div className="text-2xl font-black text-purple-400 mb-1 leading-tight">{detectedKey || '�'}</div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest">Key</div>
                            <div className="text-gray-500 text-xs mt-1">Signature</div>
                        </div>

                        {/* Energy */}
                        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/20 border border-orange-500/20 rounded-2xl p-5 text-center">
                            <div className="text-4xl font-black text-orange-400 mb-1">{energy}%</div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest">Energy</div>
                            <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${energy}%` }} />
                            </div>
                        </div>

                        {/* Mood */}
                        <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/20 border border-pink-500/20 rounded-2xl p-5 text-center">
                            <div className="text-2xl font-black text-pink-400 mb-1">{mood || '�'}</div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest">Mood</div>
                            <div className="text-gray-500 text-xs mt-1">Predicted</div>
                        </div>
                    </div>

                    {/* Additional insight */}
                    <div className="bg-gray-900/40 border border-gray-700 rounded-2xl p-5 flex items-start space-x-4">
                        <Volume2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-white font-semibold mb-1">AI Insight</p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                This track has a strong pulse at {bpm} BPM in {detectedKey}, making it ideal for dance floors and workout playlists.
                                The {energy}% energy score and {mood.toLowerCase()} mood profile suggest high listener engagement.
                            </p>
                        </div>
                    </div>

                    {/* Export WAV */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={exportWav}
                            className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-500/20"
                        >
                            <Download className="w-5 h-5" />
                            <span>Export WAV</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm px-2">
                            <span>3-second preview � 44.1kHz � 16-bit stereo � {DEMO_KEY}</span>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );

    return (
        <div className="flex-1 bg-[#0a0a0a] text-white overflow-y-auto">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 via-gray-900 to-pink-900/30 border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                <div className="relative px-6 pt-10 pb-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Mic2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">Demo Creator Studio</h1>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mt-2 max-w-md">
                                Manage your artist profile, track stream analytics, and use AI to analyze your unreleased stems.
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex bg-[#121212] p-1 rounded-xl border border-white/5 shadow-inner self-start md:self-auto w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span>Analytics</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('ai_tools')}
                                className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ai_tools'
                                        ? 'bg-gray-800 text-white shadow-md ring-1 ring-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Mic2 className="w-4 h-4" />
                                <span>AI Tools</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 pb-32 max-w-[1600px] mx-auto">
                {activeTab === 'analytics' ? renderAnalyticsTab() : renderAiToolsTab()}
            </div>
        </div>
    );
};

export default Studio;