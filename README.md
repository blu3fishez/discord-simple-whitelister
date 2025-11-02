# Simple Whitelister

RCON을 사용하여 디스코드에서 직접 마인크래프트 서버의 화이트리스트를 관리하는 봇입니다.

낮은 지연 시간을 위해 이 봇을 마인크래프트 서버와 동일한 머신에서 호스팅하는 것을 권장합니다. 하지만, 환경 변수에 RCON 호스트를 지정하여 원격 서버에도 연결할 수 있습니다.

## 주요 기능

- 디스코드 기반 화이트리스트: 사용자가 특정 채널에서 닉네임을 입력하여 서버 화이트리스트에 자신을 추가할 수 있습니다.

- 채널 설정 기능: 서버 관리자가 간단한 명령어로 화이트리스트 명령을 받을 특정 채널을 지정할 수 있습니다. (설정 저장은 lowdb 사용)

- RCON 연동: RCON 프로토콜을 사용하여 마인크래프트 서버와 안전하게 통신합니다.

- 간편한 설정: 주요 설정은 .env 파일을 통해 관리됩니다.

## 준비 사항

- Node.js (v18.x 이상 권장)
- pnpm
- RCON이 활성화된 실행 중인 마인크래프트 서버

## 설치 및 설정

1. 저장소 복제:

```shell
git clone https://github.com/blu3fishez/discord-simple-whitelister.git
cd discord-minecraft-bot
```

2. pnpm을 사용하여 의존성 설치:

```shell
pnpm install
```

3. 환경 변수 설정. 프로젝트 루트에 .env 파일을 생성하고 필요한 값을 입력합니다.

```
DISCORD_TOKEN= # 봇 토큰
CLIENT_ID= # 봇 ID
GUILD_ID= # 서버 ID

# 2. Minecraft RCON
RCON_HOST= # localhost 추천
RCON_PORT=
RCON_PASSWORD=

# 3. LowDB
DB_PATH= # whitelist 채널정보를 저장할 데이터베이스 파일. db.json 추천

LOGGER_NAME=# 로그에 나타나는 프로젝트 이름
```

RCON 포트와 비밀번호는 마인크래프트 서버의 server.properties 파일에 설정된 값과 일치해야 합니다.

## 명령어

- `/set-whitelist-channel channel:`: (관리자 전용) 현재 채널을 화이트리스트 명령을 받는 유일한 채널로 설정합니다.

## 실행 방법

### 개발 환경

개발 모드로 봇을 실행합니다 (nodemon 등을 사용 시 자동 재시작):

```shell
pnpm dev
```

### 프로덕션 (실제 서비스) 환경

빌드 후에 빌드된 프로젝트를 실행하는 방식입니다.

```shell
pnpm build # 빌드시에만 필요
pnpm start
```

더 안정적인 서비스 운영(자동 재시작, 모니터링)을 위해 pm2 사용을 권장합니다!

```shell
# pm2로 봇 시작
pm2 start pnpm --name "discord-mc-bot" -- start

# 로그 확인
pm2 logs discord-mc-bot

# 중지
pm2 stop discord-mc-bot
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참고하세요.