import 'dotenv/config';

// 환경 변수를 안전하게 가져오는 헬퍼 함수
function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`환경 변수 ${key} 가 .env 파일에 설정되지 않았습니다.`);
    }
    return value;
}

export const config = {
    // Discord
    DISCORD_TOKEN: getEnv('DISCORD_TOKEN'),
    CLIENT_ID: getEnv('CLIENT_ID'),
    GUILD_ID: getEnv('GUILD_ID'),

    // RCON
    RCON_HOST: getEnv('RCON_HOST'),
    RCON_PORT: parseInt(getEnv('RCON_PORT'), 10),
    RCON_PASSWORD: getEnv('RCON_PASSWORD'),

    // DB
    DB_PATH: process.env.DB_PATH || 'db.json',

    LOGGER_NAME: getEnv('LOGGER_NAME'),
};