"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Upload, Loader2 } from "lucide-react";
import NextImage from "next/image";

interface PhotoUploadContentProps {
  filePreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  caption: string;
  setCaption: (val: string) => void;
  handleUpload: () => void;
  isUploading: boolean;
  setIsUploadOpen: (open: boolean) => void;
}

export default function PhotoUploadContent({
  filePreview,
  handleFileChange,
  projectName,
  setProjectName,
  caption,
  setCaption,
  handleUpload,
  isUploading,
  setIsUploadOpen
}: PhotoUploadContentProps) {
  return (
    <>
      <div className="grid gap-5">
        {/* File Drag / Selector Box */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Progress Image</Label>
          <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#6366F1] rounded-[16px] p-6 text-center cursor-pointer transition-all bg-[#FAFBFC] hover:bg-indigo-50/10 relative group min-h-[160px] flex items-center justify-center">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
            />
            {!filePreview ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-[#6366F1] group-hover:shadow-indigo-100/40 group-hover:shadow-md transition-all duration-200">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#6366F1] transition-colors" />
                </div>
                <div>
                  <p className="text-[13px] text-slate-600 font-semibold">Drag and drop image, or <span className="text-[#6366F1] hover:underline">browse file</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports High-res PNG, JPG, JPEG up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full max-h-[180px] rounded-[12px] overflow-hidden border border-[#E2E8F0] shadow-md group/preview">
                <NextImage src={filePreview} alt="Preview" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/95 text-slate-800 border-none rounded-full px-4 h-8 shadow-md font-bold text-xs hover:scale-105 transition-transform"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project / Tower Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project / Tower</Label>
          <Select value={projectName} onValueChange={setProjectName}>
            <SelectTrigger className="rounded-[10px] bg-white border-[#E2E8F0] focus:ring-2 focus:ring-[#0066FF]/10 focus:border-[#0066FF] shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Tower A">Tower A</SelectItem>
              <SelectItem value="Tower B">Tower B</SelectItem>
              <SelectItem value="Tower C">Tower C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description Caption */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Caption</Label>
          <Input 
            placeholder="e.g. Reinforced brick lining Floor 12 completed"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded-[10px] bg-white border-[#E2E8F0] focus:ring-2 focus:ring-[#0066FF]/10 focus:border-[#0066FF] h-10 text-[13px] shadow-sm" 
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
        <Button 
          variant="outline" 
          className="rounded-[10px] h-10 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors" 
          onClick={() => setIsUploadOpen(false)}
        >
          Cancel
        </Button>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[10px] h-10 font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
              Saving Asset...
            </>
          ) : (
            "Upload Progress Photo"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
