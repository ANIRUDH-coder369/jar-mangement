import { configureStore } from "@reduxjs/toolkit"
import { vendorApi } from "../apis/vendor.api"
import { customerApi } from "../apis/customer.api"
import { jarApi } from "../apis/jar.api"
import { chartApi } from "../apis/chart.api"
import { reviewApi } from "../apis/review.api"

export const store = configureStore({
  reducer: {
    [vendorApi.reducerPath]: vendorApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [jarApi.reducerPath]: jarApi.reducer,
    [chartApi.reducerPath]: chartApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (def) =>
    def({ immutableCheck: false, serializableCheck: false }).concat(
      vendorApi.middleware,
      customerApi.middleware,
      jarApi.middleware,
      chartApi.middleware,
      reviewApi.middleware
    ),
})
