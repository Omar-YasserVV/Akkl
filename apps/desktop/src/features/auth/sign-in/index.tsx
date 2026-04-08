import { useAuthStore } from "@/store/AuthStore";
import { Button, Checkbox, Input, Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";
import { z } from "zod";
import AuthStyle from "../components/AuthStyle";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Email must be a valid email address."),
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignIn() {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);

  // Zustand AuthStore
  const { login, isAuthenticated } = useAuthStore();

  if (navigation.state === "loading")
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
    watch,
  } = useForm<SignInFormData>({
    mode: "onSubmit",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const emailVal = watch("email");
  const passwordVal = watch("password");
  const rememberVal = watch("remember");

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate("/dashboard");
    } catch (err: any) {
      let errMsg = "Invalid credentials.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err.response as any)?.data?.message
      ) {
        errMsg = (err.response as any).data.message;
      }
      setError("password", { message: errMsg });
    }
  };

  return (
    <div className="relative flex bg-white">
      <div className="w-1/2 h-screen">
        <div className="full h-screen flex flex-col items-center justify-center px-20">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-400 mb-10">
              Please login to continue to your account.
            </p>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-10">
                <div>
                  <Input
                    type="text"
                    variant="bordered"
                    label="Email"
                    labelPlacement="outside"
                    classNames={{
                      innerWrapper: "px-2",
                      inputWrapper:
                        "h-15 group-data-[focus=true]:border-primary data-[hover=true]:border-primary/50 group-data-[focus=true]:data-[hover=true]:border-primary !hover:border-primary",
                      label: "bg-white px-1.5 ml-3 top-9 w-fit",
                    }}
                    placeholder="Email or phone number"
                    className="w-full text-gray-700 placeholder-[#9A9A9A]"
                    {...register("email")}
                    value={emailVal}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                </div>
                <div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    endContent={
                      showPassword ? (
                        <HiOutlineEye
                          size={20}
                          className="cursor-pointer"
                          aria-label="Hide password"
                          tabIndex={0}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <HiOutlineEyeOff
                          size={20}
                          className="cursor-pointer"
                          aria-label="Show password"
                          tabIndex={0}
                          onClick={() => setShowPassword(true)}
                        />
                      )
                    }
                    classNames={{
                      innerWrapper: "px-2",
                      inputWrapper:
                        "h-15 group-data-[focus=true]:border-primary data-[hover=true]:border-primary/50 group-data-[focus=true]:data-[hover=true]:border-primary !hover:border-primary",
                      label: "bg-white px-1.5 ml-3 top-9 w-fit",
                    }}
                    variant="bordered"
                    label="Password"
                    labelPlacement="outside"
                    className="w-full text-gray-700 placeholder-[#9A9A9A]"
                    {...register("password")}
                    value={passwordVal}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Controller
                  control={control}
                  name="remember"
                  render={({ field: { onChange, onBlur } }) => (
                    <Checkbox
                      checked={!!rememberVal}
                      onChange={onChange}
                      onBlur={onBlur}
                    >
                      Remember me
                    </Checkbox>
                  )}
                />
                <a href="#" className="text-gray-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button
                size="lg"
                radius="sm"
                type="submit"
                className="w-full bg-secondary text-white py-4 font-semibold text-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 cursor-pointer"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <AuthStyle />
    </div>
  );
}

export default SignIn;
