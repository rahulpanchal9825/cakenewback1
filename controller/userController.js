import { User } from "../modals/userModal.js"
import { Product } from "../modals/productModal.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const register = async (req, res) => {
    try {
        const { userName, email, password, } = req.body;

        console.log(userName, email, password)
        if (!userName || !email || !password) {
            return res.status(401).json({
                message: "Something is missing ,please check",
                success: false
            })
        }
        const userUnique = await User.findOne({ email })
        if (userUnique) {
            return res.status(401).json({
                message: "Try Diffrerent Email",
                success: false
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName, email, password: hashPassword
        })
        return res.status(200).json({
            message: "Account Create Successfully",
            success: true
        })
    } catch (error) {

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing ,please check",
                success: false
            })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({
                message: "User does not exist",
                success: false
            })
        }
        const IsPassowrdMatch = await bcrypt.compare(password, existingUser.password)
        if (!IsPassowrdMatch) {
            return res.status(401).json({
                message: "Please Enter Correct Password",
                success: false
            })
        }
        const user = {
            _id: existingUser._id,
        }
        const token = await jwt.sign({ userId: existingUser?._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).json({
            message: "Login Successfully",
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookies("token", "", { maxAge: 0 }).json({
            message: "user logout successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const addproduct = async (req, res) => {
    const { title,category,price ,img} = req.body;
    try {
        if ( !title || !category ||!price ||!img) {
            return res.status(401).json({
                message: "Something is missing ,please check",
                success: false
            })
        }
        // const exstingProduct = await Product.findOne({ title: title })
        // if (exstingProduct) {
        //     return res.status(401).json({
        //         message: "Product Already exsist",
        //         success: false
        //     })
        // }
        await Product.create({title,category,price,img })
        let product = ({title,category,price ,img})
        return res.status(200).json({
            message: "Product Add successfully",
            success: true,
            product: product
        })

    } catch (error) {
        console.log(error)
    }
}
export const listProductCategory = async (req, res) => {
    try {
        const categoryProducts = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            }
        ]);

        // Convert the array into an object with category names as keys
        const formattedResponse = {};
        categoryProducts.forEach(item => {
            formattedResponse[item._id] = item.products;
        });

        return res.status(200).json({
            message: "Fetched category products",
            success: true,
            categoryProducts: formattedResponse,
            categoryProducts2:categoryProducts

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};



export const listProductAll = async (req, res) => {
    try {
        // Fetch all products from the database using Sequelize's findAll method
        const allProducts = await Product.find();  // Ensure Product is a valid Sequelize model
        // Check if products exist
        if (allProducts.length === 0) {
            return res.status(404).json({
                message: "No products found.",
                success: false,
                allProducts: []
            });
        }

        // Return a successful response with the fetched products
        return res.status(200).json({
            message: "Fetched all products successfully.",
            success: true,
            allProducts: allProducts
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching products:', error);

        // Send a generic error response with the error message
        return res.status(500).json({
            message: "Error fetching products",
            success: false,
            error: error.message
        });
    }
};

export const singleProduct = async (req, res) => {
    const { id } = req.query;  // Getting id from query parameters
    console.log("idd",id)
    try {
        if (!id) {
            return res.status(400).json({
                message: "Product ID is required.",
                success: false
            });
        }

        // Find the product by ID (assuming MongoDB + Mongoose or similar)
        const product = await Product.findById(id); // Sequelize way

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully.",
            success: true,
            product
        });

    } catch (error) {
        console.error('Error fetching product:', error);

        return res.status(500).json({
            message: "Error fetching product",
            success: false,
            error: error.message
        });
    }
};
