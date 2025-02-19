import bcrypt from "bcrypt";

const createHash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const compareHash = async (password: string, hashPassword: string) => {
      return bcrypt.compare(password,hashPassword)
};

export{
    createHash,
    compareHash
}

