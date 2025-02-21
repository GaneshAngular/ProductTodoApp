
const EMPLOYEE='employee'
const ADMIN='admin'
const cookieOption:any = {
	httpOnly: true,
	secure: true,
	sameSite:'strict',
	path: "/",
	maxAge: 1000 * 60 * 60 * 24 * 7, 
};
export{
    EMPLOYEE,
    ADMIN,
    cookieOption,
}