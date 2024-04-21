const { Embed } = require("guilded.js");

module.exports = {
  name: "ban",
  description: "ban a member from the server.",
  run: async (client, message, args) => {
    if (message.authorId !== message.server?.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Error!")
        .setDescription("You need to be a server owner to execute this command.");

      return message.reply({ embeds: [embed] });
    }
    
    // Log authorId and message.server.ownerId
    console.log("authorId:", message.authorId);
    console.log("ownerId:", message.server.ownerId);

    let targetId;
    if (message.mentions && message.mentions.users) {
      targetId = message.mentions.users[0].id;
    } else {
      targetId = args[0];
    }

    if (targetId) {
      const target = await client.members.fetch(`${message.serverId}`, targetId)
        .catch(() => {
          const embed = new Embed()
            .setColor("RED")
            .setTitle("Error!")
            .setDescription("That user does not exist.");

          return message.reply({ embeds: [embed] });
        });

      if (!target.isOwner) {
        await target.ban()
          .then(() => {
            const embed = new Embed()
              .setColor("GREEN")
              .setTitle("Success ✅")
              .setDescription(`**${target.username}** (\`${target.id}\`) has been kicked!`);

            return message.reply({ embeds: [embed] });
          });
      } else {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Error!")
          .setDescription("That user cannot be kicked.");

        return message.reply({ embeds: [embed] });
      }
    } else {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Error!")
        .setDescription("Please mention or provide a user ID to ban a user. Here's an example: `p!kick [@username]`");

      return message.reply({ embeds: [embed] });
    }
  },
};