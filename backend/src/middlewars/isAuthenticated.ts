import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


interface PayLoad{
    sub: string; // id do user
}


export function isAuthenticated(req: Request, res: Response, next: NextFunction){

    // receber o token
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ")

    // validar o token

    try {
        const { sub } = verify(
            token, 
            process.env.JWT_SECRET
        ) as PayLoad;

        // recuperar o id do token e colocar dentro de uma variavel dentro do req.
        // foi criado a pasta types com "user_id" e liberado no tsconfig "typeRoots"
        req.user_id = sub;

        return next();
        
    } catch (err) {
        return res.status(401).end();        
    }
    
}