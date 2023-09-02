import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IAwsService {
  abstract savePicture( file: any, productId:number, repository: string): any
}