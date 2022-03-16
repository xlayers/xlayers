describe('Editor page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.icon_wrapper').spread((firstFramework) => {
      firstFramework.click({ force: true });
    });
  });

  it('the editor should open demo file', () => {
    cy.contains('Select A Demo File').click({ force: true });
    cy.contains('md-components-cards-welcome-back').click({ force: true });
    cy.location('hash').should('eq', '#/editor/preview');
  });

  // TODO: Fix upload/drag'n drop
  // it('the editor should open input file', () => {
  //   cy.wait(500);

  //   cy.get('xly-browse-files').children('input').then((subject) => {
  //     cy.window().then(win => cy
  //       .fixture('md-components.sketch', 'base64')
  //       .then(Cypress.Blob.base64StringToBlob)
  //       .then((blob) => {
  //         const el = subject[0]
  //         const testFile = new win.File([blob], name, { type: 'application/octet-stream' })
  //         const dataTransfer = new win.DataTransfer()
  //         dataTransfer.items.add(testFile)
  //         el.files = dataTransfer.files
  //         cy.wrap(subject).click({ force: true })
  //       }))
  //   });
  //   cy.location('hash').should('eq', '#/editor/preview');
  // });
});
