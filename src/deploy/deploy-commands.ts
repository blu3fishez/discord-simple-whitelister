import { REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { config } from '../config';
import {logger} from "../logger/logger";

const commands = [
    new SlashCommandBuilder()
        .setName('set-whitelist-channel')
        .setDescription('이 채널을 화이트리스트 신청 채널로 지정합니다.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('지정할 텍스트 채널')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText) // 텍스트 채널만 선택 가능
        )
        // 관리자만 이 명령어를 사용할 수 있도록 설정
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

(async () => {
    try {
        logger.info('(/) 슬래시 커맨드를 등록합니다...');

        await rest.put(
            // Guild(서버) 전용 명령어 등록
            Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
            { body: commands },
        );

        logger.info('슬래시 커맨드 등록 완료.');
    } catch (error) {
        logger.error('슬래시 커맨드 등록 실패:', error);
    }
})();