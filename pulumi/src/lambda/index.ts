import { Backend } from 'typings';
import Start from './Start';
import Stop from './Stop';
import Status from './Status';

export default (inputs: Backend.Inputs) => {
  // ECS Start
  const start = Start(inputs);

  // ECS Stop
  const stop = Stop(inputs);

  // ECS Status
  const status = Status(inputs);

  return [start, stop, status];
};
