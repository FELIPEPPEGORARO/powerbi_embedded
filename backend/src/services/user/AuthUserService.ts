import prismaClient from "../../Prisma";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken'



interface AuthRequest{
    email: string;
    password: string;
}


class AuthUserService{
    async execute({email, password}: AuthRequest){

        // verificar se o e-mail existe no banco de dados
        
        const user = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })

        if(!user) {
            throw new Error("User or password not found")
        }

        // preciso verificar se a senha esta correta

        const passwordMartch = await compare(password, user.password)

        if(!passwordMartch) {
            throw new Error("User or password not found")
        }

        // gerar token JWT após usuario realizar login 

        const token = sign(
            {
                name: user.name,
                email: user.email
            }, 
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }           
            
            )
       

        return { 
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
         }
    }
}

export {AuthUserService}