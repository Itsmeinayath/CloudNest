"use client";

import { motion } from "framer-motion";
import { 
  Folder, 
  Image, 
  FileText, 
  Download, 
  Share2, 
  Star, 
  Grid3X3, 
  List,
  Search,
  Plus,
  MoreHorizontal
} from "lucide-react";

export default function DashboardPreview() {
  const files = [
    { name: "Project Documents", type: "folder", icon: Folder, color: "text-blue-400" },
    { name: "vacation-2024.jpg", type: "image", icon: Image, color: "text-green-400", size: "2.4 MB" },
    { name: "presentation.pdf", type: "document", icon: FileText, color: "text-red-400", size: "1.8 MB" },
    { name: "Design Assets", type: "folder", icon: Folder, color: "text-purple-400" },
    { name: "report.docx", type: "document", icon: FileText, color: "text-blue-400", size: "512 KB" },
    { name: "team-photo.png", type: "image", icon: Image, color: "text-green-400", size: "3.1 MB" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-t-2xl border border-gray-700/50 border-b-0 p-4 lg:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">My Files</h2>
            <p className="text-gray-400 text-sm lg:text-base">Manage and organize your cloud storage</p>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative flex-1 lg:flex-none">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-500/50 transition-colors w-full lg:w-64"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-gray-800/40 rounded-b-2xl border border-gray-700/50 border-t-0 backdrop-blur-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-700/30">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="text-sm text-gray-400">{files.length} items</span>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button className="p-2 text-purple-400 bg-purple-500/10 rounded-lg">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="p-4 lg:p-6">
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
              >
                <file.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${file.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate text-sm lg:text-base">{file.name}</p>
                  {file.size && (
                    <p className="text-gray-400 text-xs lg:text-sm">{file.size}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-yellow-400 transition-colors">
                    <Star className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Storage Stats */}
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-700/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Storage used</span>
            <span className="text-white font-medium">2.4 GB of 100 GB</span>
          </div>
          <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '2.4%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}