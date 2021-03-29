export function getDataTransfertMock(kind: string = 'file') {
  return {
    preventDefault() {},
    dataTransfer: {
      items: [
        {
          kind,
          getAsFile: () => ({
            name: 'mock.sketch',
          }),
        },
      ],
    },
  };
}
