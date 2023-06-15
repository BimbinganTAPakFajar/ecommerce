import Error from "next/error";

export default function Forbidden() {
  return (
    <Error
      statusCode={403}
      title="Maaf, anda tidak memiliki akses ke halaman ini."
    />
  );
}
