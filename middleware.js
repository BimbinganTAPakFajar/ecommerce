export { default } from "next-auth/middleware";

export const config = { matcher: ["/keranjang", "/pesanan/:path*"] };