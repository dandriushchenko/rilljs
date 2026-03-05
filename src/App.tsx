import { snippets } from './content/snippets.ts';
import { RillEditor } from './Editor';
import { getGraph } from './content/graph.ts';

export function App() {
  return (
    <div className='app-container'>
      <RillEditor graph={getGraph()} options={{ design: { snippets } } as never} />
    </div>
  );
}
