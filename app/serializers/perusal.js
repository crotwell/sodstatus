import ApplicationSerializer from './application';

export default class PerusalSerializer extends ApplicationSerializer {
  attrs= {
    tools: { serialize: true }
  };
}
