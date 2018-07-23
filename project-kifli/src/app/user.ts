import { Credentials } from "./credentials";

export class User {
    id: number;
    username: string;
    email: string;
    enabled: boolean;
    firstName: string;
    lastName: string;
    authorities: Array<string>;
    credentials: Credentials;
}
