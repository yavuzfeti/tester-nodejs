export default (req,res,next) =>
{
    console.log("Hostname: "+req.hostname+"\nZaman: "+new Date().toUTCString()+"\nMetod: "+req.method);
    next();
};