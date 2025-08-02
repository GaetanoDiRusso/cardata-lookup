'use client';

import { useState } from 'react';
import { VehicleCard } from '@/components/VehicleCard';

// Mock data - replace with real data later
const mockVehicles = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    plateNumber: 'ABC123',
    buyerName: 'Juan Pérez',
    lastUpdated: '2024-03-15'
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    plateNumber: 'XYZ789',
    buyerName: 'María García',
    lastUpdated: '2024-03-14'
  },
  // Add more mock vehicles as needed
];

export default function MyVehicles() {
  const [vehicles] = useState(mockVehicles);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Carpetas</h1>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes vehículos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </main>
  );
} 