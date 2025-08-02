import { ServerActionError } from "@/models/ServerActionError";

export type ServerActionResponse<T> = {
    ok: boolean;
    error?: ServerActionError;
    data?: T;
}
