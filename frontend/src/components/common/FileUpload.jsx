import React, { useRef, useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const FileUpload = ({ label, onFileSelect, accept = "image/*", maxFiles = 1, helperText }) => {
    const fileInputRef = useRef(null);
    const [previews, setPreviews] = useState([]);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        const validFiles = files.slice(0, maxFiles);
        const newPreviews = validFiles.map(file => ({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            url: URL.createObjectURL(file),
            type: file.type
        }));

        setPreviews(newPreviews);
        onFileSelect(validFiles);
    };

    const removeFile = (index) => {
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
        onFileSelect([]); // Simplified for now
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end px-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</label>
                {maxFiles > 1 && <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Max {maxFiles} Files</span>}
            </div>

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all cursor-pointer group
                    ${dragging ? 'border-accent bg-accent/5 scale-[0.99]' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-accent group-hover:shadow-xl'}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    multiple={maxFiles > 1}
                    className="hidden"
                />

                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-premium mb-6 group-hover:scale-110 transition-transform">
                    <Upload size={32} className={dragging ? 'text-accent' : ''} />
                </div>

                <div className="text-center space-y-2">
                    <p className="text-lg font-black text-primary tracking-tight italic uppercase">Drop files here</p>
                    <p className="text-sm font-medium text-gray-400">or click to browse your computer</p>
                </div>

                {helperText && (
                    <div className="mt-8 flex items-center gap-2 text-primary/40 font-bold text-[10px] uppercase tracking-widest">
                        <AlertCircle size={14} />
                        {helperText}
                    </div>
                )}
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                    {previews.map((file, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 group shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                {file.type.startsWith('image/') ? (
                                    <img src={file.url} className="w-full h-full object-cover" alt="preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary">
                                        <FileText size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate uppercase text-xs tracking-tight italic">{file.name}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{file.size}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-green-500">
                                    <CheckCircle2 size={24} />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(i);
                                    }}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
