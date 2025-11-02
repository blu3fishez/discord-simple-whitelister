import { Client, Events, GatewayIntentBits, ChannelType, Interaction, Message } from 'discord.js';
import { config } from './config';
import { db } from './infra/db';
import { getMinecraftUser } from './api/mojang';
import { addWhitelist } from './infra/rcon';
import {logger} from "./logger/logger";

// 🚨 중요: Privileged Intent가 필요합니다!
// Discord 개발자 포털(https://discord.com/developers/applications) 접속
// -> 봇 설정 -> "MESSAGE CONTENT INTENT"를 **반드시 켜주세요.**
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // <- 이 인텐트가 필수입니다!
    ],
});

/**
 * 봇 메인 실행 함수
 */
async function main() {
    // 1. DB 로드
    try {
        await db.read();
        logger.info('[DB] 데이터베이스를 성공적으로 불러왔습니다.');
    } catch (error) {
        logger.error('[DB] 데이터베이스 로드 실패:', error);
        return; // DB 로드 실패 시 봇 중지
    }

    // 2. 봇 준비 완료 이벤트
    client.once(Events.ClientReady, (readyClient) => {
        logger.info(`봇 준비 완료! ${readyClient.user.tag} (으)로 로그인했습니다.`);
    });

    // 3. 슬래시 커맨드 (채널 설정)
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'set-whitelist-channel') {
            const channel = interaction.options.getChannel('channel');

            if (!channel || channel.type !== ChannelType.GuildText) {
                await interaction.reply({ content: '텍스트 채널만 지정할 수 있습니다.', ephemeral: true });
                return;
            }

            try {
                db.data.whitelistChannelId = channel.id;
                await db.write(); // 변경사항 DB에 저장

                await interaction.reply({
                    content: `✅ 화이트리스트 신청 채널을 ${channel.name} (으)로 설정했습니다.`
                });
            } catch (error) {
                logger.error('[DB] 채널 ID 저장 실패:', error);
                await interaction.reply({ content: '채널 설정 중 오류가 발생했습니다.', ephemeral: true });
            }
        }
    });

    // 4. 메시지 수신 (화이트리스트 처리)
    client.on(Events.MessageCreate, async (message: Message) => {
        // 봇 메시지이거나, DM이면 무시
        if (message.author.bot || !message.guild) return;

        // DB에서 설정된 채널 ID가져오기 (매번 읽어서 최신 상태 유지)
        await db.read();
        const whitelistChannelId = db.data.whitelistChannelId;

        // 설정된 채널이 없거나, 메시지가 온 채널이 설정된 채널이 아니면 무시
        if (!whitelistChannelId || message.channel.id !== whitelistChannelId) {
            return;
        }

        // 메시지 내용을 닉네임으로 간주 (앞뒤 공백 제거, 첫 단어만)
        const username = message.content.trim().split(' ')[0];
        if (!username) return; // 내용이 없으면 무시

        // 1. Mojang API로 유저 검증
        const minecraftUser = await getMinecraftUser(username);

        if (!minecraftUser) {
            // 닉네임이 유효하지 않음 -> 거부 피드백
            await message.reply({
                content: `❌ \`${username}\` (이)라는 마인크래프트 유저를 찾을 수 없습니다. 닉네임을 확인해주세요.`
            });
            return;
        }

        // 2. RCON으로 화이트리스트 추가
        // (Mojang API가 반환한 정확한 대소문자 닉네임(minecraftUser.name) 사용)
        try {
            const success = await addWhitelist(minecraftUser.name);

            if (success) {
                // 성공 피드백
                await message.reply({
                    content: ` 성공! \`${minecraftUser.name}\` 님을 화이트리스트에 추가했습니다.`
                });
            } else {
                // 실패 피드백 (RCON 명령 실패)
                await message.reply({
                    content: `❌ RCON 서버 연결에 실패했거나 명령 실행에 실패했습니다. 서버 관리자에게 문의하세요.`
                });
            }
        } catch (error) {
            logger.error('[RCON] 치명적 오류:', error);
            await message.reply({ content: `❌ RCON 실행 중 심각한 오류가 발생했습니다.` });
        }
    });

    // 5. 봇 로그인
    client.login(config.DISCORD_TOKEN);
}

main();