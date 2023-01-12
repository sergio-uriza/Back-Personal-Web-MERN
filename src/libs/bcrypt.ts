import bcrypt from "bcryptjs";

export const hashString = async (text: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(text, salt);
  return hash;
};

export const compareWithHash = async (text: string, hash: string) => {
  return await bcrypt.compare(text, hash);
};
