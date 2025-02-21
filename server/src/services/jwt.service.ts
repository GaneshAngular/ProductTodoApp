import jwt from 'jsonwebtoken'

const createToken=(data:any)=>{
    return jwt.sign(data,process.env.SECREAT_KEY||'',{expiresIn:'1d'})
}

const verifyToken=(token:string)=>{
    return jwt.verify(token,process.env.SECREAT_KEY||'')
}

const createRefreshToken=(data:any)=>{
    return jwt.sign(data,process.env.REFRESH_SECREAT_KEY||'',{expiresIn:'7d'})
}
const verifyRefreshToken=(refreshToken:string)=>{
    return jwt.verify(refreshToken,process.env.REFRESH_SECREAT_KEY||'')
}

export{
    verifyToken,
    createToken,
    createRefreshToken,
    verifyRefreshToken
}