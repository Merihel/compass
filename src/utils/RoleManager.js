const config = require("../../config.json")
const Discord = require("discord.js")


class RoleManager {
    constructor() {
        this.roles = config.roles
    }

    /**
     * Used to check for Discord role permission (for bot commands in example)
     *
     * @actions
     * @param {String} roleId - The roleId to check 
     * @param {String} level - The level of permission needed
     *
     * @return {Object} An object with a 'message' explaining the reason and a 'result' as a boolean (true if permitted, false otherwise)  
    */
    checkRole(roleId = null, level) {
        if (!roleId) return { result: false, message: "No roleId provided"}
        const role = this.roles.filter(role => {
            return role.id === roleId
        })
        if (role[0]) {
            if (role[0].level >= level) {
                return { result: true, message: "User have sufficient level" }
            } else {
                return { result: false, message: "User doesn't have sufficient level of permission" }
            }
        } else {
            return { result: false, message: "Cannot find role with roleId `"+roleId+"`" }
        }
    }

    /**
     * Used to get the most leveled role of a Guild Member
     *
     * @param {Discord.GuildMember} member - The Discord Guild's member to get the role from
     *
     * @return {Discord.Role} The highest role of the user, null if not found
    */
    getHighestRoleFromDiscordMember(member) {
        const role = member ? member.roles ? member.roles.highest : null : null
        return role
    }
    /**
     * 
     * Used to get the mute role according to config
     *
     * @param {Discord.Guild} member - The Discord Guild's to get the role from
     *
     * @return {Discord.Role} The highest role of the user, null if not found
    */
    getMutedRole(guild) {
        const role = guild.roles.cache.find(role => role.id === config.mutedRoleId);
        return role
    }


}

module.exports = new RoleManager()