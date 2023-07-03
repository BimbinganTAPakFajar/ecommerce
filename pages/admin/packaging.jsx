import axios from "axios";
import "moment/locale/id";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "@/components/layouts/AdminLayout";
import SuccessAlert from "@/components/SuccessAlert";
import LoadingBlocker from "@/components/LoadingBlocker";
import { formatPrice } from "@/utils";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session, "SESSION");
  const userID = session.user.user.id;
  console.log(session.user.user.id, "INI USER");
  const strapiJWT = session.user.jwt;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings?populate=*`
  );

  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/${session.user.user.id}?populate=*`
  );
  const userRole = user.data.role.name;
  const packagings = res.data.data;

  return {
    props: {
      packagings,
      strapiJWT,
      userRole,
    },
  };
}

export default function Packaging({ packagings, strapiJWT, userRole }) {
  const moment = require("moment");
  moment.locale("id");
  const [isAddPackagingOpen, setIsAddPackagingOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUpdatePackagingOpen, setIsUpdatePackagingOpen] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState({});
  const [currentPackagings, setCurrentPackagings] = useState(packagings);
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpenUpdate = (id, name, desc, price) => {
    setSelectedPackaging({ id, name, desc, price });
    setIsUpdatePackagingOpen(true);
  };

  const updatePackagings = async () => {
    let res;
    setIsLoading(true);
    try {
      res = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings?populate=*`
      );
    } catch (error) {
      console.log("UPDATE PACKAGING ERROR: ", error);
    } finally {
      setIsLoading(false);
    }

    const packagings = res.data.data;
    setCurrentPackagings(packagings);
  };

  const handlePackagingUpdateButton = async (id) => {
    setIsLoading(true);
    const data = {};
    if (nameInput !== "") {
      data.name = nameInput;
    }
    if (descInput !== "") {
      data.description = descInput;
    }
    if (priceInput !== "") {
      data.price = priceInput;
    }

    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings/${id}`,
        {
          method: "PUT",
          data: {
            data: data,
          },
          headers: {
            Authorization: `Bearer ${strapiJWT}`,
          },
        }
      );
      console.log(res);
      await updatePackagings();
      setAlertMessage("Packaging berhasil diupdate");
      setIsUpdatePackagingOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAlertOpen === true) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000);
    }
  }, [isAlertOpen]);

  const handleDeletePackaging = async (id) => {
    let res;
    setIsLoading(true);
    try {
      res = await axios.delete(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}packagings/${id}`
      );
      await updatePackagings();
      setAlertMessage("Packaging berhasil dihapus");
      setIsAlertOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderRows = () => {
    return currentPackagings.map(
      ({ id, attributes: { name, description, price } }) => {
        return (
          <tr key={`pack-${id}`} className="bg-white border-b    ">
            <th
              scope="row"
              className="px-6 py-4 font-medium  whitespace-nowrap   cursor-pointer hover:underline"
            >
              {name}
            </th>
            <td className="px-6 py-4">{description}</td>
            <td className="px-6 py-4">{formatPrice(price)}</td>

            <td className="px-6 py-4 flex gap-x-3">
              <button
                onClick={() => handleOpenUpdate(id, name, description, price)}
                className="font-medium text-blue-600   hover:underline"
              >
                Update Packaging
              </button>
              <button
                onClick={() => handleDeletePackaging(id)}
                className="font-medium text-red-600  hover:underline"
              >
                Hapus Packaging
              </button>
            </td>
          </tr>
        );
      }
    );
  };
  const handleAddPackaging = async () => {
    setIsLoading(true);
    let res;
    if (!nameInput || !descInput || !priceInput) {
      alert("Mohon isi semua field");
      setIsLoading(false);
      return;
    }
    const newPackaging = {
      name: nameInput,
      description: descInput,
      price: priceInput,
    };
    console.log(newPackaging, "newpack");
    try {
      res = await axios(`${process.env.NEXT_PUBLIC_STRAPI_URL}packagings`, {
        method: "POST",
        data: {
          data: newPackaging,
        },
        headers: {
          Authorization: `Bearer ${strapiJWT}`,
        },
      });
      console.log(res.data, "RESS");
      await updatePackagings();
      setAlertMessage("Packaging berhasil ditambahkan");
    } catch (error) {
      console.log(error);
    } finally {
      setNameInput("");
      setDescInput("");
      setPriceInput("");
      setIsAddPackagingOpen(false);
      setIsAlertOpen(true);

      setIsLoading(false);
    }
  };
  if (userRole !== "Admin")
    return (
      <div className="py-10">Anda tidak memiliki akses ke halaman ini</div>
    );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <button
        className="w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
        onClick={(e) => {
          e.preventDefault();
          setIsAddPackagingOpen(true);
        }}
      >
        Tambah Packaging Baru
      </button>

      <SuccessAlert
        message={alertMessage}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
      <LoadingBlocker isOpen={isLoading} />
      {isAddPackagingOpen && (
        <div
          id="authentication-modal2"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow  ">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
                data-modal-hide="authentication-modal"
                onClick={() => {
                  setNameInput("");
                  setDescInput("");
                  setPriceInput("");
                  setIsAddPackagingOpen(false);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium   ">
                  Tambah Packaging Baru
                </h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label
                      for="Name"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Nama Packaging
                    </label>
                    <input
                      type="text"
                      name="Name"
                      id="Name"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="Desc"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Deskripsi Packaging
                    </label>
                    <input
                      type="text"
                      name="Desc"
                      id="Desc"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      onChange={(e) => setDescInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="Price"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Harga
                    </label>
                    <input
                      type="number"
                      name="Price"
                      id="Price"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      onChange={(e) => setPriceInput(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddPackaging();
                    }}
                  >
                    Tambah
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {isUpdatePackagingOpen && (
        <div
          id="authentication-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow  ">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
                data-modal-hide="authentication-modal"
                onClick={() => {
                  setNameInput("");
                  setDescInput("");
                  setPriceInput("");
                  setIsUpdatePackagingOpen(false);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium   ">
                  Update Packaging {selectedPackaging.name}
                </h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label
                      for="Name"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Nama Packaging
                    </label>
                    <input
                      type="text"
                      name="Name"
                      id="Name"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      placeholder={selectedPackaging.name}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="Desc"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Deskripsi Packaging
                    </label>
                    <input
                      type="text"
                      name="Desc"
                      id="Desc"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      placeholder={selectedPackaging.description}
                      onChange={(e) => setDescInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="Price"
                      className="block mb-2 text-sm font-medium   "
                    >
                      Harga Packaging
                    </label>
                    <input
                      type="text"
                      name="Price"
                      id="Price"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5        "
                      placeholder={selectedPackaging.price}
                      onChange={(e) => setPriceInput(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
                    onClick={(e) => {
                      e.preventDefault();
                      handlePackagingUpdateButton(selectedPackaging.id);
                    }}
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="w-full text-sm text-left text-gray-500  ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50    ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nama Packaging
            </th>
            <th scope="col" className="px-6 py-3">
              Deskripsi
            </th>
            <th scope="col" className="px-6 py-3">
              Harga
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

Packaging.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
