import { formatPrice } from "@/utils";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
// import Select from "react-select";
import dynamic from "next/dynamic";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function CheckoutPanel({
  provinces,
  packagings,
  userID,
  itemSubTotal,
  strapiJWT,
}) {
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
  const [selectedCostOption, setSelectedCostOption] = useState({});
  const [cart, setCart] = useState([]);
  const [addressDetails, setAddressDetails] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState({});
  const router = useRouter();
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
      ({ service, description, cost: [{ value, etd }] }, index) => {
        return (
          <div key={index} className="text-text">
            <div className="flex items-center">
              <input
                onChange={(e) =>
                  setSelectedCostOption({
                    service: e.target.value,
                    price: value,
                  })
                }
                id={service}
                type="radio"
                value={`jne-${service}`}
                name="group-2"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              />
              <label
                for={service}
                className="ml-3 text-sm font-medium text-text"
              >
                {service + `(${description})`} -{" "}
                <span>{formatPrice(value)}</span>
              </label>
            </div>
            <p className="text-xs">Tiba dalam {etd} hari</p>
          </div>
        );
      }
    );
  };
  const generatePackagingOptions = () => {
    return packagings.map(
      ({ id, attributes: { name, description, price } }) => {
        return (
          <div key={id} className="text-text">
            <div className="flex items-center">
              <input
                onChange={(e) =>
                  setSelectedPackaging({
                    id,
                    price,
                  })
                }
                id={`packaging-${id}`}
                type="radio"
                value={id}
                name="packaging"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              />
              <label
                for={`packaging-${id}`}
                className="ml-3 text-sm font-medium text-text"
              >
                {name} - <span>{formatPrice(price)}</span>
              </label>
            </div>
            <p className="text-xs">{description}</p>
          </div>
        );
      }
    );
  };
  const getCities = async () => {
    setCityLoading(true);
    setIsCityDisabled(true);
    console.log("get cities");
    const config = {
      headers: {
        key: process.env.NEXT_PUBLIC_RAJAONGKIR_KEY,
      },
    };
    console.log(selectedProvince.value, "selected prov value");
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
    console.log("get cities");
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
      weight: calculateWeight(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince]);
  useEffect(() => {
    if (Object.keys(selectedCity).length > 0) {
      setSelectedSubdistrict({});
      setIsSubdistrictDisabled(true);
      setIsCourierDisabled(true);
      getSubdistricts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourier]);

  const options = provinces.map(({ province, province_id }) => {
    return {
      value: province_id,
      label: province,
    };
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourier) {
      alert("Pilih kurir terlebih dahulu");
      return;
    } else if (!selectedPackaging) {
      alert("Pilih packaging terlebih dahulu");
      return;
    } else if (!addressDetails) {
      alert("Masukkan alamat terlebih dahulu");
      return;
    } else if (!phoneNumber) {
      alert("Masukkan nomor telepon terlebih dahulu");
      return;
    } else if (!selectedCostOption) {
      alert("Pilih ongkos kirim terlebih dahulu");
      return;
    } else {
      const address = {
        province: selectedProvince.label,
        city: selectedCity.label,
        subdistrict: selectedSubdistrict.label,
        address_details: addressDetails,
        phone: phoneNumber,
      };
      const data = {
        cart: cart,
        address: address,
        courier: selectedCourier,
        packaging: selectedPackaging,
        user: userID,
        total:
          Number(itemSubTotal) +
          Number(selectedCostOption.price) +
          Number(selectedPackaging.price),
      };
      const res = await axios(
        // `${process.env.NEXT_PUBLIC_STRAPI_URL_DEV}orders`,
        `${process.env.NEXT_PUBLIC_STRAPI_URL}orders`,
        {
          method: "POST",
          data: {
            data: data,
          },
          headers: {
            Authorization: `Bearer ${strapiJWT}`,
          },
        }
      );

      console.log(res.data, "orderres");
      const {
        attributes: { total, uuid },
      } = res.data.data;
      console.log("bot");
      console.log(total, uuid, "total, uuid");

      const midtrans = {
        transaction_details: {
          order_id: uuid,
          gross_amount: total,
        },
        usage_limit: 2,
      };

      const midtransres = await axios(
        `https://app.sandbox.midtrans.com/snap/v1/transactions`,
        {
          method: "POST",
          data: midtrans,
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY
            ).toString("base64")}`,
          },
        }
      );
      const { token } = midtransres.data;
      console.log(midtransres.data, "midtransres");

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          router.replace(`/pesanan`);
          console.log(result);
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          alert("Mohon ditunggu!");
          console.log(result);
        },
        onError: function (result) {
          /* You may add your own implementation here */
          alert("Pembayaran gagal!");
          router.replace(`/pesanan/${uuid}`);

          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          router.replace(`/pesanan/${uuid}`);

          alert("you closed the popup without finishing the payment");
        },
      });
    }
  };
  return (
    <form className="w-1/3 p-3 overflow-y-scroll">
      <h1 className="text-3xl font-semibold pb-5 sticky top-0">
        Detail Pengiriman
      </h1>
      <div className="flex flex-col gap-y-4 pb-5">
        <h2 className="text-lg font-semibold">Alamat pengiriman</h2>
        <div className="">
          <label
            for="address-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Alamat lengkap
          </label>
          <input
            required
            onChange={(e) => {
              setAddressDetails(e.target.value);
            }}
            type="text"
            id="address-input"
            className="h-10 block text-sm p-1 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="">
          <label
            for="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
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
            className="h-10 block text-sm p-1 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="province">Provinsi</label>
          <Select
            id="province"
            onChange={(choice) => {
              setSelectedProvince(choice);
            }}
            placeholder="Pilih provinsi..."
            className=""
            options={options}
          />
        </div>
        <div>
          <label for="city">Kota</label>
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

        <div>
          <label for="subdistrict">Kecamatan</label>
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
      <h1 className="text-black text-lg font-semibold">Pilih ekspedisi</h1>
      {isCourierDisabled ? (
        <div className="text-text pb-3">
          <div className="text-red-500 text-sm">
            Atur alamat terlebih dahulu!
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-x-3">
            <div className="flex items-center">
              <input
                onChange={(e) => setSelectedCourier(e.target.value)}
                id="default-radio-1"
                type="radio"
                value="jne"
                name="default-radio"
                className="w-5 h-5 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                for="default-radio-1"
                className="ml-2 text-sm font-medium "
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
                className="w-5 h-5 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              />
              <label
                for="default-radio-2"
                className="ml-2 text-sm font-medium "
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
        <div
          className="flex flex-col gap-y-2 pb-5
        "
        >
          {generateCostOptions()}
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <h1 className="text-black text-lg font-semibold">Pilih packaging</h1>
        {generatePackagingOptions()}
      </div>
      {/* <button
        className="px-4 py-2 rounded-md bg-big text-white mt-5"
        onSubmit={handleSubmit}
        type="submit"
        name=""
        id=""
      >
        Bayar
      </button> */}
      <input onClick={(e) => handleSubmit(e)} type="submit" />
    </form>
  );
}
