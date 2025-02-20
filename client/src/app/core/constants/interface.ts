

interface AUTH{
   name?:string;
   email:string;
   password:string;
   role?:string
}

interface Employee{
    name:string,
    email:string;
    position:string;
    password:string;
    dob:string;
    role:string;
    department:string;
    salary:number;
}

export type {
  AUTH,
  Employee
}

