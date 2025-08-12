import { PFolder } from '@/models/PFolder';
import { DataRetrievalCard } from './DataRetrievalCard';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { DefaultSession } from 'next-auth';

export type DataRetrievalSectionProps = {
  folder: PFolder;
  user?: DefaultSession['user']; // Using any for now, we can refine this later
  addNewDataRetrieval: (dataRetrieval: PVehicleDataRetrieval) => void;
}

const DATA_RETRIEVAL_TYPES: { type: VehicleDataRetrievalType; label: string; description: string }[] = [
  {
    type: 'infracciones',
    label: 'Infracciones',
    description: 'Consulta de infracciones de tránsito'
  },
  {
    type: 'deuda',
    label: 'Deuda',
    description: 'Consulta de deudas pendientes'
  },
  {
    type: 'solicitar_certificado',
    label: 'Solicitar Certificado',
    description: 'Solicitud de certificado (luego de solicitado, debe hacer el pago del mismo para poder emitir el certificado)'
  },
  {
    type: 'certificado_sucive',
    label: 'Descargar certificado SUCIVE',
    description: 'Descarga el certificado SUCIVE (debe haberlo solicitado previamente y haber pagado el mismo)'
  },
  {
    type: 'consultar_matricula',
    label: 'Consultar Matrícula',
    description: 'Consulta de estado de matrícula'
  },
  {
    type: 'consultar_convenio',
    label: 'Consultar Convenio',
    description: 'Consulta de convenios de pago'
  }
];

export const DataRetrievalSection = ({ folder, user, addNewDataRetrieval }: DataRetrievalSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-gray-600">
          Consulta diferentes tipos de datos relacionados con el vehículo. 
          Los resultados se guardan automáticamente y puedes consultarlos nuevamente.
        </p>
      </div>

      <div className="space-y-4">
        {DATA_RETRIEVAL_TYPES.map((retrievalType) => (
          <DataRetrievalCard
            key={retrievalType.type}
            folderId={folder.id}
            retrievalType={retrievalType.type}
            label={retrievalType.label}
            description={retrievalType.description}
            existingRetrievals={folder.vehicleDataRetrievals.filter(
              retrieval => retrieval.dataRetrievalType === retrievalType.type
            )}
            user={user}
            addNewDataRetrieval={addNewDataRetrieval}
          />
        ))}
      </div>
    </div>
  );
}; 