import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers";
import { router } from "./router/routes";

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      <p className="mt-4 text-muted-foreground">Загрузка...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <AppProviders>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
};

export default App;




