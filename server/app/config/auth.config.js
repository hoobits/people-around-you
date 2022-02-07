module.exports = {
    secret: "secret-key",
    jwtExpiration: 600, // 10 min - Token life time must be short !
    refreshTokenName: "refresh-token",
    refreshTokenExpiration: 3600, // 1 hour
    rememberRefreshTokenExpiration:1296000, // 15 days
    cookieParserSecret: "secret-key",
};