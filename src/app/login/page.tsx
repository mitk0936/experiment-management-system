"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/presentation/components/ui/tabs";
import { PAGE_ROUTES } from "@/presentation/routes/constants";
import SignInForm from "./__forms/signin";
import { redirect } from "next/navigation";
import SignUpForm from "./__forms/signup";
import { AppInfo } from "@/presentation/components/composite/app-info";
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
            <SignInForm onSignedIn={() => redirect(PAGE_ROUTES.dashboard)} />
          </TabsContent>

          {/* SIGNUP FORM */}
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </React.Fragment>
  );
}
