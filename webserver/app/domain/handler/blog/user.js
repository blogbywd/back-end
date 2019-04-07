//登出
const logout = async (ctx) => {
    ctx.session = null;
    ctx.body = {
        code: 0,
        msg: '登出成功'
    }
}

module.exports = {
    logout: logout
};