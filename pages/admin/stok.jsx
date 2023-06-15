import axios from "axios";
import "moment/locale/id";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "@/components/layouts/AdminLayout";
import SuccessAlert from "@/components/SuccessAlert";
import LoadingBlocker from "@/components/LoadingBlocker";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session, "SESSION");
  const userID = session.user.user.id;
  console.log(session.user.user.id, "INI USER");
  const strapiJWT = session.user.jwt;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}products?populate=*`
  );
  const detailres = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details?populate=*`
  );
  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/${session.user.user.id}?populate=*`
  );
  const productdetails = detailres.data.data;
  const userRole = user.data.role.name;
  const products = res.data.data;

  console.log("PRODUCTS", products);
  return {
    props: {
      products,
      strapiJWT,
      userRole,
      productdetails,
    },
  };
}

export default function Stok({
  products,
  strapiJWT,
  userRole,
  productdetails,
}) {
  const moment = require("moment");
  moment.locale("id");
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [stockInput, setStockInput] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [currentProducts, setCurrentProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [addStockInput, setAddStockInput] = useState("");
  const [harvestedInput, setHarvestedInput] = useState("");
  const [selectedProductDetail, setSelectedProductDetail] = useState("");

  const handleOpenUpdate = (id, name, harvested) => {
    setSelectedProduct({ id, name, harvested });
    setIsUpdateStockOpen(true);
  };

  const updateProducts = async () => {
    let res;
    setIsLoading(true);
    try {
      res = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}products?populate=*`
      );
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR: ", error);
    } finally {
      setIsLoading(false);
    }

    const products = res.data.data;
    setCurrentProducts(products);
  };

  const handleStockUpdateButton = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}products/${id}`,
        {
          method: "PUT",
          data: {
            data: {
              stock: stockInput,
            },
          },
          headers: {
            Authorization: `Bearer ${strapiJWT}`,
          },
        }
      );
      console.log(res);
      await updateProducts();
      setIsUpdateStockOpen(false);
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

  const generateProductDetailOptions = () => {
    return productdetails.map(({ id, attributes: { name } }) => {
      return (
        <option key={`option-${id}`} value={id}>
          {name}
        </option>
      );
    });
  };
  const handleDeleteStok = async (id) => {
    let res;
    setIsLoading(true);
    try {
      res = await axios.delete(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}products/${id}`
      );
      await updateProducts();
      setIsAlertOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderRows = () => {
    return currentProducts.map(
      ({
        id,
        attributes: {
          product_detail: {
            data: {
              attributes: { name },
            },
          },
          harvested,
          stock,
        },
      }) => {
        return (
          <tr
            key={`stok-${id}`}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white cursor-pointer hover:underline"
            >
              {name}
            </th>
            <td className="px-6 py-4">
              {moment(harvested).format("DD MMMM YYYY")}
            </td>
            <td className="px-6 py-4">{stock}</td>

            <td className="px-6 py-4 flex gap-x-3">
              <button
                onClick={() => handleOpenUpdate(id, name, harvested)}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Update Stok
              </button>
              <button
                onClick={() => handleDeleteStok(id)}
                className="font-medium text-red-600  hover:underline"
              >
                Hapus Stok
              </button>
            </td>
          </tr>
        );
      }
    );
  };
  const handleAddStock = async () => {
    setIsLoading(true);
    let res;
    const newProduct = {
      product_detail: selectedProductDetail,
      harvested: harvestedInput,
      stock: addStockInput,
    };
    console.log(newProduct, "NEWPROD");
    try {
      res = await axios(`${process.env.NEXT_PUBLIC_STRAPI_URL}products`, {
        method: "POST",
        data: {
          data: newProduct,
        },
        headers: {
          Authorization: `Bearer ${strapiJWT}`,
        },
      });
      await updateProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAddStockOpen(false);

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
        className="w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={(e) => {
          e.preventDefault();
          setIsAddStockOpen(true);
        }}
      >
        Tambah Stok Baru
      </button>

      <SuccessAlert
        message={"Stok Berhasil Diperbarui!"}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
      <LoadingBlocker isOpen={isLoading} />
      {isAddStockOpen && (
        <div
          id="authentication-modal2"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() => setIsAddStockOpen(false)}
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
                <h3 className="mb-4 text-xl font-medium  dark:text-white">
                  Tambah Stok Baru
                </h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label
                      for="Stock"
                      className="block mb-2 text-sm font-medium  dark:text-white"
                    >
                      Stock
                    </label>
                    <input
                      type="text"
                      name="Stock"
                      id="Stock"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Stock"
                      onChange={(e) => setAddStockInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="productdetail"
                      className="block mb-2 text-sm font-medium  dark:text-white"
                    >
                      Pilih Produk
                    </label>
                    <select
                      id="productdetail"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setSelectedProductDetail(e.target.value)}
                    >
                      <option value="" selected disabled>
                        Pilih Produk
                      </option>
                      {generateProductDetailOptions()}
                    </select>
                  </div>

                  <div class="relative max-w-sm">
                    <label htmlFor="datepicker">Pilih Tanggal Panen</label>
                    <input
                      id="datepicker"
                      name="datepicker"
                      type="date"
                      onChange={(e) => {
                        setHarvestedInput(e.target.value);
                      }}
                      class="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddStock();
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
      {isUpdateStockOpen && (
        <div
          id="authentication-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() => setIsUpdateStockOpen(false)}
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
                <h3 className="mb-4 text-xl font-medium  dark:text-white">
                  Update Stock {selectedProduct.name}{" "}
                  {selectedProduct.harvested}
                </h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label
                      for="Stock"
                      className="block mb-2 text-sm font-medium  dark:text-white"
                    >
                      Stock
                    </label>
                    <input
                      type="text"
                      name="Stock"
                      id="Stock"
                      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Stock"
                      defaultValue={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStockUpdateButton(selectedProduct.id);
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
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nama Produk
            </th>
            <th scope="col" className="px-6 py-3">
              Tanggal Panen
            </th>
            <th scope="col" className="px-6 py-3">
              Stok
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

Stok.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
