import { randomUUID } from "crypto";

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

export class User implements IUser {
  id: string;
  email: string;
  name: string;
  password: string;

  constructor({ id, email, name, password }: IUser) {
    this.id = id || User.generateUserId();
    this.email = email;
    this.name = name;
    this.password = password;
  }

  static generateUserId(): string {
    return `usr_${randomUUID()}`;
  }

  toDto(): IUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
    };
  }

  async getHashedPassword() {
    // Static imports might cause issues with bcryptjs in certain next.js environments
    const bcrypt = await import("bcryptjs");
    return await bcrypt.hash(this.password, 10);
  }

  async checkPassword(inputPassword: string) {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(inputPassword, this.password);
  }
}
