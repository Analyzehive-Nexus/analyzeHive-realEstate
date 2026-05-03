"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

type Project = {
  id: string;
  name: string;
  location?: string;
};

type ProjectContextType = {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const supabase = useMemo(() => createBrowserClient(), []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, location")
      .order("name");
    if (!error && data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
    const channel = supabase
      .channel("project-switcher")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchProjects())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Load from cookie on mount
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find(row => row.startsWith("project_id="))
      ?.split("=")[1];
    if (cookieValue && projects.length) {
      const found = projects.find(p => p.id === cookieValue);
      if (found) setActiveProject(found);
    }
  }, [projects]);

  // Save to cookie when changed
  const handleSetActiveProject = (project: Project | null) => {
    setActiveProject(project);
    document.cookie = `project_id=${project?.id || ""}; path=/; max-age=31536000`;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject: handleSetActiveProject,
        refreshProjects: fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
