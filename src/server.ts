import app from "./app.js";


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // await connectDB();
    // console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();