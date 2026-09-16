// Executado quando nenhuma rota corresponde à requisição.
module.exports = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
};