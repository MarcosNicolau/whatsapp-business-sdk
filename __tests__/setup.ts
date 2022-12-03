jest.resetModules();
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "..", ".env"), override: true });

//Setting a large timeout because we are making real API calls
//And some of them might take some time
jest.setTimeout(30 * 10000);
