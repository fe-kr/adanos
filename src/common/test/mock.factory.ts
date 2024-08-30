import { ModuleMocker, ClassLike } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

export const mockFactory = <T extends ClassLike>(token: T) => {
  const metadata = moduleMocker.getMetadata(token);

  const Mock = moduleMocker.generateFromMetadata(metadata);

  return new Mock();
};
