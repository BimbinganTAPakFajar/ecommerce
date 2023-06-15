import axios from "axios";
import "moment/locale/id";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "@/components/layouts/AdminLayout";
import SuccessAlert from "@/components/SuccessAlert";
import { formatPrice } from "@/utils";
import LoadingBlocker from "@/components/LoadingBlocker";
import Link from "next/link";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session, "SESSION");
  const userID = session.user.user.id;
  console.log(session.user.user.id, "INI USER");
  const strapiJWT = session.user.jwt;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?populate=*`
  );
  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/${session.user.user.id}?populate=*`
  );
  const userRole = user.data.role.name;
  const products = res.data.data;
  return {
    props: {
      products,
      strapiJWT,
      userRole,
    },
  };
}

export default function Produk({ products, strapiJWT, userRole }) {
  const [currentProducts, setCurrentProducts] = useState(products);

  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUpdateProdukOpen, setIsUpdateProdukOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const [uploadedImageId, setUploadedImageId] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [files, setFiles] = useState([]);

  const updateProducts = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?populate=*`
    );
    const products = res.data.data;
    setCurrentProducts(products);
  };
  const uploadImage = async () => {
    const formData = new FormData();

    formData.append("files", files[0]);

    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        formData
      );
      setUploadedImageId(res.data[0].id);
    } catch (error) {
      console.log("UPLOAD IMAGE ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      uploadImage();
    }
  }, [files]);

  useEffect(() => {
    if (isAlertOpen === true) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000);
    }
  }, [isAlertOpen]);
  const newData = () => {
    const data = {};
    if (nameInput !== "") data.name = nameInput;
    if (categoryInput !== "") data.category = categoryInput;
    if (priceInput !== "") data.price = priceInput;
    if (uploadedImageId !== "") data.image = uploadedImageId;
    return data;
  };

  const handleUpdateProduk = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details/${selectedProduct.id}`,
        {
          method: "PUT",
          data: {
            data: newData(),
          },
          headers: {
            Authorization: `Bearer ${strapiJWT}`,
          },
        }
      );
      await updateProducts();
      setIsUpdateProdukOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      console.log("UPDATE PRODUK ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["Sayur", "Buah", "Biji", "Ternak", "Umbi"];
  const generateCategoryOptions = () => {
    return categories.map((category) => {
      if (category === selectedProduct.category)
        return (
          <option key={`option${category}`} value={category} selected>
            {category}
          </option>
        );
      return (
        <option key={`option${category}`} value={category}>
          {category}
        </option>
      );
    });
  };

  const handleOpenUpdate = (id, name, category, url, price, sold) => {
    setSelectedProduct({ id, name, category, url, price, sold });
    setIsUpdateProdukOpen(true);
  };
  const renderRows = () => {
    return currentProducts.map(
      ({
        id,
        attributes: {
          name,
          category,
          image: {
            data: [
              {
                attributes: { url },
              },
            ],
          },
          sold,
          price,
        },
      }) => {
        return (
          <tr
            key={`curr${id}`}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer hover:underline"
            >
              {name}
            </th>
            <td className="px-6 py-4">{category}</td>
            <td className="px-6 py-4">{formatPrice(price)}</td>

            <td className="px-6 py-4">
              <button
                onClick={() =>
                  handleOpenUpdate(id, name, category, url, price, sold)
                }
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Update Produk
              </button>
            </td>
          </tr>
        );
      }
    );
  };
  if (userRole !== "Admin")
    return (
      <div className="py-10">Anda tidak memiliki akses ke halaman ini</div>
    );
  return (
    <div>
      <Link
        href={
          "https://docs.google.com/forms/d/e/1FAIpQLScq_EuWgEj8tDZDGABD1YkihVUCBVt7pq_wp3FdjN_PMHNWug/viewform"
        }
        target="blank"
        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
      >
        <svg
          className="mr-1 -ml-1 w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        Tambah Produk Baru
      </Link>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <SuccessAlert
          message={"Stok Berhasil Diperbarui!"}
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
        />
        <LoadingBlocker isOpen={isLoading} />
        const [isLoading, setIsLoading] = useState(false);
        {isUpdateProdukOpen && (
          <div
            id="defaultModal"
            tabindex="-1"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full"
          >
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Produk
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="defaultModal"
                    onClick={() => setIsUpdateProdukOpen(false)}
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
                </div>
                <form action="#">
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        for="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={selectedProduct.name}
                        required=""
                        onChange={(e) => setNameInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={formatPrice(selectedProduct.price)}
                        required=""
                        onChange={(e) => setPriceInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setCategoryInput(e.target.value)}
                      >
                        {generateCategoryOptions()}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        for="file_input"
                      >
                        Upload Gambar
                      </label>
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={(e) => handleUpdateProduk(e)}
                  >
                    <svg
                      className="mr-1 -ml-1 w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Update Produk
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Kategori
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
    </div>
  );
}

Produk.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
