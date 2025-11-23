import jwt from 'jsonwebtoken'

export function accessToken(user) {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE;
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        kind: user.kind
    }
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn })
}


export function refreshToken(user) {
    const payload = {
        id: user.id,
    }
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRE;
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn })
}

export const refreshCookieExpire = 90 * 24 * 60 * 60 * 1000;
export const refreshCookieName = 'refresh_token';
export const refreshCookieSetting = {
    maxAge: refreshCookieExpire,
    secure: false,
    httpOnly: true,
    sameSite: "strict",
}
export function refreshCookie(user, res) {
    const refresh_token = refreshToken(user);
    res.cookie(refreshCookieName, refresh_token, refreshCookieSetting);
}

export function removeRefreshCookie(res) {
    res.clearCookie(refreshCookieName, refreshCookieSetting);
}