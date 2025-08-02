import { PPerson } from '@/models/PPerson';
import { Person, PersonPrev } from '@/server/domain/entities/Person';
import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
    identificationNumber: {
        type: String,
        required: [true, 'Please provide the identification number'],
    },
    name: {
        type: String,
        required: [true, 'Please provide the person name'],
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Please provide the date of birth'],
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: false, // This is because we need to create the person before the folder
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

// Create a compound unique index on identificationNumber and folderId
PersonSchema.index({ identificationNumber: 1, folderId: 1 }, { unique: true });

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
