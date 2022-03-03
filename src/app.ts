import * as express from "express";
import * as bodyParser from "body-parser";
import { errorHandler } from "./middlewares/error-handler.middleware";
import appRoutes from "./routes/app.routes";

class App {
  public app: express.Express;
  constructor() {
    this.app = express();

    this.initializedMiddleware();
    this.initializedRoutes();
    this.errorHandlerMiddleware();
  }

  private initializedMiddleware() {
    this.app.use(bodyParser.json());
  }

  private initializedRoutes() {
    this.app.use("/mini-insta", appRoutes);
  }

  private errorHandlerMiddleware() {
    this.app.use(errorHandler);
  }
}

export default new App();
