import express from "express";
import Product from "./interfaces/product.interface";

const app= express();


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Node!');
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})