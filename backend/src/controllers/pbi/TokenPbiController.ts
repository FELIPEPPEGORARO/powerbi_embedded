import { Request, Response } from 'express';
import PowerBiBusiness from '../../services/pbi/pbiToken';

class PowerBiAuthenticationController {
  async handle(req: Request, res: Response) {
    const powerBiBusiness = new PowerBiBusiness();
    
    try {
      const authentication = await powerBiBusiness.getPowerBiAuthentication();
      const { accessToken, reportId, clientId, embedUrl, expiry } = authentication;
      
      return res.json({
        accessToken,
        reportId,
        clientId,
        embedUrl,
        expiry
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching Power BI authentication.' });
    }
  }
}

export { PowerBiAuthenticationController };