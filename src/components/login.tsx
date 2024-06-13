// @ts-nocheck

import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function Login() {
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setError(error);
    }
    if (data.session !== null) {
      navigate({
        to: "/",
      });
    }
  }
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <div className="relative w-full h-full">
          <img
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            height="1080"
            src="https://online.jhcsc.edu.ph/img/red.jpg"
            width="1920"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-green-700 bg-opacity-65">
            <div className="absolute top-0 left-0 flex flex-row items-center justify-start gap-3 m-8">
              <h1 className="text-2xl font-medium text-white text-ellipsis font-tight">
                JH Cerilles State College
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={form.formState.isSubmitting}
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
              {error && (
                <p className="w-full text-center text-red-500">
                  {error.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
