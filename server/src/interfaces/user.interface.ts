
interface User{
    name: string;
    email: string;
    department:string;
    salary:number;
    password: string;
    role:'admin'|'employee';
    isActive: boolean;

}

export default User;