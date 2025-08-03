import { PPerson } from '@/models/PPerson';
import { Person, PersonPrev } from '@/server/domain/entities/Person';
import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: false, // Optional - will be updated after folder creation
    },
    identificationNumber: {
        type: String,
        required: [true, 'Please provide the identification number'],
        // Not unique - same person can appear in multiple folders
    },
    name: {
        type: String,
        required: [true, 'Please provide the person name'],
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Please provide the date of birth'],
    },
    role: {
        type: String,
        enum: ['seller', 'buyer'],
        required: [true, 'Please specify the role in this folder'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index on identificationNumber, folderId, and role to ensure uniqueness per folder
PersonSchema.index({ identificationNumber: 1, folderId: 1, role: 1 }, { unique: true });

// Create an index on identificationNumber to easily find all instances of the same person
PersonSchema.index({ identificationNumber: 1 });

export const PersonSchemaToDomain = (person: any): Person => {
    return new Person(
        person._id.toString(),
        person.identificationNumber,
        person.name,
        person.dateOfBirth,
    )
}

export const PersonSchemaToPrevDomain = (person: any): PersonPrev => {
    return new PersonPrev(
        person._id.toString(),
        person.name,
        person.identificationNumber,
    )
}

export default mongoose.models.Person || mongoose.model('Person', PersonSchema); 

export const PersonSchemaToPPerson = (person: any): PPerson => {
    return {
        id: person._id.toString(),
        identificationNumber: person.identificationNumber,
        name: person.name,
        dateOfBirth: person.dateOfBirth,
    };
};
