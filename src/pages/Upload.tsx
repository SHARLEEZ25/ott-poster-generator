// src/pages/Upload.tsx
import React, { FC, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

interface UploadProps {
  onFrameSelect: (frameUrl: string) => void;
}

const Upload: FC<UploadProps> = ({ onFrameSelect }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
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
    setFrames([]);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(`${API_BASE}/videos/upload-video`, {
        method: "POST",
        body: formData,
      });

      const data = await safeJsonParse(response);

      if (!data) {
        throw new Error(
          "Backend returned invalid response. Check if server crashed or returned HTML."
        );
      }
      console.log("Returned frames:", data.frames);

      if (!response.ok || !data.frames) {
        throw new Error(data.error || "Video upload failed");
      }

      setFrames(data.frames);
    } catch (err) {
      const message = (err as Error).message;
      console.error("Upload Error:", message);
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFrameSelect = (frame: string) => {
    onFrameSelect(frame);
    navigate("/asset-desktop");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#000000]">
      <header className="flex items-center justify-between border-b border-[#382929] px-10 py-3">
        <div className="flex items-center gap-2 text-white">
          
          <h2 className="text-white text-lg font-bold">OTT<span className="text-red-500">Poster</span></h2>
        </div>
      </header>

      <div className="px-20 flex flex-1 justify-center py-5">
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

          <div
            className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#533c3c] px-6 py-14 hover:border-[#df2020] cursor-pointer"
            onClick={triggerFileInput}
          >
            <p className="text-white text-lg text-center">
              Drop your video here or
            </p>
            <button className="h-10 px-4 bg-[#221113] text-white rounded-lg font-bold">
              📁 Upload Video
            </button>
          </div>

          {isUploading && (
            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
              <Loader2 className="h-12 w-12 text-[#e83b4a] animate-spin mb-4" />
              <h2 className="text-white text-[28px] font-bold text-center pb-3 pt-5">
                Processing Video...
              </h2>
              <p className="text-[#b89d9d] text-base text-center">
                Extracting frames. This may take 10-15 seconds.
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {frames.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {frames.map((frame, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-red-600"
                  onClick={() => handleFrameSelect(frame)}
                >
                  <img src={frame} alt={`Frame ${index + 1}`} />

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
