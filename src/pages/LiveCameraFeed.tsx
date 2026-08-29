import React, { useEffect, useState } from "react";
import { PlayCircle, Video } from "lucide-react";

// Looping synthetic demo video (public sample)
const SIMULATOR_VIDEO_SRC = "demo-loop.mp4";

export default function LiveCameraFeed() {
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    if (snapshots.length > 1) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % snapshots.length);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [snapshots]);

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed ${response.status}`);

      const data = await response.json();

      if (data.status !== "success" || !Array.isArray(data.snapshots)) {
        throw new Error(data.message || "Unexpected API response");
      }

      const urls = data.snapshots.map((name: string) => `${import.meta.env.VITE_API_URL}/uploads/${name}`);
      setSnapshots(urls);
      setCurrentFrame(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) uploadVideo(file);
  };

  return (
    <section className="space-y-5">
      <header className="rounded-2xl bg-[var(--panel)] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Camera Feed</h2>
          <p className="text-sm text-slate-300">Drag and drop a video to generate real-time snapshot playback.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSimulator((s) => !s)}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25 dark:border-cyan-400/50 dark:bg-cyan-500/15 dark:text-cyan-100 dark:hover:bg-cyan-500/25"
        >
          {showSimulator ? (
            <>
              <Video className="h-4 w-4" />
              Hide simulator feed
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              Show simulator feed
            </>
          )}
        </button>
      </header>

      {showSimulator && (
        <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--surface)] p-2">
          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-cyan-100">
            <PlayCircle className="h-4 w-4" />
            Synthetic live feed (simulator)
          </h3>
          <p className="mb-2 text-xs text-slate-400">Demo video playing in loop.</p>
          <div className="rounded-lg border border-cyan-300/20 bg-slate-950/70 p-1 overflow-hidden">
            <video
              src={SIMULATOR_VIDEO_SRC}
              className="mx-auto h-[65vh] max-h-[560px] w-full rounded object-contain"
              autoPlay
              loop
              muted
              playsInline
              controls
              title="Simulator feed"
            />
            <p className="mt-1 text-center text-xs text-slate-400">Simulator — always playing in loop</p>
          </div>
        </div>
      )}

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="glass-card flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-300/20 p-6"
      >
        <p className="text-sm text-slate-300">Drop your video file here</p>
        <p className="text-xs text-slate-400">Accepted: mp4, webm, mov, mkv</p>

        {uploading && <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100">Processing video...</span>}
        {error && <span className="rounded-lg bg-rose-500/20 px-3 py-1 text-xs text-rose-100">{error}</span>}

        {snapshots.length > 0 && (
          <div className="w-full rounded-lg border border-cyan-300/20 bg-slate-950/70 p-1">
            <img src={snapshots[currentFrame]} alt={`frame-${currentFrame}`} className="mx-auto h-[65vh] max-h-[560px] w-full rounded object-contain" />
            <p className="mt-1 text-center text-xs text-slate-300">Frame {currentFrame + 1}/{snapshots.length}</p>
          </div>
        )}
      </div>
    </section>
  );
}