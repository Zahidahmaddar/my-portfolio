'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github, 
  Calendar,
  Mail,
  MessageSquare,
  FolderOpen,
  BarChart3
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminProjectForm from '@/components/admin/AdminProjectForm';
import { Project } from '@/types/Project';

interface Submission {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface User {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  
  const router = useRouter();
  
  // Create a wrapper component for useSearchParams to use with Suspense
  const SearchParamsWrapper = () => {
    const params = useSearchParams();
    const tab = params.get('tab');
    
    // Set active tab based on URL parameter if it exists
    useEffect(() => {
      if (tab && (tab === 'overview' || tab === 'projects' || tab === 'messages')) {
        setActiveTab(tab);
      }
    }, [tab]);
    
    return null;
  };

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // Tab handling moved to SearchParamsWrapper component

  // Load projects and submissions
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load projects
      const projectsResponse = await fetch('/api/projects', {
        credentials: 'include',
      });
      const projectsData = await projectsResponse.json();
      if (projectsData.success) {
        setProjects(projectsData.data);
      }

      // Load submissions
      const submissionsResponse = await fetch('/api/contact', {
        credentials: 'include',
      });
      const submissionsData = await submissionsResponse.json();
      if (submissionsData.success) {
        setSubmissions(submissionsData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p._id !== projectId));
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleProjectSave = (savedProject: Project) => {
    if (editingProject) {
      setProjects(projects.map(p => p._id === savedProject._id ? savedProject : p));
    } else {
      setProjects([savedProject, ...projects]);
    }
    setEditingProject(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Wrap SearchParamsWrapper in Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsWrapper />
      </Suspense>
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-50 lg:w-64">
        <AdminSidebar user={user} />
      </div>
      
      {/* Mobile sidebar - only visible on mobile */}
      <div className="lg:hidden">
        <AdminSidebar user={user} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your portfolio content and view messages
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'projects', name: 'Projects', icon: FolderOpen },
                { id: 'messages', name: 'Messages', icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--card-border)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Total Projects
                          </p>
                          <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
                            {projects.length}
                          </p>
                        </div>
                        <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--card-border)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Total Messages
                          </p>
                          <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
                            {submissions.length}
                          </p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--card-border)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Recent Messages
                          </p>
                          <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
                            {submissions.filter(s => 
                              new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            ).length}
                          </p>
                        </div>
                        <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--card-border)' }}>
                    <div className="p-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--card-text)' }}>
                        Recent Activity
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {submissions.slice(0, 5).map((submission) => (
                          <div key={submission._id} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm" style={{ color: 'var(--card-text)' }}>
                                New message from <strong>{submission.name}</strong>
                              </p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {formatDate(submission.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {submissions.length === 0 && (
                          <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                            No recent activity
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Projects
                    </h2>
                    <button
                      onClick={() => {
                        setEditingProject(undefined);
                        setIsProjectFormOpen(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project._id || `project-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                      >
                        <div className="relative h-48">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingProject(project);
                                setIsProjectFormOpen(true);
                              }}
                              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => project._id && handleDeleteProject(project._id)}
                              className="p-2 bg-white/90 rounded-lg hover:bg-white text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tech.slice(0, 3).map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                +{project.tech.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {project.repoUrl && (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <Github size={14} />
                                <span>Code</span>
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <ExternalLink size={14} />
                                <span>Live</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {projects.length === 0 && (
                    <div className="text-center py-12">
                      <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No projects yet. Add your first project to get started!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Contact Messages
                  </h2>

                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <motion.div
                        key={submission._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {submission.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {submission.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={14} />
                            <span>{formatDate(submission.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {submission.message}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {submissions.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No messages yet. Messages will appear here when visitors contact you.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Project Form Modal */}
      <AdminProjectForm
        project={editingProject}
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(undefined);
        }}
        onSave={handleProjectSave}
      />
    </div>
  );
}
