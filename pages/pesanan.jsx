import { getSession } from "next-auth/react";
import LoadingBlocker from "@/components/LoadingBlocker";
import axios from "axios";
import { formatPrice } from "@/utils";
import { useState } from "react";
import "moment/locale/id";
import Script from "next/script";
import { useRouter } from "next/router";
import Error from "next/error";
import ErrorAlert from "@/components/ErrorAlert";
import { useEffect } from "react";
import ResiModal from "@/components/pesanan/ResiModal";
import OrderModal from "@/components/pesanan/OrderModal";
import DefaultLayout from "@/components/layouts/DefaultLayout";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userID = session.user.user.id;
  const strapiJWT = session.user.jwt;
  console.log(userID, strapiJWT, "INI USER");
  console.log(`${process.env.NEXT_PUBLIC_STRAPI_URL}users/me?populate=*`);
  console.log(`Bearer ${strapiJWT}`);
  const res = await axios(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/me?populate=*`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${strapiJWT}`,
      },
    }
  );
  const orders = res.data.orders;
  console.log(orders, userID, strapiJWT);
  return {
    props: { orders, userID, strapiJWT },
  };
}

export default function Pesanan({ orders, userID, strapiJWT }) {
  const router = useRouter();
  const moment = require("moment");
  moment.locale("id");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [resiModalContent, setResiModalContent] = useState({});
  const [isResiModalOpen, setIsResiModalOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalContent, setOrderModalContent] = useState({});

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  const openResiModal = (obj) => {
    setResiModalContent(obj);
    setIsResiModalOpen(true);
  };

  const handlePayment = async (id, uuid, total, penerima, phoneNumber) => {
    toggleLoading();
    const newUUID = `${uuid}-${moment().format("DDMMYYYYHHmmss")}`;
    const midtrans = {
      transaction_details: {
        order_id: newUUID,
        gross_amount: total,
      },
      customer_details: {
        first_name: penerima,
        phone: phoneNumber,
      },
    };
    const midtransres = await axios.post("/api/midtrans", midtrans);
    const { snapToken } = midtransres.data;

    window.snap.pay(snapToken, {
      onSuccess: async function (result) {
        /* You may add your own implementation here */

        const res = await axios(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}orders/${id}`,
          {
            method: "PUT",
            data: {
              data: {
                status: "Pembayaran Berhasil",
              },
            },
            headers: {
              Authorization: `Bearer ${strapiJWT}`,
            },
          }
        );
        router.reload();
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        alert("Mohon ditunggu! Anda akan diarahkan ke halaman pesanan");
        router.replace(`/pesanan`);
      },
      onError: function (result) {
        /* You may add your own implementation here */
        alert("Pembayaran gagal!");
        router.replace(`/pesanan`);
      },
      onClose: function () {
        /* You may add your own implementation here */
        setIsLoading(false);
        alert("Silahkan melanjutkan pembayaran di halaman pesanan");
        router.replace(`/pesanan`);
      },
    });
  };

  const handleCekResi = async (resi, courier) => {
    const data = {
      waybill: resi,
      courier: courier,
    };
    console.log(data, "cekresi data");
    let residata;
    try {
      setIsLoading(true);
      residata = await axios.post("/api/rajaongkir/waybill", data);
      openResiModal(residata.data);
    } catch (error) {
      setError(error.response.data.error);
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

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

  const statusColor = (status) => {
    if (status === "Pesanan Selesai") {
      return "h-2.5 w-2.5 rounded-full bg-green-500 mr-2";
    } else if (status === "Menunggu Pembayaran") {
      return "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2";
    } else if (status === "Pembayaran Gagal") {
      return "h-2.5 w-2.5 rounded-full bg-red-500 mr-2";
    } else if (status === "Pesanan Dikirim") {
      return "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2";
    } else if (status === "Pesanan Diproses") {
      return "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2";
    }
  };

  const renderActionButton = (
    status,
    resi,
    courier,
    { id, uuid, total, penerima, phoneNumber }
  ) => {
    if (status === "Menunggu Pembayaran" || status === "Pembayaran Gagal") {
      return (
        <button
          onClick={() => handlePayment(id, uuid, total, penerima, phoneNumber)}
          className="font-medium text-green-600"
        >
          Bayar
        </button>
      );
    } else
      return (
        <button
          onClick={() => handleCekResi(resi, courier)}
          className="font-medium text-green-600"
        >
          Cek Resi
        </button>
      );
  };
  const renderOrders = () => {
    return orders.map(
      ({
        id,
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
      }) => {
        return (
          <tr key={id} className="bg-white border-b">
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap  "
            >
              <div className="pl-3">
                <div
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
                  className="text-base font-semibold  cursor-pointer hover:underline"
                >
                  {uuid}
                </div>
                <div className="font-normal text-gray-500">
                  {moment(createdAt).format("DD MMMM YYYY")}
                </div>
              </div>
            </th>
            <td className="px-6 py-4">{formatPrice(total)}</td>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className={statusColor(status)}></div> {status}
              </div>
            </td>
            <td className="px-6 py-4">
              {renderActionButton(status, resi, courier, {
                id,
                uuid,
                total,
                penerima,
                phoneNumber,
              })}
            </td>
          </tr>
        );
      }
    );
  };
  return (
    <div className="w-full">
      <ErrorAlert isOpen={isAlertOpen} onClose={closeAlert} message={error} />
      <h1 className="text-4xl font-semibold text-black pb-8">Pesanan</h1>
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderData={orderModalContent}
      />
      <ResiModal
        isOpen={isResiModalOpen}
        onClose={() => setIsResiModalOpen(false)}
        resiData={resiModalContent}
      />
      <LoadingBlocker isOpen={isLoading} />
      <Script
        type="text/javascript"
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      ></Script>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left bg-[#DEDCD4]">
          <thead className="text-xs  uppercase bg-[#DEDCD4]">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID Pesanan
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Status Pembayaran
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{renderOrders()}</tbody>
        </table>
      </div>
    </div>
  );
}

Pesanan.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
