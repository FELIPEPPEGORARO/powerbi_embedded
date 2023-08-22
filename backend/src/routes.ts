import  multer from 'multer';
import { Router } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewars/isAuthenticated';
import uploadConfig from './config/multer';
import { PowerBiAuthenticationController } from './controllers/pbi/TokenPbiController';


const router = Router();

const upload = multer(uploadConfig.upload("./tmp"))

// rotas user

router.post('/users', new CreateUserController().handle)

// Rota login

router.post('/session', new AuthUserController().handle)

// buscar itens do usuario

router.get('/me', isAuthenticated, new DetailUserController().handle)

// buscar dados de token

router.get('/pbiObject', new PowerBiAuthenticationController().handle)



export { router };