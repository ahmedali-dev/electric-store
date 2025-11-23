import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function generateToken(bytes = 32) {
    const token = crypto.randomBytes(bytes).toString('hex');
    const token_hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, token_hash }
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function hashPassword(password) {
    return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

export function randomNumber(len) {
    const number = '1234567890';
    const result = [];
    for(let i=0;i<len;i++){
        result.push(number[Math.floor(Math.random()*number.length-1)])
    }

    return result.join('')
}