export default function ResiModal({ isOpen, onClose, resiData }) {
  if (!isOpen) return null;

  const {
    result: {
      manifest,
      summary: { courier_name },
      delivery_status: { status, pod_date, pod_time, pod_receiver },
      details: {
        waybill_number,
        waybill_date,
        shipper_name,
        receiver_name,
        origin,
        destination,
      },
    },
  } = resiData.rajaongkir;
  const generateListItems = () => {
    return manifest.map(
      ({ city_name, manifest_date, manifest_description, manifest_time }) => {
        return (
          <li key={`${city_name}${manifest_date}`} className="mb-5 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white    "></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400  ">
              {manifest_date + " " + manifest_time}
            </time>
            <h3 className="text-md font-semibold text-text  ">
              {`[${city_name}]  ${manifest_description}`}
            </h3>
          </li>
        );
      }
    );
  };

  const generateDetails = () => {
    return (
      <dl class="max-w-md text-text divide-y divide-gray-200    ">
        <div class="flex flex-col pb-3">
          <dt class="mb-1 text-gray-500 md:text-lg  ">Jasa Pengiriman</dt>
          <dd class="text-lg font-semibold">{courier_name}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg  ">Nomor Resi</dt>
          <dd class="text-lg font-semibold">{waybill_number}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg  ">Status</dt>
          <dd class="text-lg font-semibold">{status}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg  ">Tanggal Penerimaan</dt>
          <dd class="text-lg font-semibold">{`${pod_date || "-"} ${
            pod_time || "-"
          }`}</dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg  ">Penerima</dt>
          <dd class="text-lg font-semibold">{`${pod_receiver || "-"}`}</dd>
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
        <div className="relative bg-white rounded-lg shadow  ">
          <div className="flex items-center justify-between p-5 border-b rounded-t  ">
            <h3 className="text-xl font-medium text-text  ">
              Status Pengiriman
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-text rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
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
            <ol className="relative border-l border-gray-200 w-1/2">
              {generateListItems()}
            </ol>
            {generateDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}
