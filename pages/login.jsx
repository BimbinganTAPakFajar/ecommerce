import Header from "@/components/Header";
import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";
import { useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/layouts/DefaultLayout";
export async function getServerSideProps(context) {
  const config = {
    headers: {
      key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
    },
  };
  const provinceres = await axios.get(
    "https://pro.rajaongkir.com/api/province",
    config
  );
  const provinces = provinceres.data.rajaongkir.results;

  return {
    props: {
      provinces,
    },
  };
}
export default function Login({ provinces }) {
  const [title, setTitle] = useState("Login");
  const bottomText =
    title === "Login" ? "Belum punya akun? " : "Sudah punya akun? ";
  const bottomLink = title === "Login" ? "Register" : "Login";
  const generateBottomText = () => {
    return (
      <div className="text-center">
        <span>{bottomText}</span>
        <button
          onClick={() => setTitle(bottomLink)}
          className="text-big font-bold"
        >
          {bottomLink}
        </button>
      </div>
    );
  };
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <Header>{title}</Header>
      <div className="w-2/3 flex justify-center">
        {title === "Login" ? (
          <LoginForm />
        ) : (
          <RegisterForm provinces={provinces} />
        )}
      </div>
      {generateBottomText()}
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
