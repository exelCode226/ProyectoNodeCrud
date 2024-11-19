export const errorHandler=(err,req,res,next)=>{
console.error(err.stack)
res.status(500).json({
    message:"Error interno en el servidor",
    sucess:false
})
}