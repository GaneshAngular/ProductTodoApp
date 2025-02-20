

interface AUTH{
   name?:string;
   email:string;
   password:string;
   role?:string
}

interface Employee{
    name:string,
    email:string;
    password:string;
    dob:Date;
    joinDate:Date;
    Salary:number;
}

export type {
  AUTH,
  Employee
}

