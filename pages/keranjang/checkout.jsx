import axios from "axios";
import Select from "react-select";

import { useEffect, useState } from "react";
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
  const packagingres = await axios.get(
    // `${process.env.NEXT_PUBLIC_STRAPI_URL_DEV}packagings`

    `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings`
  );
  const packagings = packagingres.data.data;
  const provinces = provinceres.data.rajaongkir.results;
  return {
    props: { provinces, packagings },
  };
}

export default function Checkout({ provinces, packagings }) {
  const [selectedProvince, setSelectedProvince] = useState({});
  const [selectedCity, setSelectedCity] = useState({});
  const [cityLoading, setCityLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState({});
  const [subdistrictLoading, setSubdistrictLoading] = useState(false);
  const [subdistrictOptions, setSubdistrictOptions] = useState([]);
  const [isCostLoading, setIsCostLoading] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [isCourierDisabled, setIsCourierDisabled] = useState(true);
  const [costOptions, setCostOptions] = useState([]);
  const [cart, setCart] = useState([]);
  const [addressDetails, setAddressDetails] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart"));
      setCart(cart);
    }
  }, []);
  const calculateWeight = () => {
    let weight = 0;
    cart.forEach((item) => {
      weight += item.amount;
    });
    return weight;
  };
  const generateCostOptions = () => {
    return costOptions.map(
      ({ service, description, cost: [{ value, etd }] }) => {
        return (
          <div>
            {service} - {description} - {value} - {etd}
          </div>
        );
      }
    );
  };
  const generatePackagingOptions = () => {
    return packagings.map(
      ({ id, attributes: { name, description, price } }) => {
        return (
          <div>
            <div className="flex items-center">
              <input
                onChange={(e) => setSelectedCourier(e.target.value)}
                id="default-radio-2"
                type="radio"
                value={id}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                {name}
              </label>
              <p>{price}</p>
              <p>{description}</p>
            </div>
          </div>
        );
      }
    );
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
      `https://pro.rajaongkir.com/api/city?province=${selectedProvince.value}`,
      config
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
      `https://pro.rajaongkir.com/api/subdistrict?city=${selectedCity.value}`,
      config
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

  const getCost = async () => {
    setIsCostLoading(true);
    const config = {
      headers: {
        key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
      },
    };
    const data = {
      origin: "6153",
      originType: "subdistrict",
      destination: selectedSubdistrict.value,
      destinationType: "subdistrict",
      weight: 100,
      courier: selectedCourier,
    };
    const costres = await axios.post(
      "https://pro.rajaongkir.com/api/cost",
      data,
      config
    );
    const costs = costres.data.rajaongkir.results[0].costs;
    setCostOptions(costs);
    setIsCostLoading(false);
  };
  useEffect(() => {
    if (Object.keys(selectedProvince).length > 0) {
      setSelectedCity({});
      setSelectedSubdistrict({});
      setIsSubdistrictDisabled(true);
      setIsCourierDisabled(true);

      getCities();
    }
  }, [selectedProvince]);
  useEffect(() => {
    if (Object.keys(selectedCity).length > 0) {
      setSelectedSubdistrict({});
      setIsSubdistrictDisabled(true);
      setIsCourierDisabled(true);
      getSubdistricts();
    }
  }, [selectedCity]);

  useEffect(() => {
    if (Object.keys(selectedSubdistrict).length > 0) {
      setIsCourierDisabled(false);
    }
  }, [selectedSubdistrict]);
  useEffect(() => {
    if (selectedCourier.length > 0) {
      getCost();
    }
  }, [selectedCourier]);

  const options = provinces.map(({ province, province_id }) => {
    return {
      value: province_id,
      label: province,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-semibold">Alamat pengiriman</h2>
        <div className="mb-6">
          <label
            htmlFor="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Alamat lengkap
          </label>
          <input
            onChange={(e) => {
              setAddressDetails(e.target.value);
            }}
            type="text"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <label htmlFor="province">Provinsi</label>
        <Select
          id="province"
          onChange={(choice) => {
            setSelectedProvince(choice);
          }}
          placeholder="Pilih provinsi..."
          className="w-[300px]"
          options={options}
        />
        <label htmlFor="city">Kota</label>
        <Select
          id="city"
          className="w-[300px]"
          onChange={(choice) => setSelectedCity(choice)}
          placeholder="Pilih kota..."
          options={cityOptions}
          value={selectedCity || null}
          isLoading={cityLoading}
          isDisabled={isCityDisabled}
        />
        <label htmlFor="subdistrict">Kecamatan</label>
        <Select
          id="subdistrict"
          className="w-[300px]"
          onChange={(choice) => setSelectedSubdistrict(choice)}
          placeholder="Pilih kecamatan..."
          options={subdistrictOptions}
          on
          value={selectedSubdistrict || null}
          isLoading={subdistrictLoading}
          isDisabled={isSubdistrictDisabled}
        />
      </div>
      {isCourierDisabled ? (
        <div>Atur alamat</div>
      ) : (
        <div>
          <h1>Pilih ekspedisi</h1>
          <div className="flex gap-x-3">
            <div className="flex items-center mb-4">
              <input
                onChange={(e) => setSelectedCourier(e.target.value)}
                id="default-radio-1"
                type="radio"
                value="jne"
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                JNE
              </label>
            </div>
            <div className="flex items-center">
              <input
                onChange={(e) => setSelectedCourier(e.target.value)}
                id="default-radio-2"
                type="radio"
                value="sicepat"
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                SiCepat
              </label>
            </div>
          </div>
        </div>
      )}
      {isCostLoading ? (
        <div>Loading...</div>
      ) : (
        <div>{generateCostOptions()}</div>
      )}
      {generatePackagingOptions()}
    </div>
  );
}
