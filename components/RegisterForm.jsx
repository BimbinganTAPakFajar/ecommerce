export default function RegisterForm() {
  return (
    <form className="flex flex-col items-center justify-center flex-grow">
      <input
        type="text"
        placeholder="Username"
        className="border-2 border-gray-200 rounded-lg p-2 mb-4 w-96"
      />
      <input
        type="text"
        placeholder="Email"
        className="border-2 border-gray-200 rounded-lg p-2 mb-4 w-96"
      />
      <input
        type="text"
        placeholder="Password"
        className="border-2 border-gray-200 rounded-lg p-2 mb-4 w-96"
      />
      <input
        type="text"
        placeholder="Confirm Password"
        className="border-2 border-gray-200 rounded-lg p-2 mb-4 w-96"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-96"
      >
        Register
      </button>
    </form>
  );
}
