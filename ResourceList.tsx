import React, { useEffect, useState } from 'react';
import { Filter, Search, Download, FileText } from 'lucide-react';

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

const ResourceList = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    subject: '',
    year: '',
    search: '',
  });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.semester) queryParams.append('semester', filters.semester);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/resources?${queryParams.toString()}`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Resources</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="pl-9 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <select
            name="branch"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={filters.branch}
            onChange={handleFilterChange}
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          <select
            name="semester"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={filters.semester}
            onChange={handleFilterChange}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Sem {sem}</option>
            ))}
          </select>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={filters.subject}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={filters.year}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <li key={resource.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-600 truncate">{resource.title}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate">{resource.subject}</span>
                          <span className="mx-1">&bull;</span>
                          <span>{resource.branch} (Sem {resource.semester})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 flex-shrink-0 flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <Download className="mr-1 h-4 w-4" /> Download
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {resource.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Uploaded by {resource.uploader_name} on {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {resources.length === 0 && (
              <li className="px-4 py-10 text-center text-gray-500">No resources found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
