import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import { RegisterInput  } from "./auth.validation.js";
import { generateToken } from "../../utils/generateToken.js";


export const registerUser =  async (data: RegisterInput)=>{
    const {name, email,  password , role} = data;

    const existingUser = await User.findOne({ email});
    if(existingUser){
        throw new Error("User with this email already exists");
    }
    const hashPassword =  await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        role,
        password: hashPassword
    });
    const token = generateToken(newUser._id.toString(), newUser.role);
    return {
        token,
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };

};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error("Invalid password");
    }
    const token = generateToken(user._id.toString(), user.role);
    return {
        token,
        id: user._id,
        name: user.name,    
        email: user.email,
        role: user.role
    };
};


