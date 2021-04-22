class RulesController {
    constructor() {
    }

    async onRuleMessageReaction(reaction, user) {
        if(!user.bot) {
            if(reaction.emoji.name === '👍') {
                const guild = reaction.message.guild;
                const memberWhoReacted = await guild.members.fetch(user.id);
                let flagGotRookieLevel = true
                reaction.message.guild.roles.fetch().then(role => {
                    console.log(role.name)
                    if(role.name === "Racoon") {
                        console.log("racoonRole", role)
                        let flagAddRole = false
                        memberWhoReacted.roles.cache.forEach(role => {
                            if(role.name === "Newbie") flagAddRole = true
                        })
                        if(flagAddRole) {
                            memberWhoReacted.roles.add(role)
                        }
                    }
                })
                
    //          console.log(reaction.message.channel)
    //          console.log("USER", user)
            }
        }
        
    }
}

module.exports = RulesController