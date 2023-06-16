import { formatPrice } from "@/utils";
import moment from "moment";
import Image from "next/image";
export default function OrderModal({ orderData, isOpen, onClose }) {
  const moment = require("moment");
  moment.locale("id");
  if (!isOpen) return null;
  const {
    cart,
    total,
    status,
    penerima,
    address: {
      address_details,
      city: { label: citylabel },
      phone,
      subdistrict: { label: subdistrictlabel },
      province: { label: provincelabel },
    },
    uuid,
    createdAt,
  } = orderData;
  const generateCartItems = () => {
    return cart.map(({ id, name, amount, src }) => {
      return (
        <div
          key={`${id}${name}`}
          class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 p-2"
        >
          <Image
            width={50}
            height={50}
            src={src}
            alt=""
            class=" rounded-md aspect-square overflow-hidden"
          />

          <div class="flex flex-col justify-between leading-normal pl-2">
            <h5 class=" text-lg font-bold text-text ">{`${name} ${amount}kg`}</h5>
          </div>
        </div>
      );
    });
  };

  const generateDetails = () => {
    return (
      <dl class="max-w-md w-1/2 text-text divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        <div class="flex flex-col pb-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            ID Pesanan
          </dt>
          <dd class="text-lg font-semibold">{uuid}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Tanggal Pemesanan
          </dt>
          <dd class="text-lg font-semibold">
            {moment(createdAt).format("DD MMMM YYYY")}
          </dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Total
          </dt>
          <dd class="text-lg font-semibold">{formatPrice(total)}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Status
          </dt>
          <dd class="text-lg font-semibold">{`${status}`}</dd>
        </div>

        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Penerima
          </dt>
          <dd class="text-lg font-semibold">{`${penerima}`}</dd>
        </div>
      </dl>
    );
  };

  const generateAddress = () => {
    return (
      <dl class="max-w-md w-1/2 text-text divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        <div class="flex flex-col pb-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Alamat Lengkap
          </dt>
          <dd class="text-lg font-semibold">{`${address_details}, ${subdistrictlabel}, ${citylabel}, ${provincelabel}`}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Nomor HP
          </dt>
          <dd class="text-lg font-semibold">{phone}</dd>
        </div>
      </dl>
    );
  };
  return (
    <div
      id="extralarge-modal"
      tabindex="-1"
      className={`fixed inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-scroll md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center`}
    >
      <div className="relative w-full max-w-7xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-medium text-text dark:text-white">
              Detail Pemesanan
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-text rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="extralarge-modal"
              onClick={onClose}
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
          <div className="p-6 flex gap-x-4">
            <div className="w-1/3 flex flex-col">
              <dt class="mb-2 text-gray-500 md:text-lg dark:text-gray-400">
                Daftar Barang
              </dt>
              {generateCartItems()}
            </div>
            {generateAddress()}
            {generateDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}
