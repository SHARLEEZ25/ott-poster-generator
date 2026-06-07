// src/pages/Upload.tsx
import React, { FC, useRef, useState } from "react";
import { Loader2, Sparkles, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

interface UploadProps {
  onFrameSelect: (frameUrl: string, description: string | null) => void;
}

interface UploadResult {
  frame: string;
  frameDescription: string | null;
  timestamp: number;
  source: string;
  alternateFrames: string[];
}

const Upload: FC<UploadProps> = ({ onFrameSelect }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [showAlternates, setShowAlternates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerFileInput = () => {
    if (!isUploading && fileInputRef.current) fileInputRef.current.click();
  };

  const safeJsonParse = async (response: Response) => {
    try { return await response.json(); } catch { return null; }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setError(null);
    setResult(null);
    setSelectedFrame(null);
    setShowAlternates(false);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(`${API_BASE}/videos/upload-video`, {
        method: "POST",
        body: formData,
      });

      const data = await safeJsonParse(response);
      if (!data) throw new Error("Backend returned invalid response.");
      if (!response.ok || !data.frame) throw new Error(data.error || "Video upload failed");

      const uploadResult: UploadResult = {
        frame: data.frame,
        frameDescription: data.frameDescription,
        timestamp: data.timestamp,
        source: data.source || "ffmpeg-fallback",
        alternateFrames: data.alternateFrames || [],
      };
      setResult(uploadResult);
      setSelectedFrame(uploadResult.frame);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChooseAlternate = (frame: string) => {
    setSelectedFrame(frame);
    setShowAlternates(false);
  };

  const handleProceed = () => {
    if (!result || !selectedFrame) return;
    // Only pass frameDescription if the user kept the Gemini-picked frame
    const desc = selectedFrame === result.frame ? result.frameDescription : null;
    onFrameSelect(selectedFrame, desc);
    navigate("/generator");
  };

  const isGeminiFrame = result && selectedFrame === result.frame && result.source === "gemini";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#000000]">
      <header className="flex items-center justify-between border-b border-[#382929] px-10 py-3">
        <div className="flex items-center gap-2 text-white">
          <h2 className="text-white text-lg font-bold">OTT<span className="text-red-500">Poster</span></h2>
        </div>
      </header>

      <div className="px-6 md:px-20 flex flex-1 justify-center py-5">
        <div className="max-w-[960px] flex-1 flex flex-col">
          <h2 className="text-white text-[28px] font-bold text-center py-5">Upload Your Video</h2>

          <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileSelect} className="hidden" />

          {!result && !isUploading && (
            <div
              className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#533c3c] px-6 py-14 hover:border-[#df2020] cursor-pointer transition-colors"
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-white text-lg">Drop your video here or</p>
                <p className="text-gray-500 text-sm">Gemini AI will watch your video and pick the best frame automatically</p>
              </div>
              <button className="h-10 px-4 bg-[#221113] text-white rounded-lg font-bold">📁 Upload Video</button>
            </div>
          )}

          {isUploading && (
            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
              <Loader2 className="h-12 w-12 text-[#e83b4a] animate-spin mb-4" />
              <h2 className="text-white text-[28px] font-bold text-center pb-3 pt-5">
                Gemini is Analysing Your Video...
              </h2>
              <p className="text-[#b89d9d] text-base text-center max-w-md">
                AI is watching your video to find the most cinematic frame. This may take 20–40 seconds.
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-4 bg-red-950 border border-red-800 rounded-lg p-4">{error}</p>
          )}

          {result && selectedFrame && (
            <div className="mt-8 flex flex-col items-center gap-6">

              {/* Badge */}
              {isGeminiFrame ? (
                <div className="flex items-center gap-2 bg-[#1a1a2e] border border-indigo-700 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-300 text-sm font-medium">Best frame picked by Gemini AI</span>
                  <span className="text-gray-500 text-xs">@ {result.timestamp.toFixed(1)}s</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[#1a1a0a] border border-yellow-700 rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-medium">Your selected frame</span>
                </div>
              )}

              {/* Selected frame preview */}
              <div className={`border-2 rounded-xl overflow-hidden shadow-2xl max-w-lg w-full ${isGeminiFrame ? "border-indigo-700 shadow-indigo-900/40" : "border-yellow-700 shadow-yellow-900/20"}`}>
                <img src={selectedFrame} alt="Selected frame" className="w-full" />
              </div>

              {/* Gemini description — only when Gemini frame is active */}
              {isGeminiFrame && result.frameDescription && (
                <div className="bg-[#0f0f1a] border border-gray-800 rounded-lg p-4 max-w-lg w-full">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">What Gemini saw</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.frameDescription}</p>
                </div>
              )}

              {/* Toggle alternate frames */}
              {result.alternateFrames.length > 0 && (
                <div className="max-w-lg w-full">
                  <button
                    onClick={() => setShowAlternates((v) => !v)}
                    className="flex items-center justify-between w-full text-gray-400 hover:text-white text-sm border border-gray-800 hover:border-gray-600 rounded-lg px-4 py-3 transition-colors"
                  >
                    <span>Not happy with this? Choose a different frame</span>
                    {showAlternates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showAlternates && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {result.alternateFrames.map((frame, i) => (
                        <div
                          key={i}
                          onClick={() => handleChooseAlternate(frame)}
                          className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedFrame === frame
                              ? "border-yellow-500 scale-95"
                              : "border-gray-700 hover:border-gray-400"
                          }`}
                        >
                          <img src={frame} alt={`Frame ${i + 1}`} className="w-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Proceed */}
              <button
                onClick={handleProceed}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg shadow-red-600/20 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Use This Frame — Generate Poster
              </button>

              <button onClick={triggerFileInput} className="text-gray-500 hover:text-gray-300 text-sm underline">
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
