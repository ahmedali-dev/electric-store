import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Flip, ToastContainer } from "react-toastify";
import store from "./store/store.jsx";
import "./assets/css/main.css";
import { AuthProvider } from "./hooks/useAuth.jsx";
const query_client = new QueryClient();
createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={query_client}>
		<BrowserRouter>
			<AuthProvider>
				<Provider store={store}>
					<ToastContainer
						stacked
						theme="colored"
						transition={Flip}
						autoClose={2000}
					/>

					<App />
				</Provider>
			</AuthProvider>
		</BrowserRouter>
	</QueryClientProvider>
);
