import { Backend } from 'typings';
import Start from './start';
import Stop from './stop';

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
