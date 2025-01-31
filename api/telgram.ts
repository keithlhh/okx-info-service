import type { VercelRequest, VercelResponse } from '@vercel/node';
const axios = require('axios');
global.start = false;
global.prev = '';
global.timer = null;
global.count = 0;

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
  }
  console.log(global.start, 'global')
  if (global.start) {
    res.json({
      message: 'Already running' + global.count,
    });
    return;
  }
  try {
    global.start = true;
    
    global.timer = setInterval(() => {
      global.count += 1;
      console.log(global.count, global.start, '666')
      axios.get(`https://www.okx.com/priapi/v5/ecotrade/public/positions-v2?uniqueName=${uniqueName}`).then((ret) => {
        const response = ret;
        const data = response?.data?.data ?? {};
        const strData = JSON.stringify(data);
        axios.post(
          "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
          {
            chat_id: "1604598018",
            text: new Date() + " " + "正在运行中..." + global.count,
          }
        );
        if (strData !== global.prev) {
          axios.post(
            "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
            {
              chat_id: "-4259724953",
              text: strData,
            }
          );
        }
      }).catch(error => {
        console.error(error, 'axios');
      })
    }, 2000)
    res.json({count: global.count, timme: new Date().toLocaleDateString() + ''});
  } catch (error) {
    axios.post(
      "https://api.telegram.org/bot7456345325:AAGydyNYEeAXeNmJrxYmHY5zT3iNqlR6ycI/sendMessage",
      {
        chat_id: "1604598018",
        text: new Date() + " " + "运行错误" + global.count,
      }
    );
      console.error(error);
      // res.status(500).send('Error fetching data');
  }
}
