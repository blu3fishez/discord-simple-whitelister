// Mojang API 응답 타입
import {logger} from "../logger/logger";

export interface MinecraftUser {
    id: string;
    name: string;
}

/**
 * Mojang API를 호출하여 마인크래프트 유저 정보를 가져옵니다.
 * @param username 검색할 유저 닉네임
 * @returns MinecraftUser 객체 (찾음) 또는 null (못찾음)
 */
export async function getMinecraftUser(username: string): Promise<MinecraftUser | null> {
    try {
        // 공식 Mojang API 엔드포인트 사용
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);

        // 204 No Content 또는 404 Not Found는 유저가 없다는 의미
        if (response.status === 204 || response.status === 404) {
            return null;
        }

        // 기타 API 오류
        if (!response.ok) {
            logger.error(`[Mojang API] 에러 발생: ${response.statusText}`);
            return null;
        }

        const data: MinecraftUser = await response.json();
        // { id: "...", name: "CorrectCasedName" } 반환
        return data;

    } catch (error) {
        logger.error('[Mojang API] 호출 실패:', error);
        return null;
    }
}