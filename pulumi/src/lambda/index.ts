import { Backend } from 'typings';
import Start from './Start';
import Stop from './Stop';

export default (inputs: Backend.Inputs) => {
  // ECS Start
  const start = Start(inputs);

  // ECS Stop
  const stop = Stop(inputs.ECS);

  return {
    Start: start,
    Stop: stop,
  };
};
