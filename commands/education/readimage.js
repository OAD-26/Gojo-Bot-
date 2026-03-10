module.exports = {
  name: 'readimage',
  category: 'education',
  description: 'Extract text from any image and send it as readable text.',
  usage: '.readimage (reply to image)',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply, quoted }) {
    if (!quoted || (!quoted.imageMessage && !quoted.viewOnceMessageV2?.message?.imageMessage)) {
      return reply('⚠️ Please reply to an image.');
    }
    reply(`📝 *Image Text Extraction*\n\n(Reading text... ♾️)`);
  }
};