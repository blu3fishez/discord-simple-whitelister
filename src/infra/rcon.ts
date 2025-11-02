import { Rcon } from 'rcon-client';
import { config } from '../config';
import {logger} from "../logger/logger";

let rconClient: Rcon | null = null;

// RCON 클라이언트 연결 (싱글톤)
async function getRconClient(): Promise<Rcon> {
    if (rconClient && rconClient.authenticated) {
        return rconClient;
    }

    logger.info('[RCON] 서버에 연결합니다...');
    rconClient = new Rcon({
        host: config.RCON_HOST,
        port: config.RCON_PORT,
        password: config.RCON_PASSWORD,
    });

    // RCON 연결 실패 시
    rconClient.on('error', (error) => {
        logger.error('[RCON] 연결 오류:', error.message);
        rconClient = null; // 연결 초기화
    });

    await rconClient.connect();
    logger.info('[RCON] 연결되었습니다.');
    return rconClient;
}

/**
 * RCON을 통해 화이트리스트 추가 명령을 실행합니다.
 * @param username 마인크래프트 닉네임
 * @returns 성공 여부 (true/false)
 */
export async function addWhitelist(username: string): Promise<boolean> {
    try {
        const client = await getRconClient();
        const command = `whitelist add ${username}`;

        // RCON 명령 전송
        const response = await client.send(command);

        logger.info(`[RCON] 명령: "${command}" / 응답: "${response}"`);

        // 마인크래프트 서버 응답 기준 (성공 또는 이미 추가됨)
        if (response.includes('Added') || response.includes('already whitelisted')) {
            return true;
        }

        return false; // 그 외 (명령 실패 등)

    } catch (error) {
        logger.error('[RCON] 명령 실행 실패:', error);
        // 연결이 끊겼을 수 있으므로 클라이언트 초기화
        if (rconClient) {
            await rconClient.end();
            rconClient = null;
        }
        return false;
    }
}