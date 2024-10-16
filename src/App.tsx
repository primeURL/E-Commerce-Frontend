import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loader, { LoaderLayout } from "./components/Loader";
import ProtectedRoute from "./components/ProctectedRoute";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { saveToCart } from "./redux/reducer/cartReducer";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { RootState } from "./redux/store";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Product"));
const Customers = lazy(() => import("./pages/admin/Customer"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Discount = lazy(() => import("./pages/admin/Discount"));
const Barcharts = lazy(() => import("./pages/admin/Charts/BarCharts"));
const Piecharts = lazy(() => import("./pages/admin/Charts/PieCharts"));
const Linecharts = lazy(() => import("./pages/admin/Charts/LineCharts"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/Toss"));
const NewProduct = lazy(() => import("./pages/admin/Management/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/Management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/Management/TransactionManagement")
);
const DiscountManagement = lazy(
  () => import("./pages/admin/Management/DiscountManagement")
);

const NewDiscount = lazy(() => import("./pages/admin/Management/NewDiscount"));

const App = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );
  const timerId = useRef<NodeJS.Timeout>()
  const [timer,setTimer] = useState(52)

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        if(data.success === true){
          dispatch(userExist(data.user));
          dispatch(saveToCart(data.user.userCart))
        }
      } else dispatch(userNotExist());
    });
  }, []);

  useEffect(()=>{
    if(loading){
      timerId.current = setInterval(()=>{
        setTimer(prev => prev - 1)
      },1000)
    }else{
      setTimer(0)
      clearTimeout(timerId.current)
    }
    return () => {
      clearTimeout(timerId.current)
    }
  },[loading])
  
  return loading ? (
    <><Loader />
    <div style={{position:'absolute',top:'58%',left:'28%',fontSize:'25px',color:'gray'}}>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The server is deployed on Vercel free instance,</p>
      <p>which may take up to <strong style={{color:'green'}}>{timer} seconds </strong>to spin up a new instance.</p>
    </div>
    </>
    
  ) : (
    <Router>
      {/* Header */}
      <Header user={user} />
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Not logged In Route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          {/* Logged In User Routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />

            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />

            <Route path="/admin/discount/new" element={<NewDiscount />} />

            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;