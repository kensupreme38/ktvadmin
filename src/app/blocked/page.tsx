"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldBan } from "lucide-react";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <ShieldBan className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Account Blocked</CardTitle>
          <CardDescription>
            Your account has been blocked by an administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ShieldBan className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Your account access has been restricted. You cannot log in or use
              the system at this time.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Why was my account blocked?</strong>
            </p>
            <p>
              Your account may have been blocked due to a violation of our terms
              of service, suspicious activity, or by administrative decision.
            </p>
            <p className="mt-4">
              <strong>What should I do?</strong>
            </p>
            <p>
              Please contact the system administrator for more information about
              why your account was blocked and how to resolve this issue.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href="/contact">Contact Administrator</Link>
          </Button>
          <Button asChild className="w-full" variant="ghost">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

