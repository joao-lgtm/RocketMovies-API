require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");
const cors = require("cors")

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes)
migrationsRun();


app.use((error, request, response, next) => {
    if (error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error);


    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

const PORT = 4444;



app.listen(PORT , () => console.log(`server is running onport ${PORT}`))