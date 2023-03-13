export default function LoginForm() {
  return (
    <form action="" method="post" className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <button className="bg-big text-white rounded-md p-2">Login</button>
    </form>
  );
}
