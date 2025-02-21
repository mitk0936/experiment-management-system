"use client";

import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/presentation/common/components/ui/tabs";
import { PAGE_ROUTES } from "@/core/constants/routes";
import { SignIn } from "../../presentation/modules/login/components/forms/SignIn";
import { SignUp } from "../../presentation/modules/login/components/forms/SignUp";
import { AppInfo } from "@/presentation/common/components/composite/AppInfo";
import React from "react";

export default function AuthPage() {
  return (
    <React.Fragment>
      <AppInfo />
      <div className="max-w-md mx-auto mt-10">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="login" className="w-1/2">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* LOGIN FORM */}
          <TabsContent value="login">
            <SignIn onSignedIn={() => redirect(PAGE_ROUTES.dashboard)} />
          </TabsContent>

          {/* SIGNUP FORM */}
          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </React.Fragment>
  );
}
