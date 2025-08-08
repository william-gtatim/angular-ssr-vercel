import("../distangular-ssr-vercel/server/server.mjs")
    .then(module => module.app)
    .catch(error => {
        console.error("Failed to load server module:", error);
        throw error;
    });
export default async (req, res) => {
    const { app } = await import("../distangular-ssr-vercel/server/server.mjs");
    return app(req, res);
};