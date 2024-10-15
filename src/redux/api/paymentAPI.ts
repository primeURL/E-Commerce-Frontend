import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllCouponResponse
} from "../../types/api-types";

export const paymentAPI = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  tagTypes: ["payments"],
  endpoints: (builder) => ({
    allCoupons: builder.query<AllCouponResponse, string>({
      query: (userId) => ({
        url: `coupon/all?id=${userId}`,
        providesTags: ["payments"],
      })
    })
  
  }),
});

export const { useAllCouponsQuery } = paymentAPI