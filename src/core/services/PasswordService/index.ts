import bcrypt from "bcryptjs";

export class PasswordService {
  private static saltRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  static async checkPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}
