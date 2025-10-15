"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { createUser, updateUser } from "@/lib/actions/users";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.enum(["admin", "editor", "user"]),
    isBlocked: z.boolean(),
  })
  .refine(
    (data) => {
      // Only validate password match if password is provided
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Only validate password length if it's being set
      if (data.password && data.password.length < 6) return false;
      return true;
    },
    {
      message: "Password must be at least 6 characters.",
      path: ["password"],
    }
  );

type UserFormValues = z.infer<typeof formSchema>;

type UserData = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor" | "user";
  is_blocked: boolean;
};

interface UserFormProps {
  user: UserData | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const isEditing = !!user;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.full_name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      role: user?.role ?? "user",
      isBlocked: user?.is_blocked ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      fullName: user?.full_name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      role: user?.role ?? "user",
      isBlocked: user?.is_blocked ?? false,
    });
  }, [user, form]);

  async function onSubmit(data: UserFormValues) {
    setLoading(true);

    try {
      if (isEditing && user) {
        // Update existing user
        const result = await updateUser(user.id, {
          fullName: data.fullName,
          role: data.role,
          isBlocked: data.isBlocked,
          ...(data.password && { password: data.password }),
        });

        if (result.error) {
          toast({
            title: "Update failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "User updated!",
            description: `${data.fullName} has been updated successfully.`,
          });
          onSuccess();
        }
      } else {
        // Create new user
        if (!data.password) {
          toast({
            title: "Password required",
            description: "Please enter a password for the new user.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const result = await createUser({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          role: data.role,
        });

        if (result.error) {
          toast({
            title: "Create failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "User created!",
            description: `${data.fullName} has been added successfully.`,
          });
          onSuccess();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  disabled={isEditing || loading}
                />
              </FormControl>
              {isEditing && (
                <FormDescription>Email cannot be changed</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password {isEditing && "(optional)"}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Minimum 6 characters"
                  }
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Admin has full access, Editor can manage content, User has
                read-only access
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isBlocked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Block Account</FormLabel>
                <FormDescription>
                  Block this user from accessing the system
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
