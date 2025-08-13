import React from 'react';

const FolderDetailLoading = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-64"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>

      <div className="space-y-8">
        {/* Basic Information Section Skeleton */}
        <section>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </section>

        {/* Data Retrieval Section Skeleton */}
        <section>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FolderDetailLoading; 