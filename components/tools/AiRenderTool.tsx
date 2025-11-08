import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UploadCloudIcon, VideoIcon, AlertTriangleIcon } from '../icons';
import LoadingSpinner from '../shared/LoadingSpinner';

// FIX: Removed conflicting global declaration for window.aistudio.
// The error messages indicate this type is already declared elsewhere.
// This is a global declaration to satisfy TypeScript since `window.aistudio` is injected at runtime.
declare global {
    interface Window {
        aistudio: any;
    }
}

const AiRenderTool: React.FC = () => {
    const [stepFile, setStepFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('A cinematic shot of the F1 car racing on a track, dramatic lighting');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const operationRef = useRef<any>(null);
    const [apiKeySelected, setApiKeySelected] = useState(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);
    
    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        // As per guideline, assume selection is successful to handle race condition.
        setApiKeySelected(true);
    };

    const handleFileChange = (file: File | null) => {
        if (file && (file.name.toLowerCase().endsWith('.step') || file.name.toLowerCase().endsWith('.stp'))) {
            setStepFile(file);
        } else if (file) {
            alert("Invalid file type. Please upload a .STEP or .STP file.");
        }
    };

    const handleDragEvents = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragOver(true);
        else if (e.type === 'dragleave') setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        handleDragEvents(e);
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
    };

    const handleGenerate = async () => {
        if (!stepFile || !prompt) {
            setError("Please upload a STEP file and provide a prompt.");
            return;
        }
        setError(null);
        setVideoUrl(null);
        setIsGenerating(true);
        operationRef.current = null;

        try {
            setLoadingMessage("Initializing AI render farm...");
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const augmentedPrompt = `A cinematic video of a miniature F1 in Schools car, geometrically inspired by the uploaded file '${stepFile.name}', ${prompt}`;
            
            operationRef.current = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: augmentedPrompt,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });

            setLoadingMessage("Generating video... this may take several minutes.");
            
            while (!operationRef.current.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                setLoadingMessage("Polling for results...");
                operationRef.current = await ai.operations.getVideosOperation({ operation: operationRef.current });
            }

            setLoadingMessage("Finalizing video...");
            const downloadLink = operationRef.current.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const videoResponseUrl = `${downloadLink}&key=${process.env.API_KEY}`;
                // Fetch as blob to play locally without exposing key in video src
                const response = await fetch(videoResponseUrl);
                const blob = await response.blob();
                setVideoUrl(URL.createObjectURL(blob));
            } else {
                throw new Error("Video generation completed, but no download link was provided.");
            }

        } catch (e: any) {
            console.error(e);
            let errorMessage = e.message || "An unknown error occurred.";
            if (errorMessage.includes("Requested entity was not found")) {
                setError("Your API key appears to be invalid. Please select a valid key to continue.");
                setApiKeySelected(false);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsGenerating(false);
            setLoadingMessage('');
        }
    };

     if (!apiKeySelected) {
        return (
            <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
                <div className="flex items-center mb-4">
                    <VideoIcon className="w-6 h-6 mr-3 text-brand-accent"/>
                    <h2 className="text-xl font-bold text-brand-text">AI Render Tool</h2>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-brand-dark p-4 rounded-lg border border-brand-border min-h-[300px]">
                    <AlertTriangleIcon className="w-12 h-12 text-yellow-400 mb-4" />
                    <h3 className="text-lg font-bold text-brand-text">API Key Required</h3>
                    <p className="text-brand-text-secondary mt-2 mb-4 max-w-sm">
                        To use the AI Render Tool, you need to select a Google AI API key. Video generation is a billable feature.
                    </p>
                    <button
                        onClick={handleSelectKey}
                        className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors"
                    >
                        Select API Key
                    </button>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-brand-text-secondary mt-4 hover:underline"
                    >
                        Learn more about billing
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
            <div className="flex items-center mb-4">
                <VideoIcon className="w-6 h-6 mr-3 text-brand-accent"/>
                <h2 className="text-xl font-bold text-brand-text">AI Render Tool</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-brand-text-secondary">1. Upload Car Geometry</label>
                        <div 
                            onClick={() => !isGenerating && fileInputRef.current?.click()}
                            onDragEnter={handleDragEvents} onDragOver={handleDragEvents} onDragLeave={handleDragEvents} onDrop={handleDrop}
                            className={`mt-1 flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-lg transition-colors ${!isGenerating ? 'cursor-pointer' : 'cursor-not-allowed'} ${isDragOver ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'}`}
                        >
                            <UploadCloudIcon className="w-10 h-10 text-brand-text-secondary mb-2" />
                            <p className="font-semibold text-brand-text text-sm text-center">{stepFile ? stepFile.name : 'Drag & drop STEP file'}</p>
                            <p className="text-xs text-brand-text-secondary">{stepFile ? 'File selected' : 'or click to browse'}</p>
                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} accept=".step,.stp" className="hidden" disabled={isGenerating}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="prompt" className="text-sm font-semibold text-brand-text-secondary">2. Describe the Scene</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg"
                            disabled={isGenerating}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !stepFile || !prompt}
                        className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary flex items-center justify-center"
                    >
                        {isGenerating ? <LoadingSpinner /> : <VideoIcon className="w-5 h-5" />}
                        <span className="ml-2">{isGenerating ? 'Generating...' : 'Generate Video'}</span>
                    </button>
                </div>
                <div className="bg-brand-dark p-2 rounded-lg border border-brand-border flex items-center justify-center min-h-[250px]">
                    {isGenerating && (
                        <div className="text-center">
                            <LoadingSpinner />
                            <p className="mt-4 font-semibold text-brand-text">{loadingMessage}</p>
                            <p className="text-sm text-brand-text-secondary">You can navigate away; the process will continue.</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 p-4">
                            <AlertTriangleIcon className="w-10 h-10 mx-auto mb-2"/>
                            <p className="font-bold">Generation Failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {videoUrl && (
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-md" />
                    )}
                    {!isGenerating && !error && !videoUrl && (
                        <div className="text-center text-brand-text-secondary">
                            <VideoIcon className="w-12 h-12 mx-auto mb-2"/>
                            <p>Your generated video will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiRenderTool;
