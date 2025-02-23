"use server";

import { User } from "@/core/entities/User";
import { logError } from "@/core/utils/logger";
import { MESSAGES } from "@/presentation/constants/messages";
import { SignUpFormData, signUpFormSchema } from "../../../core/validation/signup/schema";
import { UserRepository } from "@/core/repositories/User/UserRepository";
import { PasswordService } from "@/core/services/PasswordService";
import { extractZodErrors } from "@/core/validation/utils";
import { APIResponse } from "@/core/types/api";

export async function signUp(data: SignUpFormData): Promise<APIResponse<object, SignUpFormData>> {
  try {
    // 1. Handle srever side validations on the submitted data
    const validation = signUpFormSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        fieldErrors: (extractZodErrors(validation) as SignUpFormData) ?? {},
      };
    }

    // 2. Validation passed, checking if the user already exists
    const { name, email, password } = validation.data;
    const userExists = await UserRepository.getUserByEmail(email);

    if (userExists) {
      return {
        success: false,
        error: MESSAGES.UserAlreadyExists,
      };
    }

    // 3. Proceed with creating a new user
    const id = User.generateUserId();
    const hashedPassword = await PasswordService.hashPassword(password);
    const user = new User({ id, email, name, password: hashedPassword });

    await UserRepository.createUser(user);

    return {
      success: true,
      data: {},
    };
  } catch (err) {
    logError("Unable to sign up user.", err, "actions (handleSignup)");

    return {
      success: false,
      error: MESSAGES.SignupErrorOccured,
    };
  }
}
