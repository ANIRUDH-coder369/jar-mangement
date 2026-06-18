import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.apis";
import { todoApi } from "./apis/todo.apis";
import { vendorApi } from "./apis/vendor.apis";
import { customerApi } from "./apis/customer.apis";
import { jarApi } from "./apis/jar.apis";
import { superadminApi } from "./apis/superadmin.apis";
import { chartApi } from "./apis/chart.apis";
import { reviewApi } from "./apis/review.apis";
import jarPriceReducer from "./slices/jarPriceSlice";


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [todoApi.reducerPath]: todoApi.reducer,
        [vendorApi.reducerPath]: vendorApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [jarApi.reducerPath]: jarApi.reducer,
        [superadminApi.reducerPath]: superadminApi.reducer,
        [chartApi.reducerPath]: chartApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        jarPrice: jarPriceReducer,
    },
    middleware: def => def().concat(authApi.middleware, todoApi.middleware, vendorApi.middleware, customerApi.middleware, jarApi.middleware, superadminApi.middleware, chartApi.middleware, reviewApi.middleware)
})

export type RootState = ReturnType<typeof reduxStore.getState>

export default reduxStore