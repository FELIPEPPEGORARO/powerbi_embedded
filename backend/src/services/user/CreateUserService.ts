import prismaClient from "../../Prisma/index"
import { hash } from 'bcryptjs'

interface UserRequest{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({name, email, password}: UserRequest){

    // verificar se enviou e-mail
        if(!email){
            throw new Error("Email Incorreto!");
    }

    // verificar se existe um e-mail

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {email: email}
        })
        if(userAlreadyExists){
            throw new Error("User already exists!");
        }

    // criptografia da senha
        const passwordHash = await hash(password, 8)

    
    // cadastrar usuario no banco de dados

        const user = await prismaClient.user.create({
            
            data: {name: name, email: email,password: passwordHash}       
        ,
        // selecionando campo visivel no post (retirando o password)
            select:{
                id: true,
                email: true
            }
        })

        return user;
    }
}

export { CreateUserService }