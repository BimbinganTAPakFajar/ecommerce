import Image from "next/image";
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
    `${process.env.NEXT_PUBLIC_STRAPI_URL}product-backgrounds?populate=*`
  );
  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}users/${session.user.user.id}?populate=*`
  );
  const userRole = user.data.role.name;
  const productbackgrounds = res.data.data;
  return {
    props: {
      productbackgrounds,
      strapiJWT,
      userRole,
    },
  };
}

export default function Detil({ productbackgrounds, strapiJWT, userRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [currentProductBackgrounds, setCurrentProductBackgrounds] =
    useState(productbackgrounds);
  const [isUpdateProdukOpen, setIsUpdateProdukOpen] = useState(false);
  const [descriptions, setDescriptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [currentImageIDs, setCurrentImageIDs] = useState([]);
  const [imageInput, setImageInput] = useState([]);
  const [changedImage, setChangedImage] = useState("");

  const [changedImageURL, setChangedImageURL] = useState("");
  const [uploadedVideoId, setUploadedVideoId] = useState("");
  const [videoInput, setVideoInput] = useState([]);

  const [visibleImageUrls, setVisibleImageUrls] = useState([]);

  useEffect(() => {
    if (imageInput.length > 0) {
      uploadImage(changedImage, changedImageURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageInput]);

  useEffect(() => {
    if (videoInput.length > 0) {
      uploadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoInput]);

  useEffect(() => {
    if (isAlertOpen === true) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000);
    }
  }, [isAlertOpen]);

  const updateProducts = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}product-backgrounds?populate=*`
    );
    const products = res.data.data;
    setCurrentProductBackgrounds(products);
  };
  const uploadVideo = async () => {
    const formData = new FormData();

    formData.append("files", videoInput[0]);

    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        formData
      );
      setUploadedVideoId(res.data[0].id);
    } catch (error) {
      console.log("UPLOAD VIDEO ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageChange = (e, changedImage, urlChange) => {
    setChangedImageURL(urlChange);
    setChangedImage(changedImage);
    setImageInput(e.target.files);
  };

  const swapArrayContents = (arr, prev, newContent) => {
    const newArr = [...arr];
    const prevIndex = newArr.indexOf(prev);
    newArr[prevIndex] = newContent;
    return newArr;
  };

  const newData = () => {
    const data = {};
    if (uploadedVideoId !== "") {
      data.video = uploadedVideoId;
    }

    data.descriptions = descriptions;
    data.images = currentImageIDs;

    return data;
  };
  const uploadImage = async (changedImage, changedImageURL) => {
    const formData = new FormData();
    formData.append("files", imageInput[0]);

    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        formData
      );

      setCurrentImageIDs([
        ...swapArrayContents(currentImageIDs, changedImage, res.data[0].id),
      ]);

      setVisibleImageUrls([
        ...swapArrayContents(
          visibleImageUrls,
          changedImageURL,
          res.data[0].url
        ),
      ]);
    } catch (error) {
      console.log("UPLOAD IMAGE ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdate = (id, images, video_url, descriptions) => {
    const imageUrlArr = [];

    const imageIDs = images.map(({ id, attributes: { url } }) => {
      imageUrlArr.push(url);
      return id;
    });
    setVisibleImageUrls(imageUrlArr);
    setCurrentImageIDs(imageIDs);
    setSelectedProduct({ id, images, video_url, descriptions });
    setDescriptions(descriptions);
    setIsUpdateProdukOpen(true);
  };

  const renderRows = () => {
    return currentProductBackgrounds.map(
      ({
        id,
        attributes: {
          product_detail: {
            data: {
              attributes: { name },
            },
          },
          images: { data: images },
          video: {
            data: [
              {
                attributes: { url: video_url },
              },
            ],
          },
          descriptions,
        },
      }) => {
        return (
          <tr key={`detail${id}`} className="bg-white border-b    ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-text whitespace-nowrap   cursor-pointer hover:underline"
            >
              {name}
            </th>

            <td className="px-6 py-4 flex">
              <button
                onClick={() =>
                  handleOpenUpdate(id, images, video_url, descriptions)
                }
                className="font-medium text-blue-600   hover:underline"
              >
                Update Detil Produk
              </button>
            </td>
          </tr>
        );
      }
    );
  };

  const handleDescriptionChange = (e, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index].description = e.target.value;
    setDescriptions(newDescriptions);
  };
  const handleDescriptionSubheaderChange = (e, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index].subheader = e.target.value;
    setDescriptions(newDescriptions);
  };

  const generateEditImageFields = () => {
    return selectedProduct.images.map(({ id, attributes: { url } }, i) => {
      return (
        <div key={`edit${id}`} className="flex gap-x-3">
          <Image
            className="aspect-square overflow-hidden rounded-md"
            src={visibleImageUrls[i]}
            width={150}
            height={150}
          ></Image>
          <div>
            <div className="">
              <input
                className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                id="file_input"
                type="file"
                onChange={(e) => handleImageChange(e, id, visibleImageUrls[i])}
              />
            </div>
            <div>
              <label
                for="judul"
                className="block mb-2 text-sm font-medium text-text  "
              ></label>
              <input
                type="text"
                name="judul"
                id="judul"
                className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                placeholder={descriptions[i].subheader}
                required=""
                onChange={(e) => handleDescriptionSubheaderChange(e, i)}
              />
            </div>
            <div>
              <label
                for="desc"
                className="block mb-2 text-sm font-medium text-text  "
              ></label>
              <input
                type="text"
                name="desc"
                id="desc"
                className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                placeholder={descriptions[i].description}
                required=""
                onChange={(e) => handleDescriptionChange(e, i)}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  const handleUpdateProduk = async (e) => {
    e.preventDefault();
    const data = newData();
    try {
      setIsLoading(true);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}product-backgrounds/${selectedProduct.id}`,
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
      await updateProducts();
      setIsUpdateProdukOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      console.log("UPDATE PRODUK BACKGROUND ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const generateModal = () => {
    return (
      <div
        id="defaultModal"
        tabindex="-1"
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full"
      >
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative p-4 bg-white rounded-lg shadow   sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5  ">
              <h3 className="text-lg font-semibold text-text  ">
                Update Detil Produk
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-text rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
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
              <div className="flex flex-col gap-y-2">
                <div className="">
                  <label
                    className="block mb-2 text-sm font-medium text-text  "
                    for="file_input"
                  >
                    Upload Video
                  </label>
                  <input
                    className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                    id="file_input"
                    type="file"
                    onChange={(e) => setVideoInput(e.target.files)}
                  />
                </div>
                {generateEditImageFields()}
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
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
    );
  };
  if (userRole !== "Admin")
    return (
      <div className="py-10">Anda tidak memiliki akses ke halaman ini</div>
    );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <SuccessAlert
        message={"Stok Berhasil Diperbarui!"}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
      <LoadingBlocker isOpen={isLoading} />

      {isUpdateProdukOpen && generateModal()}
      <table className="w-full text-sm text-left text-gray-500  ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50    ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nama Produk
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

Detil.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
