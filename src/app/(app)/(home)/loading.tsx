import React from 'react';

const HomeLoading = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Carpetas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6 h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="space-y-3 mt-auto">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default HomeLoading; 