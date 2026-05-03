"use client";

import { useProject } from "@/lib/contexts/ProjectContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

export function ProjectSwitcher() {
  const { projects, activeProject, setActiveProject } = useProject();

  return (
    <div className="px-3 py-2 border-b border-slate-700/50">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
        <Building2 className="h-3 w-3" />
        <span>Current Project</span>
      </div>
      <Select
        value={activeProject?.id || "all"}
        onValueChange={(val) => {
          if (val === "all") setActiveProject(null);
          else {
            const project = projects.find(p => p.id === val);
            if (project) setActiveProject(project);
          }
        }}
      >
        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 text-white">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">📊 All Projects (MD view)</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
