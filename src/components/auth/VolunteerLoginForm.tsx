
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLogin, VolunteerLoginFormValues } from "./LoginContext";

// Define volunteer form schema
const volunteerLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z.string().min(10, { message: "Please enter a valid mobile number." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rememberMe: z.boolean().default(false),
});

export default function VolunteerLoginForm() {
  const { isLoading, handleVolunteerLogin } = useLogin();

  // Initialize volunteer form
  const volunteerForm = useForm<VolunteerLoginFormValues>({
    resolver: zodResolver(volunteerLoginSchema),
    defaultValues: {
      email: "volunteer@example.com",
      mobile: "1234567890",
      name: "John Doe",
      rememberMe: false,
    },
  });

  return (
    <Form {...volunteerForm}>
      <form onSubmit={volunteerForm.handleSubmit(handleVolunteerLogin)} className="space-y-4">
        <FormField
          control={volunteerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={volunteerForm.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={volunteerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={volunteerForm.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">Remember me</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In as Volunteer"}
        </Button>
      </form>
    </Form>
  );
}
