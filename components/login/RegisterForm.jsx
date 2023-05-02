import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRef } from "react";
export default function RegisterForm() {
  const router = useRouter();
  const username = useRef("");
  const email = useRef("");
  const password = useRef("");
  const repeatPassword = useRef("");
  const [error, setError] = useState();
  const [httpError, setHttpError] = useState();

  const checkPassword = () => {
    if (password.current !== repeatPassword.current) {
      setError("Passwords do not match");
      return false;
    }
    setError(null);
    return true;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}auth/local/register`,
        {
          method: "POST",
          data: {
            username: username.current,
            email: email.current,
            password: password.current,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        signIn();
      }
    } catch (error) {
      console.log(error);
      setHttpError(JSON.stringify(error.message));
    }
  };

  return (
    <form action="" method="post" className="flex flex-col gap-y-2">
      {httpError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-10 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{httpError}</span>
        </div>
      )}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Username</label>
        <input
          type="username"
          name="username"
          id="username"
          required
          minLength={3}
          onChange={(e) => {
            username.current = e.target.value;
          }}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
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
          required
          minLength={8}
          onChange={(e) => {
            password.current = e.target.value;
          }}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          required
          minLength={8}
          onChange={(e) => {
            repeatPassword.current = e.target.value;
            checkPassword();
          }}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <p className="text-sm text-red-600"> {error}</p>
      </div>
      <button
        type="submit"
        disabled={error}
        onClick={(e) => {
          onSubmit(e);
        }}
        className="bg-big text-white rounded-md p-2"
        s
      >
        Register
      </button>
    </form>
  );
}
