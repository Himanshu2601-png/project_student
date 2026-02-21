import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Search } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  description: string;
  branch: string;
  semester: number;
  subject: string;
  year: number;
  file_url: string;
  uploader_name: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Add more filters here if needed */}
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-10">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{resource.subject}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 truncate">{resource.title}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-indigo-700 hover:text-indigo-900">
                    {resource.branch} - Sem {resource.semester}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Uploaded by {resource.uploader_name}</p>
                  <a 
                    href={resource.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    <Download className="mr-1 h-3 w-3" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No resources found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
