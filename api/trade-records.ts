import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { uniqueName = '563E3A78CDBAFB4E' } = req.query
  try {
    const response = await axios.get(`https://www.okx.com/priapi/v5/ecotrade/public/trade-records?uniqueName=${uniqueName}`);
    res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
  }
}
