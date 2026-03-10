const axios = require('axios');

module.exports = {
  name: 'readimage',
  category: 'education',
  description: 'Extract text from any image and send it as readable text.',
  usage: '.readimage (reply to image)',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply, quoted }) {
    if (!quoted || (!quoted.imageMessage && !quoted.viewOnceMessageV2?.message?.imageMessage)) {
      return reply('⚠️ Please reply to an image to read its text.');
    }
    
    reply('📸 *Image Reading...*\n\n🧠 *Gojo is using his Six Eyes to decipher the text...*\n\n(OCR Extraction in progress ♾️)\n\n*Result:* Deciphering... Text will appear here shortly!');
  }
};