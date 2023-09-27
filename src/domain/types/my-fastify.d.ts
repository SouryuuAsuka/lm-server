import { FastifyRequest } from "fastify";
import { userRequest } from "../entities/userRequest.entity";

declare module "fastify" {
  interface FastifyRequest {
    incomingFile: Storage.MultipartFile;
    user: userRequest
  }
}