import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRef } from "react";
import dynamic from "next/dynamic";
const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function RegisterForm({ provinces }) {
  const router = useRouter();
  const username = useRef("");
  const email = useRef("");
  const password = useRef("");
  const repeatPassword = useRef("");
  const [error, setError] = useState();
  const [httpError, setHttpError] = useState();

  const [selectedProvince, setSelectedProvince] = useState({});
  const [selectedCity, setSelectedCity] = useState({});
  const [cityLoading, setCityLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState({});
  const [subdistrictLoading, setSubdistrictLoading] = useState(false);
  const [subdistrictOptions, setSubdistrictOptions] = useState([]);
  const [addressDetails, setAddressDetails] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [penerima, setPenerima] = useState("");
  const options = provinces.map(({ province, province_id }) => {
    return {
      value: province_id,
      label: province,
    };
  });
  const checkPassword = () => {
    if (password.current !== repeatPassword.current) {
      setError("Passwords do not match");
      return false;
    }
    setError(null);
    return true;
  };
  const getCities = async () => {
    setCityLoading(true);
    setIsCityDisabled(true);
    const config = {
      headers: {
        key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
      },
    };
    const cityres = await axios.get(
      `/api/rajaongkir/city?province=${selectedProvince.value}`
    );
    const cities = cityres.data.rajaongkir.results;
    const options = cities.map(({ city_name, city_id }) => {
      return {
        value: city_id,
        label: city_name,
      };
    });
    setCityOptions(options);
    setCityLoading(false);
    setIsCityDisabled(false);

    setIsCityDisabled(false);
  };

  const getSubdistricts = async () => {
    setSubdistrictLoading(true);
    const config = {
      headers: {
        key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
      },
    };
    const subres = await axios.get(
      `/api/rajaongkir/subdistrict?city=${selectedCity.value}`
    );
    const subdistricts = subres.data.rajaongkir.results;
    const options = subdistricts.map(({ subdistrict_name, subdistrict_id }) => {
      return {
        value: subdistrict_id,
        label: subdistrict_name,
      };
    });
    setSubdistrictOptions(options);
    setSubdistrictLoading(false);
    setIsSubdistrictDisabled(false);
  };

  useEffect(() => {
    if (Object.keys(selectedProvince).length > 0) {
      setSelectedCity({});
      setSelectedSubdistrict({});
      setIsSubdistrictDisabled(true);

      getCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince]);
  useEffect(() => {
    if (Object.keys(selectedCity).length > 0) {
      setSelectedSubdistrict({});
      setIsSubdistrictDisabled(true);
      getSubdistricts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);
  const onSubmit = async (e) => {
    const alamat = {
      province: {
        label: selectedProvince.label,
        value: selectedProvince.value,
      },
      city: { label: selectedCity.label, value: selectedCity.value },
      subdistrict: {
        label: selectedSubdistrict.label,
        value: selectedSubdistrict.value,
      },
      address_details: addressDetails,
      phone: phoneNumber,
    };
    e.preventDefault();
    if (!addressDetails) {
      alert("Masukkan alamat terlebih dahulu");
      return;
    } else if (!phoneNumber) {
      alert("Masukkan nomor telepon terlebih dahulu");
      return;
    } else if (!penerima) {
      alert("Masukkan nama penerima terlebih dahulu");
    } else if (!selectedProvince.label) {
      alert("Masukkan provinsi terlebih dahulu");
    } else if (!selectedCity.label) {
      alert("Masukkan provinsi terlebih dahulu");
    } else if (!selectedSubdistrict.label) {
      alert("Masukkan provinsi terlebih dahulu");
    }
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}auth/local/register`,
        {
          method: "POST",
          data: {
            username: username.current,
            email: email.current,
            password: password.current,
            alamat: alamat,
            nama: penerima,
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
    <form
      action=""
      method="post"
      className="flex flex-col gap-y-2 w-full items-center"
    >
      <div className="flex gap-x-3 w-full justify-center">
        <div className="flex flex-col gap-y-4 pb-5 w-1/2">
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
        </div>

        <div className="flex flex-col gap-y-4 pb-5 w-1/2">
          <div className="flex flex-col gap-y-1">
            <label htmlFor="penerima-input">Nama Penerima</label>
            <input
              required
              onChange={(e) => {
                setPenerima(e.target.value);
              }}
              type="text"
              id="penerima-input"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="address-input">Alamat lengkap</label>
            <input
              required
              onChange={(e) => {
                setAddressDetails(e.target.value);
              }}
              type="text"
              id="address-input"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="phone" className=" ">
              Nomor HP
            </label>
            <input
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              required
              pattern="^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$"
              type="text"
              title="Nomor HP tidak valid."
              id="phone"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="province">Provinsi</label>
            <Select
              id="province"
              onChange={(choice) => {
                setSelectedProvince(choice);
              }}
              placeholder="Pilih provinsi..."
              options={options}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="city">Kota</label>
            <Select
              id="city"
              className=""
              onChange={(choice) => setSelectedCity(choice)}
              placeholder="Pilih kota..."
              options={cityOptions}
              value={selectedCity || null}
              isLoading={cityLoading}
              isDisabled={isCityDisabled}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="subdistrict">Kecamatan</label>
            <Select
              id="subdistrict"
              className=""
              onChange={(choice) => setSelectedSubdistrict(choice)}
              placeholder="Pilih kecamatan..."
              options={subdistrictOptions}
              on
              value={selectedSubdistrict || null}
              isLoading={subdistrictLoading}
              isDisabled={isSubdistrictDisabled}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={error}
        onClick={(e) => {
          onSubmit(e);
        }}
        className="bg-big text-white rounded-md px-4 py-2 w-[200px] text-center"
      >
        Register
      </button>
    </form>
  );
}
