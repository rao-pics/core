import { config } from "./src/config";
import { folder } from "./src/folder";
import { library } from "./src/library";
import { pending } from "./src/pending";
import { t } from "./src/utils";

export const router = t.router({
  config,
  library,
  pending,
  folder,
});

export type AppRouter = typeof router;
export { t } from "./src/utils";
export type { PendingTypeEnum } from "./src/pending";
