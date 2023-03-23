import { signIn } from "next-auth/react";
import { useRef } from "react";
export default function LoginForm() {
  const email = useRef("");
  const password = useRef("");
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await signIn("credentials", {
        username: "mel@mel.com",
        password: "password",
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  };
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
