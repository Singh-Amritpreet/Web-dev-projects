import express, { response } from "express";
import axios from "axios";
import path from "path";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "views", "index.html"));
});

app.post("/location", async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const response = await axios.get(
            `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`,
            {
                headers: {
                    "x-access-token": "openuv-512nlrmq570cw3-io"
                }
            }
        );

        const data = response.data.result;
        
        res.json({
            success: true,
            content: {
                currentUv: data.uv,
                maxUV: data.uv_max
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch UV data"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});