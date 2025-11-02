import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { config } from '../config';

// DB에 저장될 데이터 타입 정의
type DbData = {
    whitelistChannelId: string | null;
};

// 기본값
const defaultData: DbData = { whitelistChannelId: null };
const adapter = new JSONFile<DbData>(config.DB_PATH);

export const db = new Low<DbData>(adapter, defaultData);