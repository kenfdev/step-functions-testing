function createIdGenerator() {
  let id = 0;
  return () => {
    const idStr = id.toString().padStart(4, '0');
    id++;
    return idStr;
  };
}

export function generateMermaidMarkdown(title: string, events: any[]): string {
  const diagramContent = generateStateDiagramContent(events);
  return [
    `# ${title}

\`\`\`mermaid`,
  ]
    .concat(diagramContent)
    .concat(['```'])
    .join('\n');
}

export function generateStateDiagramContent(events: any[]): string {
  const getNextId = createIdGenerator();

  const states = findStateChanges(events, getNextId());
  return ['stateDiagram-v2'].concat(states).join('\n');

  function findStateChanges(events: any[], initialId: string = '') {
    let results: string[] = [];
    let previousId = initialId;
    for (let event of events) {
      if (!event.type) {
        const branchFinalIds: string[] = [];
        for (let key of Object.keys(event).sort()) {
          const branchResults = findStateChanges(event[key], previousId);
          results = results.concat(branchResults);
          const finalId =
            branchResults[branchResults.length - 1].split(' --> ')[1];

          branchFinalIds.push(finalId);
        }

        const joinId = getNextId();
        results.push(`state ${joinId} <<join>>`);
        for (const id of branchFinalIds) {
          results.push(`${id} --> ${joinId}`);
        }
        previousId = joinId;
      } else {
        const currentId = getNextId();

        const stateName = `state "${event.type}${
          event.detail && event.detail.name ? `\\n${event.detail.name}` : ''
        }" as ${currentId}`;
        results.push(stateName);
        results.push(`${previousId} --> ${currentId}`);
        previousId = currentId;
      }
    }
    return results;
  }
}
