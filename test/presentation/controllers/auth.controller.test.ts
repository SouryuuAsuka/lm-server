import { Test } from '@nestjs/testing';
import { AuthController } from '@src/presentation/controllers';
import { AuthUseCases } from '@src/application/use-cases/auth.use-case';

describe('AuthController', () => {
  let authController: AuthController;
  let authUseCases: AuthUseCases;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthUseCases],
    }).compile();
    authUseCases = moduleRef.get < AuthUseCases > (AuthUseCases);
    authController = moduleRef.get < AuthController > (AuthController);
  });
  /*escribe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(authUseCases, 'validateUser').mockImplementation(() => result);
      expect(await authController.findAll()).toBe(result);
    });
  });*/
});