import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import NavigationBar from "@/components/NavigationBar";
import RegisterForm from "@/components/RegisterForm";
import { useState } from "react";

export default function Login() {
  const [title, setTitle] = useState("Login");
  const bottomText =
    title === "Login" ? "Belum punya akun?" : "Sudah punya akun?";
  const bottomLink = title === "Login" ? "Register" : "Login";
  const generateBottomText = () => {
    return (
      <>
        <span>{bottomText}</span>
        <button
          onClick={() => setTitle(bottomLink)}
          className="text-big font-bold"
        >
          {bottomLink}
        </button>
      </>
    );
  };
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <Header>{title}</Header>
      <div className="">
        {title === "Login" ? <LoginForm /> : <RegisterForm />}
        {generateBottomText()}
      </div>
    </div>
  );
}
