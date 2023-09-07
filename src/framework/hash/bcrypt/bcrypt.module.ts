import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

@Injectable()
export class BcryptModule {
  async getPasswordHash(password: string, passSalt: string) {
    try {
      const hash = await bcrypt.hash(password, passSalt);
      return await bcrypt.hash(hash, process.env.LOCAL_PASS_SALT);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getMailHash(mailKey: string) {
    try {
      return await bcrypt.hash(mailKey, process.env.LOCAL_MAIL_KEY_SALT);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateHash(length: number) {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateSalt(length: number) {
    try {
      return bcrypt.genSalt(length);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}