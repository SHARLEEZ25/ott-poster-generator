import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

// Define the interface for props, although currently empty
interface AssetDesktopProps {}

// Define the type for the asset options
type AssetType = 'Poster' | 'Instagram' | 'YouTube' | 'Trailer';

/**
 * AssetDesktop component allows the user to choose the desired output format
 * (Poster, Instagram Post, YouTube Thumbnail, etc.) after uploading content.
 */

const AssetDesktop: FC<AssetDesktopProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    // Effect to check for navigation state on component mount
    useEffect(() => {
        // Check if state exists and 'uploaded' flag is true
        if (location.state && location.state.uploaded) {
            const files = location.state.files || [];
            
            setUploadedFiles(files);
            setShowSuccessAlert(true);
            
            // Clear the state so the alert doesn't reappear if the user navigates back
            // and forth without a new upload.
            // Note: This relies on history management; a simpler approach is using setTimeout.
            
            // Auto-hide the alert after 5 seconds
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);


    // Define the options for easier rendering and click handling
    const options = [
        {
            id: 'Poster' as AssetType,
            title: "Poster",
            description: "Generate a cinematic poster in any South Indian language — including Tamil.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuByA7_IvdSKdhJkJcyreQC1fJjLO9ZPkINCVQJoj2PkEF92us-jkt8oSnd30K6wTfzTmZ-2U8Iix7YS5-WjhlmkSUuOzLLZjp5RyBQPPtkXFR51imkfMAO5V-dRvcZvkncpNxuxhYSSRJQA-BiR89ezju9D4wq9thptoLkvzPhcxFoecoYRTtX33AGH8z7cF_BcjT6HwBVa9n4MeG9sZnO3KPCKF4GlhH7-RYt9n6b7ieFEv80PRGMKH9IbPSUrlRj3nL55BUUIlao",
        },
        {
            id: 'Instagram' as AssetType,
            title: "Instagram Post & Story",
            description: "Create social media-ready visuals (Square / 9:16).",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKwGe0LLpYikUJyDYn_Mo-7SkSYiBsFffGW9qjBRl_G5EybEziXP34fd8m6eozRi4D29ByC4NtZ4d7KkyxivktvNSQEdYluB13WxtzJ77kZLHMlio9vXKmU9BO_7pNsO3kgkiGON_57gTyjlcRDSrh3SekCoMUPF0jS50GA_w0tlY6sDBfpkDcTxBD3rEMh9LYb90Ixq-3afOjJ1RoHmUOuB0RX_SYGFQXMM7rmFVv9718rqQU1VVzPqatx7_eGZ4YQw2rLOQlBo",
        },
        {
            id: 'YouTube' as AssetType,
            title: "YouTube Thumbnail",
            description: "Design a thumbnail that grabs attention instantly.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIkWEb6UBnXqSA4EG9D_8APHu8gk4NNevYMb5MpkcKwNxqtlA3ayB8tirlnC3tvubpv2EojtT18alt-o59xz6sOO_s_dlWjU48ml6Vwa_SOtaOyMrKFikT63513FJcqSvkKq7C6x9pNNdoYKfOTGDCEdcNG3rFtxUiNGILExBT_IavkF0DahRnbqeM1cMJsgkjb6WaeicMHkGHc7lRUxv6EYTwMcRwJj3z6zPnXofXfbgnLAmGpfAMxgcTJMAMLJgiptwkDEf3BZo",
        },
        {
            id: 'Trailer' as AssetType,
            title: "Trailer (Coming Soon)",
            description: "Create short cinematic teaser videos.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgjAT5fUuHZx-a0NJqsCP1j0G4HP_O3lX0kzCjsSqc20RgCtnGPoX-81666H_2cdU0ytrk7AdR2mCExOeMfSwnj1u82N1X-FPG8RqvOau23--i2-4vlmiCgNsC6VzLr_1OG6vGC_KM4jIJYEmmkrB24dM2VADqKAvZxHXD3ANwWxVCL-jBsH0t9t8KncxOE4B_jgzpukEDB1dfJkBQGIKWuLDqp7wso5zKxxzAyrBdgeqCg6169NWmL-PZ3V84grYq1CBd5UzmwnE",
            isComingSoon: true
        }
    ];

    const handleContinue = () => {
        if (selectedAsset) {
            navigate('/generator', {
                state: {
                    assetType: selectedAsset,
                    uploadedFiles: uploadedFiles,
                },
            });
        }
    };

    return (
        <div 
            className="relative flex h-auto min-h-screen w-full flex-col bg-[#000000] dark group/design-root overflow-x-hidden" 
            style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                
                {/* Header Section */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#472427] px-10 py-3">
                    <div className="flex items-center gap-4 text-white">
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.010em]">
                            OTT<span className="text-red-500">Poster</span>
                        </h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        {/* Profile Picture */}
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCu0YUmF_2tiCibfudONCnOUI_xNGyox0rFUgRPKOSl_EUl6-ufd2OoGvngWtS5fEIFqHX1rZ0pdmvtNbT26L07RJOn_tHP03fq7qyKqWVZL89Svn3LmGelj9ptyfXrQsGJplcsf4EVZq0Fwj0FQEQzg6cFxOeXvXYv5tchhBaixABm6atTZXdGdoQ48JK5C7qPBR0Lz2LJaccZvOk27TwJqRI9At07OClVxewqNYDF11LCCiZYywEfr1i0OPWmu9m-qRO-bwjnCe8")' }}
                        ></div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        
                        {/* Success Notification Banner */}
                        {showSuccessAlert && (
                            <div className="p-4 mb-6 rounded-xl bg-green-900/50 border border-green-700/80 flex items-start justify-between">
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-semibold">
                                            Content Uploaded Successfully!
                                        </p>
                                        <p className="text-sm text-green-300">
                                            {uploadedFiles.length > 0
                                                ? `File(s) ready: ${uploadedFiles.join(', ')}`
                                                : 'Your content is now available for AI processing.'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setShowSuccessAlert(false)} className="text-green-400 hover:text-white transition p-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                            Choose Your Output Type
                        </h2>
                        
                        {/* Grid of Options */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-6 p-4">
                            {options.map((option, index) => {
                                const isSelected = selectedAsset === option.id;
                                return (
                                <div 
                                    key={index}
                                    className={`flex flex-col gap-3 pb-3 p-3 rounded-xl transition cursor-pointer ${
                                        option.isComingSoon 
                                            ? 'opacity-50 pointer-events-none border border-gray-700' 
                                            : isSelected 
                                                ? 'bg-[#1a1a1a] border-2 border-[#e83b4a] shadow-lg shadow-[#e83b4a]/20' 
                                                : 'hover:bg-[#1a1a1a] border-2 border-transparent hover:border-[#df2020]'
                                    }`}
                                    onClick={() => !option.isComingSoon && setSelectedAsset(option.id)}
                                >
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                        style={{ backgroundImage: `url("${option.imageUrl}")` }}
                                    ></div>
                                    <div>
                                        <p className="text-white text-base font-medium leading-normal flex items-center gap-2">
                                            {option.title}
                                            {option.isComingSoon && (
                                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">Soon</span>
                                            )}
                                        </p>
                                        <p className="text-[#c89398] text-sm font-normal leading-normal">{option.description}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                        
                        {/* Continue Button */}
                        <div className="flex px-4 py-3 justify-center pt-8">
                            <button
                                className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 transition text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg ${
                                    selectedAsset 
                                        ? 'bg-[#e83b4a] hover:bg-[#c91d1d] shadow-[#e83b4a]/40' 
                                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                                }`}
                                onClick={handleContinue}
                                disabled={!selectedAsset}
                            >
                                <span className="truncate">Continue</span>
                            </button>
                        </div>
                        
                        {/* Footer Text */}
                        <p className="text-[#c89398] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center">
                            Powered by AI
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDesktop;