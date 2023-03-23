import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRef } from "react";
export default function LoginForm() {
  const router = useRouter();
  const email = useRef("");
  const password = useRef("");
  const [error, setError] = useState();
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username: email.current,
      password: password.current,
      redirect: false,
      callbackUrl: "/",
    });
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error);
    }
  };
  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-10 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  return (
    <form action="" method="post" className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => {
            email.current = e.target.value;
          }}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => {
            password.current = e.target.value;
          }}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        onClick={(e) => {
          onSubmit(e);
        }}
        className="bg-big text-white rounded-md p-2"
      >
        Login
      </button>
    </form>
  );
}
