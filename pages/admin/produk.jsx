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
  const [isAddProdukOpen, setIsAddProdukOpen] = useState(false);
  const [uploadedImageId, setUploadedImageId] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [files, setFiles] = useState([]);

  const [newNameInput, setNewNameInput] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newPriceInput, setNewPriceInput] = useState("");
  const [productImage, setProductImage] = useState([]);

  const [videoInput, setVideoInput] = useState([]);
  const [subheader1, setSubheader1] = useState("");
  const [subheader2, setSubheader2] = useState("");
  const [subheader3, setSubheader3] = useState("");
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [desc3, setDesc3] = useState("");
  const [img1, setImg1] = useState([]);
  const [img2, setImg2] = useState([]);
  const [img3, setImg3] = useState([]);

  const handleAddProduk = async (e) => {
    e.preventDefault();
    console.log("newnameinput: ", newNameInput);
    console.log("newcategoryinput: ", newCategoryInput);
    console.log("newpriceinput: ", newPriceInput);
    console.log("productimage: ", productImage);
    console.log("videoinput: ", videoInput);
    console.log("subheader1: ", subheader1);
    console.log("subheader2: ", subheader2);
    console.log("subheader3: ", subheader3);
    console.log("desc1: ", desc1);
    console.log("desc2: ", desc2);
    console.log("desc3: ", desc3);
    console.log("img1: ", img1);
    console.log("img2: ", img2);
    console.log("img3: ", img3);

    if (
      newNameInput === "" ||
      newCategoryInput === "" ||
      newPriceInput === "" ||
      productImage.length === 0 ||
      videoInput.length === 0 ||
      subheader1 === "" ||
      subheader2 === "" ||
      subheader3 === "" ||
      desc1 === "" ||
      desc2 === "" ||
      desc3 === "" ||
      img1.length === 0 ||
      img2.length === 0 ||
      img3.length === 0
    ) {
      alert("Mohon isi semua field");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${strapiJWT}`,
      },
    };

    setIsLoading(true);
    try {
      const prodImageFormData = new FormData();
      prodImageFormData.append("files", productImage[0]);
      const prodImageRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        prodImageFormData
      );
      const prodImageId = prodImageRes.data[0].id;

      const newProdData = {
        name: newNameInput,
        category: newCategoryInput,
        price: newPriceInput,
        image: prodImageId,
      };

      const newProdRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}product-details`,
        {
          data: newProdData,
        },
        config
      );
      console.log(newProdRes.data, "NEW PROD RES");
      const newProdId = newProdRes.data.data.id;

      const videoFormData = new FormData();
      videoFormData.append("files", videoInput[0]);
      const videoRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        videoFormData
      );
      const videoId = videoRes.data[0].id;

      const img1FormData = new FormData();
      img1FormData.append("files", img1[0]);
      const img1res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        img1FormData
      );
      const img1Id = img1res.data[0].id;

      const img2FormData = new FormData();
      img2FormData.append("files", img2[0]);
      const img2res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        img2FormData
      );
      const img2Id = img2res.data[0].id;

      const img3FormData = new FormData();
      img3FormData.append("files", img3[0]);
      const img3res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}upload`,
        img3FormData
      );
      const img3Id = img3res.data[0].id;

      const descriptions = [
        {
          subheader: subheader1,
          description: desc1,
        },
        {
          subheader: subheader2,
          description: desc2,
        },
        {
          subheader: subheader3,
          description: desc3,
        },
      ];

      const newBackgroundData = {
        video: videoId,
        images: [img1Id, img2Id, img3Id],
        descriptions: descriptions,
        product_detail: newProdId,
      };

      const newBackgroundRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}product-backgrounds`,
        {
          data: newBackgroundData,
        },
        config
      );

      setIsAlertOpen(true);
      await updateProducts();
      setIsAddProdukOpen(false);
    } catch (error) {
      console.log("ADD PRODUK ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    const data = newData();
    if (Object.keys(data).length === 0) {
      alert("Tidak ada data yang diubah");
      return;
    }
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

  const generateNewProductCategoryOptions = () => {
    return categories.map((category) => {
      return (
        <option key={`new-option${category}`} value={category}>
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
          <tr key={`curr${id}`} className="bg-white border-b    ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-text whitespace-nowrap   cursor-pointer hover:underline"
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
                className="font-medium text-blue-600   hover:underline"
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
      <button
        onClick={() => setIsAddProdukOpen(true)}
        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center       mb-4"
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
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <SuccessAlert
          message={"Stok Berhasil Diperbarui!"}
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
        />
        <LoadingBlocker isOpen={isLoading} />
        {isUpdateProdukOpen && (
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
                    Update Produk
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
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        for="name"
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Nama
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                        placeholder={selectedProduct.name}
                        required=""
                        onChange={(e) => setNameInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="price"
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Harga
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                        placeholder={formatPrice(selectedProduct.price)}
                        required=""
                        onChange={(e) => setPriceInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="category"
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Kategori
                      </label>
                      <select
                        id="category"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5            "
                        onChange={(e) => setCategoryInput(e.target.value)}
                      >
                        {generateCategoryOptions()}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="block mb-2 text-sm font-medium text-text  "
                        for="file_input"
                      >
                        Upload Gambar
                      </label>
                      <input
                        className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                        id="file_input"
                        type="file"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
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
        {isAddProdukOpen && (
          <div
            id="defaultModal"
            tabindex="-1"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-screen overflow-y-scroll">
              <div className="relative p-4 bg-white rounded-lg shadow   sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5  ">
                  <h3 className="text-lg font-semibold text-text  ">
                    Tambah Produk
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-text rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
                    data-modal-toggle="defaultModal"
                    onClick={() => setIsAddProdukOpen(false)}
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
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Nama
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                        required=""
                        onChange={(e) => setNewNameInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="price"
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Harga
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                        required=""
                        onChange={(e) => setNewPriceInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        for="category"
                        className="block mb-2 text-sm font-medium text-text  "
                      >
                        Kategori
                      </label>
                      <select
                        id="category"
                        className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5            "
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                      >
                        <option value="" selected disabled>
                          Pilih Kategori
                        </option>
                        {generateNewProductCategoryOptions()}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="block mb-2 text-sm font-medium text-text  "
                        for="file_input"
                      >
                        Upload Gambar Produk
                      </label>
                      <input
                        className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                        id="file_input"
                        type="file"
                        onChange={(e) => setProductImage(e.target.files)}
                      />
                    </div>
                    <div className="sm:col-span-2">
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
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col gap-y-3">
                      <label
                        className="block mb-2 text-sm font-medium text-text  "
                        for="file_input"
                      >
                        Upload Gambar Media Tanam
                      </label>
                      <div className="">
                        <input
                          className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                          id="file_input"
                          type="file"
                          onChange={(e) => setImg1(e.target.files)}
                        />
                      </div>
                      <div>
                        <label
                          for="judul"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Nama Media Tanam
                        </label>
                        <input
                          type="text"
                          name="judul"
                          id="judul"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setSubheader1(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          for="desc"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Deskripsi Media Tanam
                        </label>
                        <input
                          type="text"
                          name="desc"
                          id="desc"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setDesc1(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <label
                        className="block mb-2 text-sm font-medium text-text  "
                        for="file_input"
                      >
                        Upload Gambar Pupuk
                      </label>
                      <div className="">
                        <input
                          className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                          id="file_input"
                          type="file"
                          onChange={(e) => setImg2(e.target.files)}
                        />
                      </div>
                      <div>
                        <label
                          for="judul"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Nama Pupuk
                        </label>
                        <input
                          type="text"
                          name="judul"
                          id="judul"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setSubheader2(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          for="desc"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Deskripsi Pupuk
                        </label>
                        <input
                          type="text"
                          name="desc"
                          id="desc"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setDesc2(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <label
                        className="block mb-2 text-sm font-medium text-text  "
                        for="file_input"
                      >
                        Upload Gambar Pestisida
                      </label>
                      <div className="">
                        <input
                          className="block w-full text-sm text-text border border-gray-300 rounded-lg cursor-pointer bg-gray-50   focus:outline-none      "
                          id="file_input"
                          type="file"
                          onChange={(e) => setImg3(e.target.files)}
                        />
                      </div>
                      <div>
                        <label
                          for="judul"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Nama Pestisida
                        </label>
                        <input
                          type="text"
                          name="judul"
                          id="judul"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setSubheader3(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          for="desc"
                          className="block mb-2 text-sm font-medium text-text  "
                        >
                          Deskripsi Pestisida
                        </label>
                        <input
                          type="text"
                          name="desc"
                          id="desc"
                          className="bg-gray-50 border border-gray-300 text-text text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5            "
                          required=""
                          onChange={(e) => setDesc3(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center      "
                    onClick={(e) => handleAddProduk(e)}
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
                    Tambah Produk
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <table className="w-full text-sm text-left text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50    ">
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
