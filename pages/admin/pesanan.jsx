import AdminLayout from "@/components/layouts/AdminLayout";
import axios from "axios";
import "moment/locale/id";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import OrderModal from "@/components/pesanan/OrderModal";
import LoadingBlocker from "@/components/LoadingBlocker";
import { formatPrice } from "@/utils";
import SuccessAlert from "@/components/SuccessAlert";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session, "SESSION");
  const userID = session.user.user.id;
  console.log(session.user.user.id, "INI USER");
  const strapiJWT = session.user.jwt;
  const orderres = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}orders?populate=*`
  );
  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/${session.user.user.id}?populate=*`
  );
  console.log(user.data, "USER");
  const userRole = user.data.role.name;
  if (userRole !== "Admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/forbidden",
      },
    };
  }
  const orders = orderres.data.data;
  return {
    props: { orders, strapiJWT, userRole },
  };
}

export default function Pesanan({ orders, strapiJWT, userRole }) {
  const moment = require("moment");
  moment.locale("id");
  const [isLoading, setIsLoading] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalContent, setOrderModalContent] = useState({});
  const [currentOrders, setCurrentOrders] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isUpdateResiOpen, setIsUpdateResiOpen] = useState(false);

  const [resiInput, setResiInput] = useState("");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleOpenOrderDetails = ({
    cart,
    total,
    status,
    penerima,
    address,
    uuid,
    createdAt,
  }) => {
    setOrderModalContent({
      cart,
      total,
      status,
      penerima,
      address,
      uuid,
      createdAt,
    });
    setIsOrderModalOpen(true);
  };

  const handleClickUpdateResi = (uuid, id, resi) => {
    setSelectedOrder({ uuid, id });
    setResiInput(resi);
    setIsUpdateResiOpen(!isUpdateResiOpen);
  };

  const updatePesanan = async () => {
    const orderres = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}orders?populate=*`
    );
    const orders = orderres.data.data;
    setCurrentOrders(orders);
  };
  const handleResiUpdateButton = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}orders/${id}`,
        {
          method: "PUT",
          data: {
            data: {
              resi: resiInput,
            },
          },
          headers: {
            Authorization: `Bearer ${strapiJWT}`,
          },
        }
      );
      console.log(res);
      await updatePesanan();
      setIsUpdateResiOpen(false);
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
  const renderRows = () => {
    return currentOrders.map(
      ({
        id,
        attributes: {
          uuid,
          createdAt,
          total,
          status,
          penerima,
          address,
          phoneNumber,
          cart,
          resi,
          courier,
        },
      }) => {
        return (
          <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer hover:underline"
              onClick={() =>
                handleOpenOrderDetails({
                  cart,
                  total,
                  status,
                  penerima,
                  address,
                  uuid,
                  createdAt,
                })
              }
            >
              {uuid}
            </th>
            <td className="px-6 py-4">{formatPrice(total)}</td>
            <td className="px-6 py-4">
              {moment(createdAt).format("DD MMMM YYYY")}
            </td>
            <td className="px-6 py-4">{status}</td>
            <td className="px-6 py-4">
              <button
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                onClick={() => handleClickUpdateResi(uuid, id, resi)}
              >
                Update Resi
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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderData={orderModalContent}
      />
      <LoadingBlocker isOpen={isLoading} />

      <SuccessAlert
        message={"Nomor Resi Berhasil Diperbarui!"}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
      {isUpdateResiOpen && (
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
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() => setIsUpdateResiOpen(false)}
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
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  Update Nomor Resi Pesanan {selectedOrder.uuid}
                </h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label
                      for="resi"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Resi
                    </label>
                    <input
                      type="text"
                      name="resi"
                      id="resi"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="RESI"
                      defaultValue={resiInput}
                      onChange={(e) => setResiInput(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResiUpdateButton(selectedOrder.id);
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
              ID Pesanan
            </th>
            <th scope="col" className="px-6 py-3">
              Total
            </th>
            <th scope="col" className="px-6 py-3">
              Tanggal
            </th>
            <th scope="col" className="px-6 py-3">
              Status
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

Pesanan.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
