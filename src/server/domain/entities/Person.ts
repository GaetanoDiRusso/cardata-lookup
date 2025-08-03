import { PPerson, PPersonPrev } from "@/models/PPerson";

export class Person {
    constructor(
        readonly id: string,
        readonly identificationNumber: string,
        readonly name: string,
        readonly dateOfBirth: string,
    ) {}

    toPresentation(): PPerson {
        return {
            id: this.id,
            identificationNumber: this.identificationNumber,
            name: this.name,
            dateOfBirth: this.dateOfBirth,
        }
    }
}

export class PersonPrev {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly identificationNumber: string,
    ) {}

    toPresentation(): PPersonPrev {
        return {
            id: this.id,
            name: this.name,
            identificationNumber: this.identificationNumber,
        }
    }
}