"use client"

import { useState, useEffect } from "react";
import NextImage from "next/image";
import dynamic from "next/dynamic";

const PhotoUploadContent = dynamic(
  () => import("./components/photo-upload-content"),
  {
    ssr: false,
    loading: () => <div className="p-6 text-center text-slate-400 font-bold">Loading upload interface...</div>
  }
);
import { useToast } from "@/components/ui/toast";
import { 
  uploadSitePhoto, 
  deleteSitePhoto,
  fetchSitePhotos 
} from "@/app/construction/actions";
import { 
  Camera, Upload, Plus, Trash2, Search, Image as ImageIcon, Calendar, 
  User, Folder, AlertTriangle, Loader2, Maximize2, X, Copy, Check 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function PhotosClient({ 
  initialPhotos, 
  tableMissing, 
  tableSql 
}: { 
  initialPhotos: any[], 
  tableMissing: boolean, 
  tableSql: string 
}) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [dbMissing, setDbMissing] = useState(tableMissing);
  const [missingSql, setMissingSql] = useState(tableSql);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("Staff");

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift() || "");
      return null;
    };
    const name = getCookie("user_name");
    if (name) {
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, []);

  // Filters State
  const [filterProject, setFilterProject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [projectName, setProjectName] = useState("Tower A");

  const handleCopySql = () => {
    navigator.clipboard.writeText(missingSql || `CREATE TABLE IF NOT EXISTS site_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  project_name TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`);
    setCopied(true);
    toast({
      title: "SQL Copied",
      description: "Database table schema has been copied to your clipboard!"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select an image file to upload.",
        variant: "destructive"
      });
      return;
    }
    if (!projectName) {
      toast({
        title: "Validation Error",
        description: "Please select a target project/tower.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("caption", caption);
    fd.append("projectName", projectName);
    fd.append("uploadedBy", "workos-site-001");

    const res = await uploadSitePhoto(fd);
    setIsUploading(false);

    if (res.error) {
      if (res.tableMissing) {
        setDbMissing(true);
        setMissingSql(res.sql || '');
      }
      toast({
        title: "Upload Failed",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Photo Saved",
        description: "Your site progress photo has been successfully uploaded and cataloged!"
      });
      setIsUploadOpen(false);
      
      // Reset form
      setSelectedFile(null);
      setFilePreview("");
      setCaption("");
      setProjectName("Tower A");

      // Instantly prepend the new photo to local state for instantaneous visual feedback
      if (res.data) {
        const newPhoto = {
          ...res.data,
          uploaded_by_user: { name: userName }
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setDbMissing(false);
      }
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to permanently delete this site photo?")) return;

    // Extract storage path from url
    let storagePath = "";
    try {
      const parts = url.split("/");
      storagePath = parts[parts.length - 1];
    } catch (e) {
      console.error("Could not parse storage path:", e);
    }

    const res = await deleteSitePhoto(id, storagePath);
    if (res.error) {
      toast({
        title: "Delete Failed",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Photo Removed",
        description: "The site photo has been permanently removed."
      });
      
      // Instantly remove photo from local state for instantaneous deletion feedback
      setPhotos(prev => prev.filter(p => p.id !== id));
    }
  };

  // KPI Calculations
  const totalPhotos = photos.length;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const uploadedThisWeek = photos.filter(p => new Date(p.created_at) >= oneWeekAgo).length;

  const latestPhotoDate = photos.length > 0
    ? new Date(photos[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "None";

  const uniqueProjectsCount = Array.from(new Set(photos.map(p => p.project_name))).filter(Boolean).length;

  // Filter project dropdown options
  const projectOptions = Array.from(new Set(photos.map(p => p.project_name))).filter(Boolean);

  // Apply filters
  const filteredPhotos = photos.filter(p => {
    const matchProject = filterProject === "all" || p.project_name === filterProject;
    const matchSearch = !searchQuery || (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchProject && matchSearch;
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Site Progress Photos</h1>
          <p className="text-sm text-slate-500">Document construction visual timelines, upload field reports, and track structure milestones.</p>
        </div>
        {!dbMissing && (
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold px-5"
          >
            <Camera className="w-4 h-4" /> Upload New Photo
          </Button>
        )}
      </div>

      {/* DB MISSING WARNING PANEL */}
      {dbMissing && (
        <section className="bg-amber-50 border border-amber-200 p-6 rounded-[16px] space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-lg">Database Setup Required</h3>
              <p className="text-sm text-amber-700 mt-1">
                The database table <code>site_photos</code> does not exist yet. Please paste the following schema statement into your **Supabase Dashboard SQL Editor** to enable photo uploads and metadata saving:
              </p>
            </div>
          </div>
          
          <div className="relative bg-slate-900 rounded-[12px] p-4 text-[13px] font-mono text-slate-100 overflow-x-auto border border-slate-800 shadow-inner group">
            <button 
              onClick={handleCopySql}
              className="absolute right-3 top-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-[8px] border border-slate-700 transition-all flex items-center gap-1.5 font-sans text-[11px] font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy SQL"}
            </button>
            <pre className="pr-20 whitespace-pre">{missingSql || `CREATE TABLE IF NOT EXISTS site_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  project_name TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
          </div>
          <p className="text-xs text-amber-600 italic">
            Once you execute the SQL code in Supabase, this panel will disappear automatically as soon as you submit your first photo.
          </p>
        </section>
      )}

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Photos</p>
            <div className="flex items-center gap-3">
               <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight">{totalPhotos}</h3>
               <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shadow-none border-none text-[10px] font-bold">Real-time</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Uploaded This Week</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{uploadedThisWeek}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Latest Upload</p>
            <h3 className="text-[20px] font-bold text-slate-800 leading-tight py-1.5 truncate">{latestPhotoDate}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#8B5CF6]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Projects Mapped</p>
            <h3 className="text-[32px] font-bold text-[#8B5CF6] leading-tight">{uniqueProjectsCount}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search captions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] bg-white w-full" 
            />
          </div>
          
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Projects</SelectItem>
              {projectOptions.map((proj: any, idx) => (
                <SelectItem key={idx} value={proj}>{proj}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* PHOTOS GALLERY GRID */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => {
            const formattedDate = new Date(photo.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <InteractivePearlCard key={photo.id} className="group relative flex flex-col cursor-pointer border border-[#E8ECF0]">
                {/* Image Section */}
                <div 
                  className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <NextImage 
                    src={photo.url} 
                    alt={photo.caption || "Site progress photo"} 
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full border border-white/40">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-black/60 text-white border-none text-[10px] font-bold py-1 px-2.5 backdrop-blur-md">
                    {photo.project_name}
                  </Badge>
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col flex-1 bg-white relative">
                  <p className="text-[13px] font-bold text-slate-800 line-clamp-2 min-h-[38px]">
                    {photo.caption || <span className="text-slate-400 italic">No description provided</span>}
                  </p>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 border-t border-[#F1F5F9] pt-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-500">
                      <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{photo.uploaded_by_user?.name || photo.uploaded_by || "Staff"}</span>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id, photo.url);
                    }}
                    className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full shadow-sm border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </InteractivePearlCard>
            )
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 text-slate-400 bg-white border border-slate-100 rounded-[16px] font-medium text-sm flex flex-col items-center justify-center gap-3">
            <ImageIcon className="w-12 h-12 text-slate-200" />
            <span>No progress photos logged yet or matching the filters.</span>
          </div>
        )}
      </section>

      {/* UPLOAD DIALOG */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-slate-100 shadow-2xl rounded-[24px] overflow-hidden p-6 gap-6">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                <Camera className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Upload Progress Photo</DialogTitle>
                <p className="text-[11px] text-[#64748B] mt-0.5">Save progress snapshot with location metadata.</p>
              </div>
            </div>
          </DialogHeader>

          {isUploadOpen && (
            <PhotoUploadContent
              filePreview={filePreview}
              handleFileChange={handleFileChange}
              projectName={projectName}
              setProjectName={setProjectName}
              caption={caption}
              setCaption={setCaption}
              handleUpload={handleUpload}
              isUploading={isUploading}
              setIsUploadOpen={setIsUploadOpen}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* FULL PHOTO VIEW DIALOG */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-[800px] p-0 overflow-hidden bg-slate-950 border-none shadow-2xl rounded-[16px] relative">
          {selectedPhoto && (
            <div className="flex flex-col">
              {/* Close Button overlay */}
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-[4/3] md:aspect-[16/10] w-full relative bg-slate-900 flex items-center justify-center">
                <NextImage 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.caption || "Zoom view"} 
                  fill
                  unoptimized
                  className="object-contain"
                />
                <Badge className="absolute top-4 left-4 bg-black/60 text-white border-none text-[11px] font-bold py-1 px-2.5 backdrop-blur-md">
                  {selectedPhoto.project_name}
                </Badge>
              </div>

              <div className="p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-slate-100">
                <div className="space-y-1 max-w-[80%]">
                  <h4 className="font-bold text-slate-800 text-[15px]">
                    {selectedPhoto.caption || <span className="text-slate-400 italic">No description provided</span>}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-300" /> {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-300" /> {selectedPhoto.uploaded_by_user?.name || selectedPhoto.uploaded_by || "Staff"}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.open(selectedPhoto.url, '_blank')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold rounded-[8px] flex gap-1.5 h-9 shrink-0"
                >
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
