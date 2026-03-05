import { Graph } from '../model';
import { BrowserAlert, BrowserPrompt, ConsoleLog } from '../library';

export const getGraph = () => {
  const graph = new Graph();
  const n1 = new ConsoleLog('Some message');
  const n2 = new ConsoleLog('Second message');
  const n3 = new ConsoleLog('Third message');
  const p1 = new BrowserPrompt();
  const p2 = new BrowserAlert('Yo user');

  graph.addNode(n1);
  graph.addNode(n2);
  graph.addNode(p1);
  graph.addNode(n3);
  graph.addNode(p2);

  n3.message = 'Default 3rd Msg';

  graph.createFlowConnection(n1, n2);
  graph.createFlowConnection(n2, n3);
  graph.createFlowConnection(n3, p1);
  graph.createFlowConnection(p1, p2);

  graph.createDataConnection({ node: p1, port: 'result' }, { node: p2, port: 'message' });

  return graph;
};
