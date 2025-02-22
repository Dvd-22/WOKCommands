"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const CommandErrors_1 = __importDefault(require("../enums/CommandErrors"));
module.exports = (guild, command, instance, member, user, reply) => {
    if (!guild || !member) {
        return true;
    }
    const { error } = command;
    const roles = command.getRequiredRoles(guild.id);
    if (roles && roles.length) {
        const missingRoles = [];
        const missingRolesNames = [];
        for (const role of roles) {
            if (!member.roles.cache.has(role)) {
                missingRoles.push(role);
                missingRolesNames.push(guild.roles.cache.get(role)?.name);
            }
        }
        if (missingRoles.length) {
            if (error) {
                error({
                    error: CommandErrors_1.default.MISSING_ROLES,
                    command,
                    message: null,
                    info: {
                        missingRoles,
                    },
                });
            }
            else {
                reply(instance.messageHandler.get(guild, 'MISSING_ROLES', {
                    ROLES: missingRolesNames.join(', '),
                })).then((message) => {
                    if (!message) {
                        return;
                    }
                    if (instance.delErrMsgCooldown === -1 || !message.deletable) {
                        return;
                    }
                    setTimeout(() => {
                        message.delete();
                    }, 1000 * instance.delErrMsgCooldown);
                });
            }
            return false;
        }
    }
    return true;
};
