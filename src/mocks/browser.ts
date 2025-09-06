import { worker } from "./worker";

// Start the worker in development mode
worker.start({
  onUnhandledRequest: "bypass",
});
