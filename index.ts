import app from "./src/app";
import { connectDataBase } from "./src/database";

// Connection DataBase
connectDataBase()
  .then(() => {
    console.log("DataBase is connected");

    // Execute APP and listen request to PORT
    app.listen(app.get("port"), () => {
      console.log(
        `[SERVER ON]: Running in http://localhost:${app.get("port")}`
      );
    });
  })
  .catch((err) => console.log(`[Database Connection Error]: ${err}`));
