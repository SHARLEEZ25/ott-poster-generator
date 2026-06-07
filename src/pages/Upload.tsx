// src/pages/Upload.tsx
import React, { FC, useRef, useState } from "react";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

interface UploadProps {
  onFrameSelect: (frameUrl: string, description: string | null) => void;
}

const Upload: FC<UploadProps> = ({ onFrameSelect }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ frame: string; frameDescription: string; timestamp: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerFileInput = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const safeJsonParse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(`${API_BASE}/videos/upload-video`, {
        method: "POST",
        body: formData,
      });

      const data = await safeJsonParse(response);

      if (!data) {
        throw new Error("Backend returned invalid response. Check if server crashed or returned HTML.");
      }

      if (!response.ok || !data.frame) {
        throw new Error(data.error || "Video upload failed");
      }

      setResult({
        frame: data.frame,
        frameDescription: data.frameDescription,
        timestamp: data.timestamp,
      });
    } catch (err) {
      const message = (err as Error).message;
      console.error("Upload Error:", message);
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProceed = () => {
    if (!result) return;
    onFrameSelect(result.frame, result.frameDescription);
    navigate("/generator");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#000000]">
      <header className="flex items-center justify-between border-b border-[#382929] px-10 py-3">
        <div className="flex items-center gap-2 text-white">
          <h2 className="text-white text-lg font-bold">OTT<span className="text-red-500">Poster</span></h2>
        </div>
      </header>

      <div className="px-6 md:px-20 flex flex-1 justify-center py-5">
        <div className="max-w-[960px] flex-1 flex flex-col">
          <h2 className="text-white text-[28px] font-bold text-center py-5">
            Upload Your Video
          </h2>

          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!result && !isUploading && (
            <div
              className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#533c3c] px-6 py-14 hover:border-[#df2020] cursor-pointer transition-colors"
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-white text-lg">Drop your video here or</p>
                <p className="text-gray-500 text-sm">Gemini AI will watch your video and pick the best frame automatically</p>
              </div>
              <button className="h-10 px-4 bg-[#221113] text-white rounded-lg font-bold">
                📁 Upload Video
              </button>
            </div>
          )}

          {isUploading && (
            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
              <Loader2 className="h-12 w-12 text-[#e83b4a] animate-spin mb-4" />
              <h2 className="text-white text-[28px] font-bold text-center pb-3 pt-5">
                Gemini is Analysing Your Video...
              </h2>
              <p className="text-[#b89d9d] text-base text-center max-w-md">
                AI is watching your video to find the most cinematic frame. This may take 20–40 seconds depending on video length.
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-4 bg-red-950 border border-red-800 rounded-lg p-4">{error}</p>
          )}

          {result && (
            <div className="mt-8 flex flex-col items-center gap-6">
              {/* AI badge */}
              <div className="flex items-center gap-2 bg-[#1a1a2e] border border-indigo-700 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-medium">Best frame picked by Gemini AI</span>
                <span className="text-gray-500 text-xs">@ {result.timestamp.toFixed(1)}s</span>
              </div>

              {/* Frame preview */}
              <div className="border-2 border-indigo-700 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/40 max-w-lg w-full">
                <img src={result.frame} alt="AI-selected best frame" className="w-full" />
              </div>

              {/* Gemini's description */}
              <div className="bg-[#0f0f1a] border border-gray-800 rounded-lg p-4 max-w-lg w-full">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">What Gemini saw</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.frameDescription}</p>
              </div>

              {/* Proceed button */}
              <button
                onClick={handleProceed}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg shadow-red-600/20 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Use This Frame — Generate Poster
              </button>

              <button
                onClick={triggerFileInput}
                className="text-gray-500 hover:text-gray-300 text-sm underline"
              >
                Upload a different video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
