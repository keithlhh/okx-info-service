import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
global.start = false;
global.prev = '';
global.timer = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { uniqueName = '563E3A78CDBAFB4E', run = '1' } = req.query;
  const timer = null;
  if (run == '0') {
    global.start = false;
    global.prev = '';
    clearInterval(global.timer);
    res.json({
      message: 'Already stop',
    });
    return;
    return;
  }
  if (global.start) {
    res.json({
      message: 'Already running',
    });
    return;
  }
  try {
    global.start = true;
    global.timer = setInterval(async () => {
      global.start = true;
      const response = await axios.get(`https://www.okx.com/priapi/v5/ecotrade/public/positions-v2?uniqueName=${uniqueName}`);
      res.json(response.data);
  
      const data = response?.data?.data;
      const strData = JSON.stringify(data);
      const test = new Date().getSeconds();
      if (test % 30 == 0) {
        axios.post(
          "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
          {
            chat_id: "1604598018",
            text: new Date() + " " + "正在运行中...",
          }
        );
      }
      if (strData !== global.prev) {
        axios.post(
          "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
          {
            chat_id: "-4259724953",
            text: strData,
          }
        );
      }
    }, 2000)
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
  }
}
