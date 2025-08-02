import { PUser } from "@/models/PUser";

export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly googleId: string,
        readonly balance: number,
        readonly password?: string,
    ){}

    toPresentation(): PUser {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            balance: this.balance,
        }
    }
}