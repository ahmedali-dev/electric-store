import connection from "../connection.js";



export function getUserByEmail(email, select = []) {
    select = select.length === 0 ? "*" : select.join(", ")
    return connection.execute(`select ${select} from users where email = ? limit 1`, [email])
}

export function getUserById(id, select = []) {
    select = select.length === 0 ? "*" : select.join(", ")
    return connection.execute(`select ${select} from users where id = ? limit 1`, [id])
}


export function createUser(userId, username, email, password, code, code_token, code_token_expire) {
    const data = [userId, username, email, password, code, code_token, code_token_expire];
    return connection.execute(
        "insert into users(id, username, email, password, is_active_code, is_active_code_token, is_active_code_token_expire) values (?,?,?,?,?,?,?)",
        data
    );
}

export function updateUser(where='id=?', columns=[], data=[]) {

    let col_name = ''
    columns = columns.map(col => {
        return col = `${col} = ?`;
    })

    
    return connection.execute(`update users set ${columns.join(', ')} where ${where}`, data);
}

