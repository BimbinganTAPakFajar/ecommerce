import { getSession } from "next-auth/react";
import LoadingBlocker from "@/components/LoadingBlocker";
import axios from "axios";
import { formatPrice } from "@/utils";
import { useState } from "react";
import "moment/locale/id";
import Script from "next/script";
import { useRouter } from "next/router";

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
  const [isPaying, setIsPaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const togglePaying = () => {
    setIsPaying(!isPaying);
  };
  const [modalContent, setModalContent] = useState({});

  const toggleModal = (obj) => {
    setModalContent(obj);
    setIsModalOpen(!isModalOpen);
  };

  const handlePayment = async (id, uuid, total, penerima, phoneNumber) => {
    togglePaying();
    const midtrans = {
      transaction_details: {
        order_id: uuid,
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
        console.log(result);
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        alert("Mohon ditunggu! Anda akan diarahkan ke halaman pesanan");
        router.replace(`/pesanan`);

        console.log(result);
      },
      onError: function (result) {
        /* You may add your own implementation here */
        alert("Pembayaran gagal!");
        router.replace(`/pesanan`);
        console.log(result);
      },
      onClose: function () {
        /* You may add your own implementation here */
        router.replace(`/pesanan`);
        alert("Silahkan melanjutkan pembayaran di halaman pesanan");
      },
    });
  };

  const statusColor = (status) => {
    if (status === "Pembayaran Berhasil") {
      return "h-2.5 w-2.5 rounded-full bg-green-500 mr-2";
    } else if (status === "Menunggu Pembayaran") {
      return "h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2";
    } else if (status === "Pembayaran Gagal") {
      return "h-2.5 w-2.5 rounded-full bg-red-500 mr-2";
    }
  };
  const renderOrders = () => {
    return orders.map(
      ({ id, uuid, createdAt, total, status, penerima, phoneNumber }) => {
        return (
          <tr
            key={id}
            onClick={() => alert("hi")}
            className="bg-white border-b hover:bg-[#DEDCD4] hover:cursor-pointer"
          >
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
            >
              <div className="pl-3">
                <div className="text-base font-semibold">{uuid}</div>
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
              {status !== "Pembayaran Berhasil" ? (
                <button
                  onClick={() =>
                    handlePayment(id, uuid, total, penerima, phoneNumber)
                  }
                  className="font-medium text-green-600"
                >
                  Bayar
                </button>
              ) : (
                <></>
              )}
            </td>
          </tr>
        );
      }
    );
  };
  return (
    <div className="w-full">
      <h1 className="text-4xl font-semibold text-black pb-8">Pesanan</h1>
      <LoadingBlocker isOpen={isPaying} />
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
