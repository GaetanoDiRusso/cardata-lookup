import { PPerson, PPersonPrev } from "@/models/PPerson";

export class Person {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly identificationNumber: string,
        readonly dateOfBirth: string,
    ) {}

    toPresentation(): PPerson {
        return {
            id: this.id,
            name: this.name,
            identificationNumber: this.identificationNumber,
            dateOfBirth: this.dateOfBirth,
        }
    }
}

export class PersonPrev {
    constructor(
        readonly id: string,
        readonly name: string,
    ) {}

    toPresentation(): PPersonPrev {
        return {
            id: this.id,
            name: this.name,
        }
    }
}